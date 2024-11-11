// imageRecognition.js

// Function to open the camera
function openCamera() {
    const videoElement = document.getElementById('cameraView');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.play();
        })
        .catch((error) => {
            console.error("Error accessing camera: ", error);
        });
}

// Function to capture image from camera
function captureImage() {
    const videoElement = document.getElementById('cameraView');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/png'); // Captured image in base64 format
}

// Function to handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedImage = e.target.result; // base64 of uploaded image
            // Pass this image to your backend or recognition function
            console.log("Uploaded image:", uploadedImage);
        };
        reader.readAsDataURL(file);
    }
}

// Example of sending image to backend for recognition
async function sendImageToBackend(imageData) {
    try {
        const response = await fetch('/recognize-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        const result = await response.json();
        console.log("Recognition result:", result);
    } catch (error) {
        console.error("Error sending image to backend:", error);
    }
}

document.getElementById('captureButton').addEventListener('click', () => {
    const imageData = captureImage();
    sendImageToBackend(imageData);
});

document.getElementById('uploadInput').addEventListener('change', handleImageUpload);
