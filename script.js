// Configuration
const GITHUB_USERNAME = "shahudh-hitman";
const REPO_NAME = "shahudh-hitman.github.io";
const PHOTO_FOLDER = "photos";
const YOUR_EMAIL = "shahudhmohamed5@gmail.com";

// State
let currentPhotoIndex = 0;
let photoItems = [];

// Email Form Handler
document.getElementById('email-upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const files = document.getElementById('photo-input').files;
    const statusEl = document.getElementById('upload-status');
    
    if (files.length === 0) {
        statusEl.textContent = "Please select photos first!";
        statusEl.style.color = "#e74c3c";
        return;
    }

    if (files.length > 5) {
        statusEl.textContent = "Max 5 photos per email!";
        statusEl.style.color = "#e74c3c";
        return;
    }

    const subject = "Wedding Photo Submission";
    const body = `Hello! Here are my ${files.length} photos from your wedding.`;
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    statusEl.textContent = "Check your email client to attach and send!";
    statusEl.style.color = "#27ae60";
    this.reset();
});

// Gallery Loader
async function loadGitHubPhotos() {
    const gallery = document.getElementById('github-gallery');
    gallery.innerHTML = '<div class="loading">Loading photos...</div>';

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${PHOTO_FOLDER}?ref=main`
        );
        
        if (!response.ok) throw new Error("Failed to fetch photos");
        
        const files = await response.json();
        const imageFiles = files.filter(file => 
            file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        gallery.innerHTML = '';
        photoItems = [];
        
        if (imageFiles.length === 0) {
            gallery.innerHTML = '<div class="loading">No photos yet. Be the first to submit!</div>';
            return;
        }

        imageFiles.forEach((file, index) => {
            const imgUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${PHOTO_FOLDER}/${file.name}`;
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Wedding photo';
            img.loading = 'lazy';
            img.dataset.index = index;
            
            photoItem.appendChild(img);
            gallery.appendChild(photoItem);
            photoItems.push(imgUrl);
        });

        setupSwipeGestures();
        setupSaveButton();
        if (photoItems.length > 0) showPhoto(0);

    } catch (error) {
        console.error("Error:", error);
        gallery.innerHTML = '<div class="loading">Could not load photos. Refresh to try again.</div>';
    }
}

// Swipe Gestures
function setupSwipeGestures() {
    const gallery = document.getElementById('github-gallery');
    let startX, moveX;
    const threshold = 50;
    
    // Touch events
    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', () => {
        if (Math.abs(moveX - startX) > threshold) {
            if (moveX > startX) showPreviousPhoto();
            else showNextPhoto();
        }
    });

    // Button controls
    document.querySelector('.swipe-left').addEventListener('click', showPreviousPhoto);
    document.querySelector('.swipe-right').addEventListener('click', showNextPhoto);
}

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoItems.length;
    showPhoto(currentPhotoIndex);
}

function showPreviousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoItems.length) % photoItems.length;
    showPhoto(currentPhotoIndex);
}

function showPhoto(index) {
    const gallery = document.getElementById('github-gallery');
    const photoItem = gallery.children[index];
    photoItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

// Save to Camera Roll
function setupSaveButton() {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', saveCurrentPhoto);
}

async function saveCurrentPhoto() {
    if (photoItems.length === 0) return;
    
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    
    try {
        const imgUrl = photoItems[currentPhotoIndex];
        
        // Method 1: Download (works best on Android)
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `wedding-photo-${currentPhotoIndex + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Method 2: Canvas (for iOS)
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imgUrl;
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            
            const canvas = document.getElementById('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                } catch (error) {
                    console.log("Clipboard write failed:", error);
                }
            });
        }
        
        saveBtn.textContent = "Saved!";
        setTimeout(() => {
            saveBtn.textContent = "Save Photo";
            saveBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error("Save failed:", error);
        saveBtn.textContent = "Error Saving";
        saveBtn.disabled = false;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadGitHubPhotos);
setInterval(loadGitHubPhotos, 300000);
