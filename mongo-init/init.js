// MongoDB initialization script
// Creates databases and users for each microservice

db = db.getSiblingDB('userdb');
db.createCollection('users');
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
print('userdb initialized');

db = db.getSiblingDB('activitydb');
db.createCollection('activities');
db.activities.createIndex({ "category": 1 });
db.activities.createIndex({ "title": "text", "description": "text", "tags": "text" });
print('activitydb initialized');

db = db.getSiblingDB('sessiondb');
db.createCollection('sessions');
db.createCollection('favorites');
db.sessions.createIndex({ "userId": 1 });
db.sessions.createIndex({ "userId": 1, "status": 1 });
db.favorites.createIndex({ "userId": 1, "activityId": 1 }, { unique: true });
print('sessiondb initialized');

print('All wellness databases initialized successfully!');
