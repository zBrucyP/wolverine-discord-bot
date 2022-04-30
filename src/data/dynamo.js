const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

class UserDB {
    constructor() {
        this.dynamoClient = new DynamoDBClient({ 
            region: "us-east-2",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        if (UserDB.instance) {
            return UserDB.instance;
        }
        
        UserDB.instance = this;
    }

    async insertUser(user) {
        const params = {
            TableName: 'wolverine-user-table',
            Item: {
                'username': {S: `${user.username}`.toUpperCase()},
                'id': {S: user.id},
                'lastSeen': {S: Date.now().toString()}
            }
        };
        const command = new PutItemCommand(params);
    
        try {
            const data = await this.dynamoClient.send(command);
        } catch (error) {
            console.warn(`Failed to insert user in table: ${error}`);
            return false;
        }
        return true;    
    }

    async fetchUser(username) {
        const params = {
            TableName: 'wolverine-user-table',
            Key: {
                username: {S: username.toUpperCase()}
            }
        };
        const command = new GetItemCommand(params);
    
        try {
            const res = await this.dynamoClient.send(command);
            const user = res?.Item;
            return user ? user : null;
        } catch (error) {
            console.warn(`Failed to fetch data on user: ${error}`);
        }
    }
}

module.exports = {
    UserDB
}