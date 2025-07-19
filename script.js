document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const photoGrid = document.getElementById('photo-grid');
    
    // Replace with your actual QR code URL
    const qrCodeUrl = 'https://your-wedding-site.com/upload';
    
    // Initialize Google Picker API
    let googleAuth;
    let pickerApiLoaded = false;
    let oauthToken;
    
    // Load photos from Google Drive
    loadPhotos();
    
    // Set up event listeners
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Load the Google API client
    function loadGoogleApi() {
        gapi.load('auth', {'callback': onAuthApiLoad});
        gapi.load('picker', {'callback': onPickerApiLoad});
    }
    
    function onAuthApiLoad() {
        googleAuth = gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file'
        });
    }
    
    function onPickerApiLoad() {
        pickerApiLoaded = true;
    }
    
    // Handle file selection (for direct uploads)
    function handleFileSelect(event) {
        const files = event.target.files;
        if (files.length > 0) {
            // In a real app, you would upload these to Google Drive
            // For now, we'll just display them locally
            displayPhotos(files);
            
            // Reset the file input
            fileInput.value = '';
        }
    }
    
    // Display photos in the gallery
    function displayPhotos(files) {
        photoGrid.innerHTML = '';
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Wedding photo';
                
                photoItem.appendChild(img);
                photoGrid.appendChild(photoItem);
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Load photos from Google Drive
    function loadPhotos() {
        // In a real implementation, you would:
        // 1. Authenticate with Google Drive API
        // 2. Query a specific folder for images
        // 3. Display them in the gallery
        
        // For demo purposes, we'll use placeholder images
        const placeholderImages = [
            'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1455495062391-5b7ddd072c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ];
        
        photoGrid.innerHTML = '';
        
        placeholderImages.forEach(imgUrl => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Wedding photo';
            
            photoItem.appendChild(img);
            photoGrid.appendChild(photoItem);
        });
    }
    
    // For a complete implementation, you would need:
    // 1. Google Drive API integration
    // 2. Server-side component to handle uploads
    // 3. Authentication system
});

// Note: For a production app, you would need to:
// 1. Set up a Google Cloud Project
// 2. Enable the Google Drive API
// 3. Create OAuth credentials
// 4. Implement proper authentication flow