// Email validation and download functionality

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Replace with your actual GitHub Releases download URL
const DOWNLOAD_URL = "https://github.com/YOUR_USERNAME/BackWatcher/releases/latest/download/BackWatcher.dmg";

document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('downloadEmail');
    const downloadBtn = document.getElementById('downloadBtn');
    const emailError = document.getElementById('emailError');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const downloadLink = document.getElementById('downloadLink');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            // Clear previous errors
            emailError.style.display = 'none';
            emailError.textContent = '';

            // Validate email
            if (!email) {
                emailError.textContent = 'Please enter your email address';
                emailError.style.display = 'block';
                return;
            }

            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                return;
            }

            // Email is valid - show download link
            downloadLink.href = DOWNLOAD_URL;
            downloadLinkContainer.style.display = 'block';
            emailInput.disabled = true;
            downloadBtn.style.display = 'none';

            // Optional: Store email in localStorage for tracking
            localStorage.setItem('backwatcher_email', email);

            // Optional: Track download (Google Analytics or similar)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_initiated', {
                    'email': email
                });
            }
        });
    }

    // Allow Enter key to submit
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                downloadBtn.click();
            }
        });
    }
});
