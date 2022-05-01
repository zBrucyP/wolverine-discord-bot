"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class UserDB {
    constructor() {
        this.dynamoClient = new client_dynamodb_1.DynamoDBClient({
            region: "us-east-2",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
    }
    static getInstance() {
        if (!UserDB.instance) {
            UserDB.instance = new UserDB();
        }
        return UserDB.instance;
    }
    insertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: 'wolverine-user-table',
                Item: {
                    'username': { S: `${user.username}`.toUpperCase() },
                    'id': { S: user.id },
                    'lastSeen': { S: Date.now().toString() }
                }
            };
            const command = new client_dynamodb_1.PutItemCommand(params);
            try {
                const data = yield this.dynamoClient.send(command);
            }
            catch (error) {
                console.warn(`Failed to insert user in table: ${error}`);
                return false;
            }
            return true;
        });
    }
    fetchUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: 'wolverine-user-table',
                Key: {
                    username: { S: username.toUpperCase() }
                }
            };
            const command = new client_dynamodb_1.GetItemCommand(params);
            try {
                const res = yield this.dynamoClient.send(command);
                const user = res === null || res === void 0 ? void 0 : res.Item;
                return user ? user : null;
            }
            catch (error) {
                console.warn(`Failed to fetch data on user: ${error}`);
            }
        });
    }
}
exports.default = UserDB;
