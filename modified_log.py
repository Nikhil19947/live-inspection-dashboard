from flask import Flask, request, jsonify
from common_utils import MongoHelper
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from jwt import ExpiredSignatureError, InvalidTokenError
from flask import Flask, request, jsonify
from PIL import Image
import base64
from io import BytesIO

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_secret_key')  # Use environment variable or fallback

# Initialize JWT Manager
jwt = JWTManager(app)


from flask_jwt_extended import create_access_token

# Function to generate JWT token with shortened keys
def generate_token(username, role):
    # Shorten claims key names
    token = create_access_token(identity={'username': username, 'role': role})
    return token

# Registration route
@app.route('/register', methods=['POST'])
def register():
    """
     Payload
    {
        "username": "prasanna123",
        "password": "12345",
        "role": "operator"
    }
    response:

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
    
    mp = MongoHelper().getCollection("users_collection")
    
    # Check if the username already exists
    existing_user = mp.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Hash the password before storing it in the database
    hashed_password = generate_password_hash(password)

    # Create a new user document
    new_user = {
        'user_id': user_id,
        'username': username,
        'password': hashed_password,
        'role': role  # Store the role as either 'admin' or 'operator'
    }

    try:
        # Insert the new user into the MongoDB collection
        mp.insert_one(new_user)

        # Return the user_id and success message in the response
        return jsonify({'message': 'User successfully registered!', 'user_id': user_id}), 201

    except Exception as e:
        # Capture any MongoDB errors and return a 500 Internal Server Error
        print("Error inserting user:", str(e))
        return jsonify({'message': 'Error creating user'}), 500


# Login route
@app.route('/login', methods=['POST'])
def login():


    """
      Payload
    {

    "username": "jaggu123456",
    "password": "123456"

    }
    response:

    {
    "message": "Logged in successfully",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
            eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyODcwODI0NiwianRpIjoiY2JlNTNmNzktZDA5Yi00YmJjLTgxMGMtYTQ3Y2QzMTlhNzcyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1c2VybmFtZSI6ImphZ2d1MTIzNDU2Iiwicm9sZSI6ImFkbWluIn0sIm5iZiI6MTcyODcwODI0NiwiY3NyZiI6IjU5M2JiZDI1LTQ4MTItNDE4MS1iYzIzLTQxYzBmOWZhNGZhNiIsImV4cCI6MTcyODcwOTE0Nn0.ixMFLzAnbNxlq-9R-xBvmT13LVmSw3RC23-ezLUXsH8"
}
  
   
    
    
    """


    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    mp = MongoHelper().getCollection("users_collection")
    
    # Fetch the user from the database
    user = mp.find_one({'username': username})
    
    if user and check_password_hash(user['password'], password):
        role = user.get('role')
        
        # Generate JWT access token with role
        token = generate_token(username,role)
        print(token)
        return jsonify({
            "message": "Logged in successfully",
            "token": token,  # Return the JWT token
            "role": role
        }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401


# Logout route (invalidate token by simply removing client-side storage of the token)
@app.route('/logout', methods=['GET'])
# @jwt_required()
def logout():
    # To effectively logout, on the client-side, just clear/remove the access token
    return jsonify({"message": "Logged out successfully. Please login again to continue."}), 200


# # Example of a protected route that checks the user's role (either admin or operator)
# @app.route('/admin-dashboard', methods=['GET'])
# @jwt_required()
# def admin_dashboard():
#     current_user = get_jwt_identity()
    
#     if current_user['role'] != 'admin':
#         return jsonify({"error": "Access forbidden: Admins only"}), 403
    
#     return jsonify({"message": "Welcome to the admin dashboard"}), 200


# # Example of a protected route for operators
# @app.route('/operator-dashboard', methods=['GET'])
# @jwt_required()
# def operator_dashboard():
#     current_user = get_jwt_identity()
    
#     if current_user['role'] != 'operator':
#         return jsonify({"error": "Access forbidden: Operators only"}), 403
    
#     return jsonify({"message": "Welcome to the operator dashboard"}), 200



# Helper function to encode image in base64
def encode_image_base64(image):
    buffered = BytesIO()
    image.save(buffered, format="png")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

# POST API to return image and status
@app.route('/upload_image_status', methods=['POST'])
def upload_image_status():
    """
    Payload (multipart/form-data):
      - image (required)
      - status (required)

    Response:
    {
        "image": "<base64_encoded_image>",
        "status": "pass"
    }
    """
    
    # Check if 'image' and 'status' are included in the request
    if 'image' not in request.files or 'status' not in request.form:
        return jsonify({"error": "Image and status are required"}), 400

    # Get the image and status from the request
    image_file = request.files['image']
    status = request.form['status']
    
    try:
        # Open the image using PIL
        image = Image.open(image_file)
    except Exception as e:
        return jsonify({"error": "Invalid image file", "details": str(e)}), 400

    # Encode the image to base64 to return it in JSON format
    encoded_image = encode_image_base64(image)

    # Create the response dictionary
    response = {
        "image": encoded_image,
        "status": status
    }

    return jsonify(response), 200



if __name__ == '__main__':
    app.run(debug=True)

