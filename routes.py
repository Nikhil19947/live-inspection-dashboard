
import cv2

def generate_frames():
    global recognized_texts
    cap = cv2.VideoCapture(0) 
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Clear previous recognized texts
        recognized_texts = ["dummy data"]

        # Resize frame for display purposes
        frame = cv2.resize(frame, (1280, 720))  # Adjust as needed

        # Encode the frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Yield frame in a streamable format for Flask
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


