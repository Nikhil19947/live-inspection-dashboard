


from flask import Flask, request, jsonify
from mysql.connector import Error
from flask_cors import CORS
from sqlhelper import MySQLHelper  # Import the MySQLHelper class
from settings import *
app = Flask(__name__)
CORS(app)


# Initialize MySQLHelper
db_helper = MySQLHelper(host=SQL_DB_HOST, user=USER, password=PASSWORD, database="account_details")

# Ensure the table exists
db_helper.create_table('users', {
    'user_id': 'INT AUTO_INCREMENT PRIMARY KEY',
    'password': 'VARCHAR(255) NOT NULL',
    'role': 'VARCHAR(50)',
    'email': 'VARCHAR(100) UNIQUE NOT NULL',
    'phone_number': 'VARCHAR(20) UNIQUE NOT NULL'
})


@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        # Get data from the request
        data = request.get_json()
        user_id = data.get('user_id')
        password = data.get('password')
        role = data.get('role')
        email = data.get('email')
        phone_number = data.get('phone_number')

        # Validate input
        if not all([password, role, email, phone_number]):
            return jsonify({'error': 'All fields except user_id are required'}), 400

        # Insert the new user into the database using MySQLHelper
        user_data = {
            'user_id': user_id,
            'password': password,
            'role': role,
            'email': email,
            'phone_number': phone_number
        }
        db_helper.insert_data('users', user_data)

        return jsonify({'message': 'User added successfully!'}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
