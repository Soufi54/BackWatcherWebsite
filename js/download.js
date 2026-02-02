// Email validation and download functionality

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const DOWNLOAD_URL = "https://github.com/Soufi54/BackWatcherWebsite/releases/download/v1.2.3/BackWatcher-1.2.3-arm64.dmg";

// Supabase configuration for storing download leads
// Uses the same Supabase instance as checkout.js
const SUPABASE_URL = 'https://srdtobhozcsupwyfxvxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRvYmhvemNzdXB3eWZ4dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTU1NDEsImV4cCI6MjA4NDg5MTU0MX0.xH48IkxcRqvLEvqBvIY4PmuxIoeF2lsc0C6Tsnj7HbM';

// Store email as download lead in Supabase
async function storeDownloadLead(email) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/download_leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                email: email,
                source: 'website'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to store download lead:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('downloadEmail');
    const downloadBtn = document.getElementById('downloadBtn');
    const emailError = document.getElementById('emailError');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const downloadLink = document.getElementById('downloadLink');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function() {
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

            // Disable button while processing
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Processing...';

            // Store email as lead in Supabase (don't block if it fails)
            await storeDownloadLead(email);

            // Email is valid - show download link
            downloadLink.href = DOWNLOAD_URL;
            downloadLinkContainer.style.display = 'block';
            emailInput.disabled = true;
            downloadBtn.style.display = 'none';

            // Store email locally for pre-filling checkout
            localStorage.setItem('backwatcher_email', email);

            // Track email entry event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_entry', {
                    'event_category': 'engagement',
                    'event_label': 'download_form'
                });
            }
        });
    }

    // Track actual download link click (GitHub release)
    if (downloadLink) {
        downloadLink.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_click', {
                    'event_category': 'engagement',
                    'event_label': 'macos_dmg'
                });
                gtag('event', 'github_click', {
                    'event_category': 'engagement',
                    'event_label': 'release_download'
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
