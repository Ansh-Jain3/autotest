let currentUser = null;
let photos = [];
let currentPhotoIndex = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}!`;
    
    // Load existing photos
    loadPhotos();
    
    // Setup file input change event
    document.getElementById('photoInput').addEventListener('change', handleFileSelect);
    
    // Setup drag and drop
    setupDragAndDrop();
});

// Load photos from localStorage
function loadPhotos() {
    const userPhotos = JSON.parse(localStorage.getItem(`photos_${currentUser.id}`) || '[]');
    photos = userPhotos;
    displayPhotos();
}

// Display photos in the grid
function displayPhotos() {
    const grid = document.getElementById('photosGrid');
    
    if (photos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 4rem; margin-bottom: 20px;">📷</div>
                <h3>No photos yet</h3>
                <p>Upload your first photo to get started!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.style.animationDelay = `${index * 0.1}s`;
        
        photoCard.innerHTML = `
            <img src="${photo.dataUrl}" alt="${photo.name}">
            <div class="photo-info">
                <h4>${photo.name}</h4>
                <p>Uploaded on ${new Date(photo.uploadDate).toLocaleDateString()}</p>
            </div>
        `;
        
        photoCard.addEventListener('click', () => openModal(index));
        grid.appendChild(photoCard);
    });
}

// Trigger file upload
function triggerFileUpload() {
    document.getElementById('photoInput').click();
}

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// Process selected files
function processFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const photo = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: file.name.split('.')[0] || 'Untitled Photo',
                    fileName: file.name,
                    dataUrl: e.target.result,
                    uploadDate: new Date().toISOString(),
                    size: file.size
                };
                
                photos.unshift(photo); // Add to beginning of array
                savePhotos();
                displayPhotos();
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Clear the input
    event.target.value = '';
}

// Save photos to localStorage
function savePhotos() {
    localStorage.setItem(`photos_${currentUser.id}`, JSON.stringify(photos));
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))';
    }
    
    function unhighlight() {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))';
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = Array.from(dt.files);
        processFiles(files);
    }
}

// Open photo modal
function openModal(photoIndex) {
    currentPhotoIndex = photoIndex;
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    
    const photo = photos[photoIndex];
    
    modalImage.src = photo.dataUrl;
    modalTitle.textContent = photo.name;
    modalDate.textContent = `Uploaded on ${new Date(photo.uploadDate).toLocaleDateString()}`;
    
    modal.style.display = 'block';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleModalKeyPress);
}

// Close photo modal
function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    document.removeEventListener('keydown', handleModalKeyPress);
}

// Handle keyboard navigation in modal
function handleModalKeyPress(event) {
    switch(event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            prevPhoto();
            break;
        case 'ArrowRight':
            nextPhoto();
            break;
    }
}

// Navigate to previous photo
function prevPhoto() {
    currentPhotoIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    openModal(currentPhotoIndex);
}

// Navigate to next photo
function nextPhoto() {
    currentPhotoIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    openModal(currentPhotoIndex);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Close modal when clicking outside of image
window.addEventListener('click', function(event) {
    const modal = document.getElementById('photoModal');
    if (event.target === modal) {
        closeModal();
    }
});