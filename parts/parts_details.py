from datetime import datetime
from flask import request, jsonify
import uuid
from mysql.connector import Error
import mysql
from settings import *



# Define constants for database connection
SQL_DB_HOST = SQL_DB_HOST # Change as needed
DATABASE = 'dummydb'       # Change as needed
USER = USER    # Change as needed
PASSWORD = PASSWORD  # Change as needed

def create_parts_table(cursor):
    """Create the parts table if it doesn't exist."""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS parts (
        product_id VARCHAR(36) PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_type VARCHAR(255) NOT NULL,
        product_batch VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE
    );
    """
    cursor.execute(create_table_query)

def add_part():
    """
    Example Payload:
    {
        "product_name": "Product A",
        "product_type": "Type 1",
        "product_batch": "Batch 001",
        "is_deleted": false
    }
    
    Response:
    {
        "message": "Part successfully added!",
        "product_id": "some_unique_id"
    }
    """
    
    data = request.get_json()

    product_name = data.get('product_name')
    product_type = data.get('product_type')
    product_batch = data.get('product_batch')
    is_deleted = data.get('is_deleted', False)  # Default to False if not provided

    if not product_name or not product_type or not product_batch:
        return jsonify({"error": "Product name, type, and batch are required"}), 400

    connection = None  # Initialize connection as None
    product_id = str(uuid.uuid4())  # Generate a unique product ID
    created_at = datetime.now().isoformat()  # Get the current time

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host='localhost',
            database='dummydb',
            user='root',
            password='root_pass813'
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Create the parts table if it doesn't exist
            create_parts_table(cursor)

            # Insert new product into the parts table
            insert_query = """
            INSERT INTO parts (product_id, product_name, product_type, product_batch, created_at, is_deleted)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (product_id, product_name, product_type, product_batch, created_at, is_deleted))

            # Commit the transaction
            connection.commit()

            # Return success response
            return jsonify({'message': 'Part successfully added!', 'product_id': product_id}), 201

    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({'message': 'Error adding part'}), 500

    finally:
        # Close the database connection if it was established
        if connection and connection.is_connected():
            cursor.close()
            connection.close()




def get_parts():
    """
    Response:
    {
        "data": [
            {
                "product_id": "some_id",
                "product_name": "Product A",
                "product_type": "Type 1",
                "product_batch": "Batch 001",
                "created_at": "2024-10-29T00:00:00",
                "is_deleted": false
            },
            ...
        ]
    }
    """
    connection = None  # Initialize connection as None
    db_name = 'dummydb'  # Hardcoded database name
    table_name = 'parts'  # Hardcoded table name

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            database=db_name,
            user=USER,
            password=PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Query all data from the specified table
            query = f"SELECT * FROM {table_name} WHERE is_deleted = FALSE"
            cursor.execute(query)
            results = cursor.fetchall()

            # Return the results
            return jsonify({"data": results}), 200

    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({'message': 'Error querying parts'}), 500

    finally:
        # Close the database connection if it was established
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def get_analysis_data():
    """Retrieve analysis data from the database."""
    
    connection = None
    analysis_results = []

    try:
        # Connect to the MySQL database using directly defined constants
        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            database="dummydb",
            user=USER,
            password=PASSWORD
        )
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

        # Execute query to fetch data from the analysis table
        cursor.execute("SELECT * FROM analysis")  # Update this query as needed
        rows = cursor.fetchall()

        if rows:
            analysis_results.extend(rows)

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return []  # Return empty list on error

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return jsonify({"data": analysis_results})


def delete_part():
    """
    Example Payload:
    {
        "product_id": "a6feab6e-d86c-47cf-ac8f-c66c1833c006"
    }
    Response:
    {
        "message": "Part marked as deleted successfully"
    }
    """
    
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

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

            # Check if the part exists and update the is_deleted status
            update_query = """
            UPDATE parts
            SET is_deleted = TRUE
            WHERE product_id = %s
            """
            cursor.execute(update_query, (product_id,))
            connection.commit()

            if cursor.rowcount == 0:
                return jsonify({"error": "Part not found"}), 404
            
            return jsonify({"message": "Part marked as deleted successfully"}), 200

    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({"message": "Error deleting part"}), 500

    finally:
        # Close the database connection if it was established
        if connection and connection.is_connected():
            cursor.close()
            connection.close()