// MongoDB initialization script for PetLove
db = db.getSiblingDB('petlove');

// Create collections
db.createCollection('users');
db.createCollection('pets');
db.createCollection('orders');
db.createCollection('adoptions');
db.createCollection('appointments');
db.createCollection('visits');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.pets.createIndex({ "name": 1 });
db.pets.createIndex({ "species": 1 });
db.pets.createIndex({ "breed": 1 });
db.orders.createIndex({ "user_id": 1 });
db.adoptions.createIndex({ "user_id": 1 });
db.adoptions.createIndex({ "pet_id": 1 });
db.appointments.createIndex({ "user_id": 1 });
db.visits.createIndex({ "user_id": 1 });

print('PetLove database initialized successfully!');
