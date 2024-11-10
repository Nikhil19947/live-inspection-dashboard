import mysql.connector
from mysql.connector import Error
from settings import *  


class MySQLHelper:
    def __init__(self, host=SQL_DB_HOST, database="db1", user=USER, password=PASSWORD):
        self.connection = None
        try:
            # Attempt to establish a connection to the MySQL database
            self.connection = mysql.connector.connect(
                host=host,
                database=database,
                user=user,
                password=password
            )

            if self.connection.is_connected():
                print("Successfully connected to the database.")
            else:
                print("Connection failed.")

        except Error as e:
            # Print a more specific error message
            print(f"Error connecting to MySQL Database: {e}")
            self.connection = None  # Ensure connection is set to None if an error occurs

    def query(self, query, params=None):
        if self.connection is None:
            raise Exception("Database connection not established.")
        
        cursor = self.connection.cursor()
        cursor.execute(query, params)
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return result

    def execute(self, query, params=None):
        if self.connection is None:
            raise Exception("Database connection not established.")
        
        cursor = self.connection.cursor()
        cursor.execute(query, params)
        self.connection.commit()
        cursor.close()

    def close(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed.")
