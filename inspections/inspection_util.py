from flask import jsonify, request
import mysql.connector
from datetime import datetime
import uuid
from settings import *
import json
from ultralytics import YOLO
import cv2
import bson
import os 
import time 


part_id = ""


def start_process_util():

    """
    Payload Example:
    {   
        "part_id": "a6feab6e-d86c-47cf-ac8f-c66c1833c006",
        "part_name": "Product A"
    }

    Response:
    {
        "part_name": "Product A",
        "start_time": "2024-10-29 18:30:00",
        "end_time": "",
        "produced_on": "2024-10-29",
        "status": "started"
    }
    """

    data = request.get_json()
    part_id_request = data.get('part_id')
    part_name = data.get('part_name')

    global part_id  # Use the global keyword to modify the global variable
    part_id = part_id_request

    if not part_id or not part_name:
        return jsonify({"error": "Part ID and Part Name are required"}), 400

    connection = None

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            database=DATABASE,
            user=USER,
            password=PASSWORD
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Check if the 'inspections' table exists, and create it if it doesn't
            create_table_query = """
            CREATE TABLE IF NOT EXISTS inspections (
                id VARCHAR(36) PRIMARY KEY,
                part_id VARCHAR(36),
                part_name VARCHAR(255),
                start_time DATETIME,
                end_time DATETIME,
                produced_on DATE,
                status VARCHAR(50)
            )
            """
            cursor.execute(create_table_query)

            # Generate timestamps
            start_time = datetime.utcnow()
            produced_on = datetime.utcnow().date()

            # Insert part details into the inspections table
            insert_query = """
            INSERT INTO inspections (id, part_id, part_name, start_time, end_time, produced_on, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            inspection_id = str(uuid.uuid4())
            cursor.execute(insert_query, (inspection_id, part_id, part_name, start_time, None, produced_on, 'started'))

            # Commit the transaction
            connection.commit()

            # Return response
            return jsonify({
                "inspection_id":inspection_id,
                "part_name": part_name,
                "start_time": start_time.strftime('%Y-%m-%d %H:%M:%S'),
                "end_time": "",
                "produced_on": produced_on.strftime('%Y-%m-%d'),
                "status": "started"
            }), 201

    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return jsonify({"message": "Error starting the process"}), 500

    finally:
        # Close the database connection
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


datadrive_path = "inspections\inspection_images"
model_path = 'yolov8s-oiv7.pt'


class GM:
    def __init__(self):
        self.weights_path = ''
        self.image_size = 640
        self.common_confidence = 0.1
        self.common_iou = 0.45
        self.hide_labels = None
        self.hide_conf = True
        self.line_width = 0.2
        self.defect_list = ["dummy"]

    def load_model(self):
        model = YOLO(self.weights_path)
        return model

    def get_inference(self, model, img):
        print(img.shape, "image shape")
        results = model.predict(source=img, conf=self.common_confidence, imgsz=self.image_size)
        boxes = results[0].boxes
        coordinates = []
        detector_labels = []
        color = (0, 255, 0)

        for box in boxes:
            cords = box.xyxy[0].tolist()
            label_cls = int(box.cls[0].item())
            label = model.names[label_cls]
            confidence = float(box.conf)
            xmin, ymin, xmax, ymax = int(cords[0]), int(cords[1]), int(cords[2]), int(cords[3])

            label_text = None if self.hide_labels else (f'{label} {confidence:.2f}' if self.hide_conf else f'{label}')
            cv2.rectangle(img, (xmin, ymin), (xmax, ymax), color, int(self.line_width))
            cv2.putText(img, label_text, (xmin, ymin - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            detector_labels.append(label_text)
            coordinates.append({label: [xmin, ymin, xmax, ymax]})
            # print("Detector label ----------------------", detector_labels)

        return img, detector_labels, coordinates

    def get_defect_list(self, detector_predictions):
        return [i for i in detector_predictions if i]

    def check_kanban(self, defect_list):
        for i in defect_list:
            if 'Mobile' in i.split():
                return 0
        return 1


# Initialize model
gm1 = GM()
gm1.weights_path = model_path
gm1_model = gm1.load_model()

# Capture and process video feed
def stop_process_util():
    connection = None
    cursor = None
    
    try:        
        data = request.get_json(force=True)

        part_id = data.get('part_id')

        connection = mysql.connector.connect(
            host=SQL_DB_HOST,
            database=DATABASE,
            user=USER,
            password=PASSWORD
        )
        cursor = connection.cursor(dictionary=True)

        stop_time = datetime.utcnow()
        update_query = """
        UPDATE inspections
        SET end_time = %s, status = %s
        WHERE part_id = %s AND status = 'started'
        """
        cursor.execute(update_query, (stop_time, 'completed', part_id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No active process found for the given part_id"}), 404

        return jsonify({"status": "Process stopped successfully"}), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()

# def generate(part_id):
#     cap = cv2.VideoCapture(0)
#     input_paths = []  # List to store input image paths
#     pred_paths = []   # List to store predicted image paths

#     # Create a unique folder for each inspection
#     inspection_folder = os.path.join(datadrive_path, part_id)  # Using the part_id for the folder name
#     os.makedirs(inspection_folder, exist_ok=True)  # Create the directory if it doesn't exist

#     while True:
#         ret, img = cap.read()
#         if not ret:
#             print("Failed to capture frame.")
#             break
        
#         # Generate a new unique ObjectId for each frame
#         x = bson.ObjectId()
#         print(f"Generated ObjectId: {x}")  # Debugging: Ensure ObjectId is unique for each frame
        
#         # Copy the captured image
#         img_copy = img.copy()
        
#         # Generate predicted image using your model
#         pred_image, dets, cords = gm1.get_inference(gm1_model, img)
#         defect_list = gm1.get_defect_list(dets)
#         is_accepted = gm1.check_kanban(defect_list)

#         # Define unique paths for the input and predicted images
#         timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")  # Unique timestamp for each iteration
#         input_img_path = os.path.join(inspection_folder, f'{timestamp}_{x}_ip.jpg')
#         pred_img_path = os.path.join(inspection_folder, f'{timestamp}_{x}_pf.jpg')
        
#         # Debugging: Log the paths for each frame
#         print(f"Saving input image to: {input_img_path}")
#         print(f"Saving predicted image to: {pred_img_path}")
        
#         # Save the images with unique paths
#         cv2.imwrite(input_img_path, img_copy)
#         cv2.imwrite(pred_img_path, pred_image)
        
#         # Append the new paths to the list
#         input_paths.append(input_img_path)
#         pred_paths.append(pred_img_path)

#         # Encode the processed image to send over the response
#         ret, buffer = cv2.imencode('.jpg', pred_image)
#         pred_image_frame = buffer.tobytes()
#         print(f"input---------------------------------------------------------- {input_paths}")
#         print(f"pred---------------------------------------------------------- {pred_paths}")

#         # Yield frame in a format compatible with HTML5 video tag
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + pred_image_frame + b'\r\n')
        
#         save_to_db(part_id, input_paths, pred_paths, defect_list, is_accepted)
      
        
#     cap.release()
#     cv2.destroyAllWindows()

#     # Return the lists of paths to be saved in the database
#     return input_paths, pred_paths, defect_list, is_accepted
def inspect_func():
    global l
    save_to_db(l[0], l[1], l[2], l[3], l[4])



def generate(part_id):
    global l
    cap = cv2.VideoCapture(0)
    input_paths = []  # List to store input image paths
    pred_paths = []   # List to store predicted image paths

    # Create a unique folder for each inspection
    inspection_folder = os.path.join(datadrive_path, part_id)  # Using the part_id for the folder name
    os.makedirs(inspection_folder, exist_ok=True)  # Create the directory if it doesn't exist
    l = []

    while True:
        ret, img = cap.read()
        if not ret:
            print("Failed to capture frame.")
            break
        
        # Generate a new unique ObjectId for each frame
        x = bson.ObjectId()
        print(f"Generated ObjectId: {x}")  # Debugging: Ensure ObjectId is unique for each frame
        
        # Copy the captured image
        img_copy = img.copy()
        
        # Generate predicted image using your model
        pred_image, dets, cords = gm1.get_inference(gm1_model, img)
        defect_list = gm1.get_defect_list(dets)
        is_accepted = gm1.check_kanban(defect_list)

        # Define unique paths for the input and predicted images
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")  # Unique timestamp for each iteration
        # input_img_path = os.path.join(inspection_folder, f'{timestamp}_{x}_ip.jpg')
        # pred_img_path = os.path.join(inspection_folder, f'{timestamp}_{x}_pf.jpg')
        for i in range(6):
            input_img_path = os.path.join(inspection_folder, f'{i}ip.jpg')
            pred_img_path = os.path.join(inspection_folder, f'{i}pf.jpg')
        
            # Debugging: Log the paths for each frame
            print(f"Saving input image to: {input_img_path}")
            print(f"Saving predicted image to: {pred_img_path}")
            
            # Save the images with unique paths
            cv2.imwrite(input_img_path, img_copy)
            cv2.imwrite(pred_img_path, pred_image)
            
            # Append the new paths to the list
            input_paths = [input_img_path]
            pred_paths = [pred_img_path]

        # Encode the processed image to send over the response
        ret, buffer = cv2.imencode('.jpg', pred_image)
        pred_image_frame = buffer.tobytes()
        print(f"input---------------------------------------------------------- {input_paths}")
        print(f"pred---------------------------------------------------------- {pred_paths}")

        # Yield frame in a format compatible with HTML5 video tag
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + pred_image_frame + b'\r\n')
        
        # save_to_db(part_id, input_paths, pred_paths, defect_list, is_accepted)
        l = [part_id, input_paths, pred_paths, defect_list, is_accepted]
    
        
    cap.release()
    cv2.destroyAllWindows()

    # Return the lists of paths to be saved in the database
    return input_paths, pred_paths, defect_list, is_accepted


def save_to_db(part_id, input_paths, pred_paths, defect_list, is_accepted):
    base_directory = r'C:\Users\Skanda J\Downloads\BE_Dev\BE_Dev'  # Base path to prepend
    
    try:
        # Establish MySQL connection
        connection = mysql.connector.connect(
            host='localhost',        # Your MySQL host
            database='dummydb',      # Your database name
            user='root',             # Your MySQL username
            password='root_pass813'  # Your MySQL password
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # Iterate over the input and predicted paths
            for i in range(len(input_paths)):
                # Generate a unique ID for each entry
                unique_id = str(uuid.uuid4())  # Generate unique ID

                # Prepend the base directory to the paths
                input_path = os.path.join(base_directory, input_paths[i].lstrip(os.sep))  # Ensure correct formatting
                pred_path = os.path.join(base_directory, pred_paths[i].lstrip(os.sep))  # Ensure correct formatting

                # Convert the defect list to a string
                defect_str = ", ".join(defect_list)

                # Insert or update data in the results table using "ON DUPLICATE KEY UPDATE"
                query = """
                INSERT INTO results (id, part_id, input_frame_path, inference_frame_path, defect_list, is_accepted)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    part_id = VALUES(part_id),
                    input_frame_path = VALUES(input_frame_path),
                    inference_frame_path = VALUES(inference_frame_path),
                    defect_list = VALUES(defect_list),
                    is_accepted = VALUES(is_accepted);
                """
                
                # Prepare data for insertion/update
                data = (unique_id, part_id, input_path, pred_path, defect_str, is_accepted)
                cursor.execute(query, data)

                # Commit the transaction after each operation
                connection.commit()

            print("Data successfully saved or updated in the database!")

    except Exception as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


