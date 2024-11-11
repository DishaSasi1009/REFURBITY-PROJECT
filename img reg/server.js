const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' })); // Handle large base64 images

app.post('/recognize-image', (req, res) => {
    const { image } = req.body;
    // Perform image recognition logic here (e.g., use TensorFlow or Google Vision API)
    console.log("Received image for recognition:", image);

    // Mock response
    res.json({ message: "Image recognized successfully", details: "Product: XYZ, Condition: Refurbished" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
