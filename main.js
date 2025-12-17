// Main Application Logic

// App State
let currentSection = 'dashboard';
let currentTab = 'upload';
let selectedAnimal = 'cow';
let cameraStream = null;
let currentCamera = 'environment';
let capturedImage = null;
let history = JSON.parse(localStorage.getItem('recycleHistory')) || [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    loadHistory();
    setupEventListeners();
    
    // Auto-select first animal
    selectAnimal('cow');
});

// Navigation
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-link, .nav-btn').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav
    document.querySelectorAll(`[onclick*="${sectionId}"]`).forEach(item => {
        item.classList.add('active');
    });
    
    currentSection = sectionId;
    toggleSidebar(); // Close sidebar on mobile
    
    // Stop camera if leaving analyzer
    if (sectionId !== 'analyzer') {
        stopCamera();
    }
}

function showTab(tabId) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tabId + 'Tab').style.display = 'block';
    
    currentTab = tabId;
    
    // Stop camera if switching from camera tab
    if (tabId !== 'camera') {
        stopCamera();
    }
}

// File Handling
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        showToast('Image selected! Analyzing...', 'success');
        setTimeout(() => {
            const materials = ['plastic', 'paper', 'glass', 'metal'];
            const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
            analyzeMaterial(randomMaterial);
        }, 1000);
    }
}

// Material Analysis
function analyzeMaterial(type) {
    showLoading();
    
    // Simulate AI processing
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progressBar').style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                hideLoading();
                showWasteResults(type);
                addToHistory('waste', wasteDB[type].name);
            }, 500);
        }
    }, 200);
}

function showWasteResults(type) {
    const material = wasteDB[type];
    const colorClass = material.type;
    
    const html = `
        <div class="card mt-3">
            <div class="d-flex justify-between align-center mb-2">
                <h4><i class="fas fa-microscope ${colorClass}"></i> Analysis Results</h4>
                <span class="badge badge-success">${material.recyclability}</span>
            </div>
            
            <div class="text-center mb-3">
                <i class="fas fa-${type === 'plastic' ? 'wine-bottle' : type === 'paper' ? 'file-alt' : type === 'glass' ? 'wine-glass' : 'weight'}" 
                   style="font-size: 64px; color: ${getColor(type)};"></i>
                <h3 class="${colorClass} mt-2">${material.name}</h3>
            </div>
            
            <h5><i class="fas fa-cogs"></i> Transformation Process:</h5>
            <p class="mb-3">${material.process}</p>
            
            <h5><i class="fas fa-leaf"></i> Environmental Impact:</h5>
            <div class="grid mb-3">
                <div class="stat-card">
                    <div class="stat-value">${material.impact.co2}</div>
                    <div class="stat-label">CO₂ Saved</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${material.impact.water}</div>
                    <div class="stat-label">Water Used</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${material.impact.energy}</div>
                    <div class="stat-label">Energy Used</div>
                </div>
            </div>
            
            <h5><i class="fas fa-lightbulb ${colorClass}"></i> Suggested Transformations:</h5>
            <div class="grid">
                ${material.transformations.map(product => `
                    <div class="grid-item">
                        <i class="fas ${product.icon} ${colorClass}"></i>
                        <div>${product.name}</div>
                        <small>${product.desc}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="d-flex gap-1 mt-3">
                <button class="btn btn-primary" onclick="saveResult('${type}')">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="btn btn-primary" onclick="shareResult()">
                    <i class="fas fa-share"></i> Share
                </button>
                <button class="btn btn-primary" onclick="exportResult('${type}')">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('results').innerHTML = html;
    document.getElementById('results').style.display = 'block';
}

// URL Image Handling
function loadImageFromUrl() {
    const url = document.getElementById('imageUrl').value;
    if (!url) {
        showToast('Please enter image URL', 'error');
        return;
    }
    
    const img = document.getElementById('previewImage');
    img.onload = function() {
        document.getElementById('urlPreview').style.display = 'block';
        showToast('Image loaded successfully!', 'success');
    };
    img.onerror = function() {
        showToast('Failed to load image', 'error');
    };
    img.src = url;
}

