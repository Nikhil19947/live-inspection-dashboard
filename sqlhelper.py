import mysql.connector
from mysql.connector import Error

class MySQLHelper:
    connection = None

    def __init__(self, host, user, password, database=None):
        try:
            if not MySQLHelper.connection:
                MySQLHelper.connection = mysql.connector.connect(
                    host=host,
                    user=user,
                    password=password
                )
                if MySQLHelper.connection.is_connected():
                    print("Successfully connected to the MySQL server")

            if database:
                self.create_database_if_not_exists(database)
                MySQLHelper.connection.database = database  # Set the database context
                print(f"Using database: {database}")

        except Error as e:
            print(f"Error: {e}")
            MySQLHelper.connection = None

    def create_database_if_not_exists(self, db_name):
        cursor = self.get_cursor()
        try:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
            print(f"Database '{db_name}' created or already exists.")
        except Error as e:
            print(f"Error creating database: {e}")
        finally:
            cursor.close()

    def get_connection(self):
        return MySQLHelper.connection

    def get_cursor(self):
        if MySQLHelper.connection is None or not MySQLHelper.connection.is_connected():
            try:
                MySQLHelper.connection.reconnect(attempts=3, delay=5)
            except Error as e:
                raise Exception(f"Error reconnecting to database: {e}")
        return MySQLHelper.connection.cursor(dictionary=True)

    def execute_query(self, query, params=None):
        cursor = self.get_cursor()
        try:
            cursor.execute(query, params)
            if query.strip().lower().startswith("select"):
                return cursor.fetchall()
            MySQLHelper.connection.commit()
            return True
        except Exception as e:
            print(f"Error executing query: {e}")
            MySQLHelper.connection.rollback()
            return None
        finally:
            cursor.close()

    def create_table(self, table_name, columns):
        cursor = self.get_cursor()
        if self.table_exists(table_name):
            print(f"Table '{table_name}' already exists.")
            return

        column_defs = ", ".join(f"{name} {dtype}" for name, dtype in columns.items())
        query = f"CREATE TABLE {table_name} ({column_defs})"
        try:
            cursor.execute(query)
            print(f"Table '{table_name}' created successfully.")
        except Error as e:
            print(f"Error creating table: {e}")
        finally:
            cursor.close()

    def insert_data(self, table_name, data):
        if not self.table_exists(table_name):
            print(f"Cannot insert data: Table '{table_name}' does not exist.")
            return

        cursor = self.get_cursor()
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        try:
            cursor.execute(query, tuple(data.values()))
            MySQLHelper.connection.commit()
            print("Data inserted successfully.")
        except Exception as e:
            print(f"Error inserting data: {e}")
            MySQLHelper.connection.rollback()
        finally:
            cursor.close()

    def modify_table(self, table_name, alteration):
        cursor = self.get_cursor()
        query = f"ALTER TABLE {table_name} {alteration}"
        try:
            cursor.execute(query)
            print(f"Table '{table_name}' modified successfully.")
        except Exception as e:
            print(f"Error modifying table: {e}")
        finally:
            cursor.close()

    def query_data(self, query, params=None):
        cursor = self.get_cursor()
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        except Exception as e:
            print(f"Error querying data: {e}")
            return None
        finally:
            cursor.close()

    def table_exists(self, table_name):
        cursor = self.get_cursor()
        query = "SHOW TABLES LIKE %s"
        cursor.execute(query, (table_name,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists

    def column_exists(self, table_name, column_name):
        cursor = self.get_cursor()
        query = f"SHOW COLUMNS FROM {table_name} LIKE %s"
        cursor.execute(query, (column_name,))
        exists = cursor.fetchone() is not None
        cursor.close()
        return exists

    def close_connection(self):
        if MySQLHelper.connection and MySQLHelper.connection.is_connected():
            MySQLHelper.connection.close()
            print("Database connection closed")
