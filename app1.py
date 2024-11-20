from flask import Flask, Response, jsonify
from routes import *
from mysql.connector import Error
from accounts.accounts import *
from parts.parts_details import *
from inspections.inspection_util import *
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_cors import cross_origin
from flask import send_from_directory

in_id = ""

app = Flask(__name__)
# CORS(app)
# CORS(app, resources={r"/start_process": {"origins": "http://localhost:3000"}})
CORS(app, origins=["http://localhost:3000"])
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'  
jwt = JWTManager(app)  

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

@app.route('/set_id')
def set_id():
    print('setting inspection id')
    global in_id
    in_id = request.args.get('part_number')
    print('in_id-----------------------------------------------------', in_id)
    return "set"

@app.route('/get_details', methods=['GET'])
def get_details():
    global in_id
    if not in_id:
        return jsonify({'error': 'part_id is required'}), 400

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host='localhost',  # Change as per your database configuration
            user='root',
            password='root_pass813',
            database='dummydb'
        )

        if connection.is_connected():
            cursor = connection.cursor(buffered=True)
            # Query to fetch details for the given part_id
            query = "SELECT * FROM results WHERE id = %s"
            cursor.execute(query, (in_id,))
            result = cursor.fetchall()

            # Check if data exists
            if result:
                # Construct the response based on your schema
                details = []
                for row in result:
                    details.append({
                        'id': row[0],
                        'part_id': row[1],
                        'input_frame_path': row[2],
                        'inference_frame_path': row[3],
                        'defect_list': row[4],
                        'is_accepted': bool(row[5]),
                        'timestamp': row[6].strftime('%Y-%m-%d %H:%M:%S') if row[6] else None,
                        'station': row[7],
                        'part': row[8]
                    })

                return jsonify({'details': details[0]}), 200
            else:
                return jsonify({'error': f'No details found for part_id: {part_id}'}), 404

    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    finally:
        # Ensure resources are cleaned up
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()



@app.route('/inspect_func')
def inspect_func():
    capture()
    return "captured"

@app.route('/video_feed', methods=['GET'])
def video_feed():
    # Get part_id from query parameters
    part_id = request.args.get('part_id')
    part_name = request.args.get('part_name')
    part_station = request.args.get('station')

    if not part_id:
        return "Error: part_id is required!", 400

    # Pass the part_id to the generate function or wherever you need it
    return Response(generate(part_id=part_id, part_name = part_name, part_station = part_station), mimetype='multipart/x-mixed-replace; boundary=frame')


BASE_DIRECTORY = r'C:\Users\Skanda J\Downloads\BE_Dev\BE_Dev\inspections\inspection_images'


@app.route('/get_images', methods=['GET'])
def get_images():
    try:
        part_id = request.args.get('part_id')  # Get part_id from query parameters
        if not part_id:
            return jsonify({'error': 'part_id is required'}), 400

        # List to hold image paths for the specific part_id
        part_images = []

        # Walk through the directory and find images specific to the part_id
        for root, dirs, files in os.walk(BASE_DIRECTORY):
            for file in files:
                if file.endswith('pf.jpg') and part_id in root:
                    # Get the full path of the image
                    full_image_path = os.path.join(root, file)
                    part_images.append({
                        'path': full_image_path,
                        'modified_time': os.path.getmtime(full_image_path)
                    })

        # If no images found for this part_id
        if not part_images:
            return jsonify({'error': f'No images found for part_id: {part_id}'}), 404

        # Sort images by modification time in descending order (latest images first)
        part_images.sort(key=lambda x: x['modified_time'], reverse=True)

        # Limit to 6 latest images
        images_to_return = part_images[:6]

        # Generate the URLs for the images to return
        image_urls = [
            f"http://127.0.0.1:5000/inspection_images/{os.path.relpath(img['path'], BASE_DIRECTORY).replace(os.sep, '/')}"
            for img in images_to_return
        ]

        return jsonify({'image_urls': image_urls})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/inspection_images/<path:filename>', methods=['GET'])
def serve_image(filename):
    try:
        return send_from_directory(BASE_DIRECTORY, filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/detailed_view_img', methods=['GET'])
def detailed_view_img():
    connection = mysql.connector.connect(
            host='localhost',  
            user='root',
            password='root_pass813',
            database='dummydb'
        )

    if connection.is_connected():
        cursor = connection.cursor(buffered=True)
        query = "SELECT part_id FROM results WHERE id = %s"
        cursor.execute(query, (in_id,))
        part_id = cursor.fetchall()
    part_id = part_id[0][0]
    try:
        if not part_id:
            return jsonify({'error': 'part_id is required'}), 400

        # List to hold image paths for the specific part_id
        part_images = []

        # Walk through the directory and find images specific to the part_id
        for root, dirs, files in os.walk(BASE_DIRECTORY):
            for file in files:
                if file.endswith('pf.jpg') and part_id in root:
                    # Get the full path of the image
                    full_image_path = os.path.join(root, file)
                    part_images.append({
                        'path': full_image_path,
                        'modified_time': os.path.getmtime(full_image_path)
                    })

        # If no images found for this part_id
        if not part_images:
            return jsonify({'error': f'No images found for part_id: {part_id}'}), 404

        # Sort images by modification time in descending order (latest images first)
        part_images.sort(key=lambda x: x['modified_time'], reverse=True)

        # Limit to 6 latest images
        images_to_return = part_images[:6]

        # Generate the URLs for the images to return
        image_urls = [
            f"http://127.0.0.1:5000/inspection_images/{os.path.relpath(img['path'], BASE_DIRECTORY).replace(os.sep, '/')}"
            for img in images_to_return
        ]

        return jsonify({'image_urls': image_urls})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/start_inspect', methods=['POST'])
def start_inspect():
    global inspect
    inspect = True  # Set the inspect flag to True
    return jsonify({"status": "Inspection started successfully"}), 200


@app.route('/recognized_text', methods=['GET'])
def get_recognized_text():
    """Route to serve recognized text."""
    Response(process_inspection(), mimetype='multipart/x-mixed-replace; boundary=frame')
    return jsonify(recognized_texts)

@app.route('/register', methods=['POST'])
def register_users():
    return register()


@app.route('/login', methods=['POST'])
def login_user():
    return login()

@app.route('/logout', methods=['POST'])
def logout_user():
    return logout()



@app.route('/add_part', methods=['POST'])
def add_parts():
    return add_part()


@app.route('/get_parts', methods=['GET']) 
def get_all_parts():
    return get_parts()


@app.route('/delete_part', methods=['POST'])  
def delete_part_():
    return delete_part()

@app.route('/start_process', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def start_process():
    return start_process_util()


@app.route('/stop_process', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def stop_process():
    # try:
    #     data = request.get_json()
    #     print("--------------------------------------------Received:", data)
    # except Exception as e:
    #     print(f"-------------------------------------------Error occurred: {str(e)}") 
    return stop_process_util()

@app.route('/get_analysis', methods=['GET'])
def get_analysis():
    return get_analysis_data() 


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


# app = Flask(__name__)


# @app.route('/video_feed')
# def video_feed():
#     """Route to serve the video feed."""
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/recognized_text')
# def get_recognized_text():
#     """Route to serve recognized text."""
#     Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
#     return jsonify(recognized_texts)

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0')

