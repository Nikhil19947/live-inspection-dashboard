const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Your MongoDB URI (already correct)
const uri = 'mongodb+srv://factree:factree14@cluster0.tf5ubbi.mongodb.net/LoginDB?retryWrites=true&w=majority';

// Create a MongoClient instance without deprecated options
const client = new MongoClient(uri);

async function createUser() {
    const username = "sampleUser";  // The username you want to insert
    const plainPassword = "password123";  // The plain-text password

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Define the user object to insert into MongoDB
    const user = {
        username: username,
        password: hashedPassword,  // Insert the hashed password
    };

    try {
        await client.connect();  // Connect to MongoDB

        // Correctly reference the existing "FactreeDB" database and "users" collection
        const database = client.db("FactreeDB");  // Correct database name
        const usersCollection = database.collection("users");  // The name of the collection

        // Insert user into the "users" collection
        await usersCollection.insertOne(user);
        console.log("User created in FactreeDB!");
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        await client.close();  // Close MongoDB connection
    }
}

createUser().catch(console.error);
