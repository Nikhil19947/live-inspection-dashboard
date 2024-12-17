from flask import request, jsonify
import uuid
from werkzeug.security import generate_password_hash,check_password_hash
from mysql.connector import Error
import mysql
from settings import *
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

#Add user 
def register():
    """
    Example Payload:
    {
        "username": "prasanna123",
        "password": "12345",
        "role": "operator"
    }
    Response:
    {
        "message": "User successfully registered!",
        "user_id": "e2374dde-0586-4191-b582-58900f332743"
    }
    """

    data = request.get_json()

    # Generate a unique user ID
    user_id = str(uuid.uuid4())
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # Either 'admin' or 'operator'

    if not username or not password or not role:
        return jsonify({"error": "Username, password, and role are required"}), 400

    # Validate role
    if role not in ['admin', 'operator']:
        return jsonify({"error": "Role must be either 'admin' or 'operator'"}), 400

    connection = None  
    try:
        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            user=USER,
            password=PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor()

         # Check if the database exists, and create it if not
            cursor.execute("SHOW DATABASES LIKE 'dummydb'")
            result = cursor.fetchone()

            if not result:
                cursor.execute("CREATE DATABASE dummydb")
                print("Database 'dummydb' created successfully.")

            #  Now connect to the newly created or existing database
            connection.database = 'dummydb'

            #  Check if the users table exists, create if not
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(36) PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'operator') NOT NULL
            )
            """)

            # Check if the username already exists
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({'message': 'Username already exists'}), 400

            # Hash the password before storing it in the database
            hashed_password = generate_password_hash(password)

            # Insert new user into the database
            insert_query = """
            INSERT INTO users (user_id, username, password, role)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(insert_query, (user_id, username, hashed_password, role))

            # Commit the transaction
            connection.commit()

            # Return success response
            return jsonify({'message': 'User successfully registered!', 'user_id': user_id}), 201

    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({'message': 'Error creating user'}), 500

    finally:
        # Close the database connection if it was established
        if connection and connection.is_connected():
            cursor.close()
            connection.close()



def generate_token(username, role):
    # Shorten claims key names
    token = create_access_token(identity={'username': username, 'role': role})
    return token

#Login API
def login():
    """
    Example Payload:
    {
        "username": "jaggu123456",
        "password": "123456"
    }
    Response:
    {
        "message": "Logged in successfully",
        "role": "admin",
        "token": "your_generated_jwt_token"
    }
    """

    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')


    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    connection = None  # Initialize connection as None
    

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            database="dummydb",
            user=USER,
            password=PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Fetch the user from the database
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()

            # Debugging: Print the user data fetched from the database
            print(f"User fetched from database: {user}")

            if user:
                # Debugging: Print the stored hashed password and the input password
                print(f"Stored hashed password: {user['password']}")
                print(f"Input password: {password}")

                # Check if the provided password matches the stored hashed password
                if check_password_hash(user['password'], password):
                    role = user.get('role')

                    # Generate JWT access token with the role
                    token = generate_token(username, role)
                    # print(f"Generated token: {token}")
                    return jsonify({
                        "message": "Logged in successfully",
                        "token": token,  # Return the JWT token
                        "role": role
                    }), 200

                else:
                    # Password did not match
                    return jsonify({"error": "Invalid password"}), 401
            else:
                # User not found
                return jsonify({"error": "Invalid username or password"}), 401

    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({"message": "Error logging in"}), 500

    finally:
        # Close the database connection if it was established
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

#Logout API
def logout():
    """
    Response:
    {
        "message": "Logged out successfully"
    }
    """
    # If using a blacklist, add the token to the blacklist here

    return jsonify({"message": "Logged out successfully"}), 200


#Add Delete  user API
#Add Super user 
#optimize add user api to  check the limit of user baseed on role admin=2 operator 10 
