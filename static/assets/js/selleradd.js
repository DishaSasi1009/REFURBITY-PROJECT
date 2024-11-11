document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const productTitle = document.getElementById('productTitle').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDescription = document.getElementById('productDescription').value;
    const productImageInput = document.getElementById('productImage').files[0];

    if (!productImageInput) return;

    const reader = new FileReader();
    reader.onload = function () {
        const productImage = reader.result;

        // Create the product preview
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = `
            <div class="preview-item">
                <img src="${productImage}" alt="${productTitle}">
                <div class="preview-item-details">
                    <p class="title" style="color: white;">${productTitle}</p>
                    <p>Price: ₹${productPrice}</p>
                    <p>${productDescription}</p>
                </div>
            </div>
        `;

        // Store product data in localStorage
        const productData = {
            title: productTitle,
            price: productPrice,
            description: productDescription,
            image: productImage
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        // Reset the form
        document.getElementById('productForm').reset();
    };

    reader.readAsDataURL(productImageInput);
});
