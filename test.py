from ultralytics import YOLO
import cv2
import bson
from flask import Flask, Response, send_file
import os

app = Flask(__name__)

# Define paths and configurations
datadrive_path = "inspections\inspection_images"
model_path = 'yolov8s-oiv7.pt'

# Ensure the data directory exists
os.makedirs(datadrive_path, exist_ok=True)

# Initialize the GM class
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

        return img, detector_labels, coordinates

    def get_defect_list(self, detector_predictions):
        return [i for i in detector_predictions if i]

    def check_kanban(self, defect_list):
        return "Rejected" if defect_list else "Accepted"


# Initialize model
gm1 = GM()
gm1.weights_path = model_path
gm1_model = gm1.load_model()

# Capture and process video feed
def generate():
    cap = cv2.VideoCapture(0)
    while True:
        ret, img = cap.read()
        if not ret:
            break

        x = bson.ObjectId()
        img_copy = img.copy()
        pred_image, dets, cords = gm1.get_inference(gm1_model, img)
        defect_list = gm1.get_defect_list(dets)
        is_accepted = gm1.check_kanban(defect_list)

        # Save input and processed images
        input_img_path = os.path.join(datadrive_path, f'{x}_ip.jpg')
        pred_img_path = os.path.join(datadrive_path, f'{x}_pf.jpg')
        cv2.imwrite(input_img_path, img_copy)
        cv2.imwrite(pred_img_path, pred_image)

        # Encode the processed image to send over the response
        ret, buffer = cv2.imencode('.jpg', pred_image)
        pred_image_frame = buffer.tobytes()

        # Yield frame in a format compatible with HTML5 video tag
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + pred_image_frame + b'\r\n')

    cap.release()
    cv2.destroyAllWindows()

# Flask route to stream video
@app.route('/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Flask route to serve an individual image
@app.route('/image/<image_id>')
def get_image(image_id):
    image_path = os.path.join(datadrive_path, f'{image_id}_ip.jpg')
    return send_file(image_path, mimetype='image/jpeg')

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)












# class GM:
# 	def __init__(self):
# 		self.weights_path = r''
# 		self.image_size = 640
# 		self.common_confidence = 0.1
# 		self.common_iou = 0.45
# 		self.hide_labels = None
# 		self.hide_conf = True
# 		self.line_width = 0.2
# 		self.defect_list=[]

# 	def load_model(self):
# 		model = YOLO(self.weights_path) 
# 		return model

	

# 	def get_inferenece(self, model, img):
# 		print(img.shape, "image shape")
# 		results = model.predict(source=img, conf=self.common_confidence, imgsz=self.image_size)
# 		boxes = results[0].boxes
# 		coordinates = []
# 		detector_labels = []
# 		color = (0, 255, 0)
# 		for box in boxes:
# 			cords = box.xyxy[0].tolist()
# 			label_cls = int(box.cls[0].item())
# 			label = model.names[label_cls]
# 			confidence = float(box.conf)
# 			xmin, ymin, xmax, ymax = int(cords[0]), int(cords[1]), int(cords[2]), int(cords[3])
			
# 			label_text = None if self.hide_labels else (f'{label} {confidence:.2f}' if self.hide_conf else f'{label} {confidence:.2f}')
# 			cv2.rectangle(img, (xmin, ymin), (xmax, ymax), color, int(self.line_width))
# 			cv2.putText(img, label_text, (xmin, ymin - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
			
# 			detector_labels.append(label_text)
# 			coordinates.append({label: [xmin, ymin, xmax, ymax]})
		
# 		return img, detector_labels, coordinates
	
# 	def get_defect_list(detector_predictions):
# 		defect_list = []
# 		for i in detector_predictions:
# 			if i in defect_list.defects:
# 				defect_list.append(i)

# 		return defect_list


# 	def check_kanban(defect_list):
# 		if bool(defect_list):
# 			is_accepted = "Rejected"
# 		else:
# 			is_accepted = "Accepted"
# 		return is_accepted
      


# model_path = 'yolov8s-oiv7.pt'
# datadrive_path=r"C:\Users\Skanda J\Downloads\BE_Dev\BE_Dev\inspections\inspection_images"

# gm1 = GM()
# gm1.weights_path = model_path
# gm1_model = gm1.load_model()



# def process_inspection():
#     cap = cv2.VideoCapture(0)

#     while True:
#         ret, img= cap.read()
#         x = bson.ObjectId()

#         ## reading the image
#         # img = cv2.imread(image_path)
#         img_copy = img.copy()

#         pred_image, dets, cords = gm1.get_inferenece(gm1_model,img)
#         defect_list =  gm1.get_defect_list(dets)
#         is_accepted = gm1.check_kanban(defect_list)

#         cv2.imwrite(datadrive_path+str(x)+'_ip.jpg',img_copy)
#         cv2.imwrite(datadrive_path+str(x)+'_pf.jpg',pred_image)

#         input_frame_path = 'http://localhost:3306/'+str(x)+'_ip.jpg'
#         inference_frame_path = 'http://localhost:3306/'+str(x)+'_pf.jpg'

#         if not dets:
#             continue

#         cv2.imshow("image",pred_image)
#         cv2.waitKey(1)
