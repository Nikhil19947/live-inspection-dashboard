from flask import Flask, Response, jsonify
from routes import *
from mysql.connector import Error
from accounts.accounts import *
from parts.parts_details import *
from inspections.inspection_util import *
from flask_jwt_extended import JWTManager


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'  
jwt = JWTManager(app)  




@app.route('/video_feed', methods=['GET'])
def video_feed():
    """Route to serve the video feed."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/recognized_text', methods=['GET'])
def get_recognized_text():
    """Route to serve recognized text."""
    Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    return jsonify(recognized_texts)





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

