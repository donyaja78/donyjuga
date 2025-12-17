// Utility Functions

function getColor(type) {
    const colors = {
        plastic: '#00ff88',
        paper: '#ff9800',
        glass: '#00d4ff',
        metal: '#ff00ff',
        leather: '#d2691e'
    };
    return colors[type] || '#ffffff';
}

function getDifficultyClass(difficulty) {
    const classes = {
        'Easy': 'badge-success',
        'Medium': 'badge-warning',
        'Hard': 'badge-leather',
        'Expert': 'badge-warning'
    };
    return classes[difficulty] || 'badge-success';
}

function showToast(message, type = 'info') {
    const bgColor = type === 'success' ? 'linear-gradient(45deg, var(--primary), var(--primary-dark))' :
                   type === 'error' ? 'linear-gradient(45deg, #ff416c, #ff4b2b)' :
                   type === 'warning' ? 'linear-gradient(45deg, #ff9800, #ff5722)' :
                   'linear-gradient(45deg, #00d4ff, #0099cc)';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: bgColor,
        stopOnFocus: true,
        style: {
            borderRadius: "12px",
            fontWeight: "600"
        }
    }).showToast();
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function initCharts() {
    const ctx = document.getElementById('materialChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Leather'],
            datasets: [{
                data: [35, 25, 15, 10, 15],
                backgroundColor: [
                    '#00ff88',
                    '#ff9800',
                    '#00d4ff',
                    '#ff00ff',
                    '#d2691e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getColor,
        getDifficultyClass,
        showToast,
        showLoading,
        hideLoading,
        initCharts
    };
}