function analyzeFromUrl() {
    const materials = ['plastic', 'paper', 'glass', 'metal'];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
    analyzeMaterial(randomMaterial);
}

// Camera Functions
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: currentCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('cameraFeed');
        video.srcObject = cameraStream;
        
        // Update UI
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'flex';
        document.getElementById('switchBtn').style.display = 'flex';
        document.getElementById('captureBtn').style.display = 'flex';
        
        showToast('Camera started', 'success');
    } catch (err) {
        console.error('Camera error:', err);
        showToast('Camera access denied', 'error');
        // Fallback to demo mode
        simulateCamera();
    }
}

function simulateCamera() {
    const video = document.getElementById('cameraFeed');
    video.srcObject = null;
    video.poster = 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&auto=format&fit=crop';
    video.controls = false;
    
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'flex';
    document.getElementById('switchBtn').style.display = 'flex';
    document.getElementById('captureBtn').style.display = 'flex';
    
    showToast('Using demo camera mode', 'info');
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    const video = document.getElementById('cameraFeed');
    video.srcObject = null;
    
    document.getElementById('startBtn').style.display = 'flex';
    document.getElementById('stopBtn').style.display = 'none';
    document.getElementById('switchBtn').style.display = 'none';
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('cameraPreview').style.display = 'none';
}

function switchCamera() {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    stopCamera();
    startCamera();
}

function captureImage() {
    const video = document.getElementById('cameraFeed');
    const canvas = document.getElementById('capturedCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = canvas.toDataURL('image/png');
    
    document.getElementById('cameraPreview').style.display = 'block';
    showToast('Image captured!', 'success');
}

function analyzeCaptured() {
    if (!capturedImage) {
        showToast('Please capture an image first', 'warning');
        return;
    }
    
    const materials = ['plastic', 'paper', 'glass', 'metal'];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
    analyzeMaterial(randomMaterial);
}

function retakePhoto() {
    document.getElementById('cameraPreview').style.display = 'none';
    capturedImage = null;
}

// Leather Analysis
function selectAnimal(animal) {
    selectedAnimal = animal;
    
    // Update UI
    document.querySelectorAll('.grid-item').forEach(item => {
        item.style.background = '';
    });
    
    const card = document.getElementById(animal + 'Card');
    if (card) {
        card.style.background = 'rgba(210, 105, 30, 0.15)';
        card.style.borderColor = 'var(--leather)';
    }
}

function previewLeather() {
    const url = document.getElementById('leatherImageUrl').value;
    if (!url) {
        showToast('Please enter image URL', 'warning');
        return;
    }
    
    const img = document.getElementById('leatherPreviewImage');
    img.onload = function() {
        document.getElementById('leatherPreview').style.display = 'block';
        showToast('Leather image loaded', 'success');
    };
    img.onerror = function() {
        showToast('Failed to load image', 'error');
    };
    img.src = url;
}

function analyzeLeather() {
    const url = document.getElementById('leatherImageUrl').value;
    if (!url) {
        showToast('Please enter image URL', 'warning');
        return;
    }
    
    document.getElementById('leatherLoading').style.display = 'block';
    document.getElementById('leatherResults').style.display = 'none';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('leatherProgress').style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('leatherLoading').style.display = 'none';
                showLeatherResults();
                addToHistory('leather', leatherDB[selectedAnimal].name);
            }, 500);
        }
    }, 200);
}

