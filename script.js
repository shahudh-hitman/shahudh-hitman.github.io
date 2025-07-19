// Configuration - MUST UPDATE THESE!
const GITHUB_USERNAME = "shahudh-hitman"; // e.g. "weddingphotos"
const REPO_NAME = "shahudh-hitman.github.io"; // e.g. "our-wedding"
const PHOTO_FOLDER = "photos"; // Must match your GitHub folder name
const YOUR_EMAIL = "shahudhmohamed5@gmail.com"; // Change to your email

// Email Upload Handler
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

    // Prepare email
    const subject = "Wedding Photo Submission";
    const body = `Hello! Here are my ${files.length} photos from your wedding.`;
    
    // Create mailto link (doesn't actually attach files - just opens email client)
    let mailtoLink = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open user's email client
    window.location.href = mailtoLink;
    
    // Reset form
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
        
        if (imageFiles.length === 0) {
            gallery.innerHTML = '<div class="loading">No photos yet. Be the first to submit!</div>';
            return;
        }

        imageFiles.forEach(file => {
            const imgUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${PHOTO_FOLDER}/${file.name}`;
            
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Wedding photo';
            img.loading = 'lazy';
            
            photoItem.appendChild(img);
            gallery.appendChild(photoItem);
        });

    } catch (error) {
        console.error("Error:", error);
        gallery.innerHTML = '<div class="loading">Could not load photos. Refresh to try again.</div>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadGitHubPhotos);
setInterval(loadGitHubPhotos, 300000); // Refresh every 5 minutes
