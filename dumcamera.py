import cv2
from pypylon import pylon
import numpy as np
import os

# Camera connection settings
camera_serial_number = '21287270'  # Replace with your camera's serial number
camera_ip = '192.168.0.100'  # Replace with your camera's IP

# Create a Pylon Camera instance
try:
    camera = pylon.InstantCamera(pylon.TlFactory.GetInstance().CreateFirstDevice())
    camera.Open()
    print(f"Connected to camera: {camera.GetDeviceInfo().GetModelName()}")
except Exception as e:
    print(f"Error: {e}")
    exit()

# Start grabbing images
camera.StartGrabbing(pylon.GrabStrategy_LatestImageOnly)

# Create a window for displaying the feed
cv2.namedWindow('Live Feed', cv2.WINDOW_NORMAL)

# Set up save directory
save_directory = r'C:\Users\vaish\internship\Intern\live-inspection-dashboard\path_to_save_directory'  # Set your desired path here
os.makedirs(save_directory, exist_ok=True)  # Ensure the directory exists

# Loop for capturing and displaying frames
while camera.IsGrabbing():
    grab_result = camera.RetrieveResult(5000, pylon.TimeoutHandling_ThrowException)
    
    if grab_result.GrabSucceeded():
        img = grab_result.GetArray()
        img = cv2.cvtColor(img, cv2.COLOR_BAYER_RG2BGR)  # Convert if needed (for Bayer sensor formats)

        # Display the live feed
        cv2.imshow('Live Feed', img)
        
        # Save frames if required
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):  # Press 's' to save a frame
            frame_filename = os.path.join(save_directory, 'frame.jpg')  # Adjust the filename if needed
            cv2.imwrite(frame_filename, img)
            print(f"Frame saved to {frame_filename}!")

        if key == ord('q'):  # Press 'q' to exit
            break

    grab_result.Release()

# Clean up
camera.StopGrabbing()
cv2.destroyAllWindows()