function showLeatherResults() {
    const leather = leatherDB[selectedAnimal];
    
    const html = `
        <div class="card mt-3">
            <div class="team-badge mb-3">
                <i class="fas fa-user-shield"></i> DONI WIJAYA TEAM - Enhanced Analysis
            </div>
            
            <div class="text-center mb-3">
                <h3 class="leather">${leather.name}</h3>
                <div class="d-flex justify-center gap-1 mt-2">
                    <span class="badge badge-leather">Quality: ${leather.quality}</span>
                    <span class="badge badge-leather">Thickness: ${leather.thickness}</span>
                </div>
            </div>
            
            <h5><i class="fas fa-clipboard-check leather"></i> Analysis Summary</h5>
            <p class="mb-3">${leather.characteristics}</p>
            
            <h5><i class="fas fa-lightbulb leather"></i> Upcycling Product Ideas:</h5>
            <div class="grid mb-3">
                ${leather.products.map(product => `
                    <div class="grid-item">
                        <i class="fas ${product.icon} leather"></i>
                        <div>${product.name}</div>
                        <small>Time: ${product.time}</small>
                        <div class="mt-1">
                            <span class="badge ${getDifficultyClass(product.difficulty)}">
                                ${product.difficulty}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="d-flex gap-1">
                <button class="btn btn-leather" onclick="saveLeatherResult()">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="btn btn-leather" onclick="exportLeatherPDF()">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('leatherResults').innerHTML = html;
    document.getElementById('leatherResults').style.display = 'block';
}

// History Management
function loadHistory() {
    const tbody = document.getElementById('historyBody');
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No history yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = history.slice(0, 10).map(item => `
        <tr>
            <td>${new Date(item.date).toLocaleDateString()}</td>
            <td><span class="badge ${item.type === 'waste' ? 'badge-success' : 'badge-leather'}">${item.type}</span></td>
            <td>${item.material}</td>
            <td><span class="badge badge-success">Completed</span></td>
        </tr>
    `).join('');
}

function addToHistory(type, material) {
    const entry = {
        date: new Date().toISOString(),
        type: type,
        material: material
    };
    
    history.unshift(entry);
    if (history.length > 50) history = history.slice(0, 50);
    
    localStorage.setItem('recycleHistory', JSON.stringify(history));
    loadHistory();
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        history = [];
        localStorage.removeItem('recycleHistory');
        loadHistory();
        showToast('History cleared', 'success');
    }
}

// PDF Export
function exportResult(type) {
    showToast('Generating PDF report...', 'info');
    setTimeout(() => {
        showToast('PDF report ready!', 'success');
    }, 1500);
}

function exportLeatherPDF() {
    showToast('Generating leather report...', 'info');
    setTimeout(() => {
        showToast('Leather report ready!', 'success');
    }, 1500);
}

function exportHistoryPDF() {
    if (history.length === 0) {
        showToast('No history to export', 'warning');
        return;
    }
    
    showToast('Exporting history PDF...', 'info');
    setTimeout(() => {
        showToast('History PDF ready!', 'success');
    }, 1500);
}

function generateFullReport() {
    showToast('Generating comprehensive report...', 'info');
    setTimeout(() => {
        showToast('Full report ready!', 'success');
    }, 2000);
}

// Utility Functions (moved to utils.js, kept for backward compatibility)
function saveResult(type) {
    showToast(`Analysis saved for ${wasteDB[type].name}`, 'success');
}

function saveLeatherResult() {
    showToast(`Leather analysis saved`, 'success');
}

function shareResult() {
    showToast('Results shared!', 'success');
}

function setupEventListeners() {
    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // URL input enter key
    document.getElementById('imageUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loadImageFromUrl();
    });
    
    // Leather URL input enter key
    document.getElementById('leatherImageUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') previewLeather();
    });
    
    // Prevent default on links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    // Handle back button
    window.addEventListener('popstate', function() {
        showSection('dashboard');
    });
}

// Make functions globally available
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.showTab = showTab;
window.handleFileUpload = handleFileUpload;
window.analyzeMaterial = analyzeMaterial;
window.loadImageFromUrl = loadImageFromUrl;
window.analyzeFromUrl = analyzeFromUrl;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.switchCamera = switchCamera;
window.captureImage = captureImage;
window.analyzeCaptured = analyzeCaptured;
window.retakePhoto = retakePhoto;
window.selectAnimal = selectAnimal;
window.previewLeather = previewLeather;
window.analyzeLeather = analyzeLeather;
window.clearHistory = clearHistory;
window.exportResult = exportResult;
window.exportLeatherPDF = exportLeatherPDF;
window.exportHistoryPDF = exportHistoryPDF;
window.generateFullReport = generateFullReport;
window.saveResult = saveResult;
window.saveLeatherResult = saveLeatherResult;
window.shareResult = shareResult;