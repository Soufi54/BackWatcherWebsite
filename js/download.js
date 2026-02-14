// Download: direct CTA, optional email after

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const DOWNLOAD_URL = "https://github.com/Soufi54/BackWatcherWebsite/releases/download/v1.2.4/BackWatcher-1.2.4-arm64.dmg";

// Supabase configuration for storing download leads
const SUPABASE_URL = 'https://srdtobhozcsupwyfxvxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRvYmhvemNzdXB3eWZ4dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTU1NDEsImV4cCI6MjA4NDg5MTU0MX0.xH48IkxcRqvLEvqBvIY4PmuxIoeF2lsc0C6Tsnj7HbM';

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
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadLinkContainer = document.getElementById('downloadLinkContainer');
    const downloadLink = document.getElementById('downloadLink');
    const optionalEmailSection = document.getElementById('optionalEmailSection');
    const emailInput = document.getElementById('downloadEmail');
    const emailError = document.getElementById('emailError');
    const optionalEmailBtn = document.getElementById('optionalEmailBtn');
    const optionalEmailThanks = document.getElementById('optionalEmailThanks');

    // Click "Download Free Trial (macOS)" → show download link immediately, no email required
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadLink.href = DOWNLOAD_URL;
            downloadLinkContainer.style.display = 'block';
            optionalEmailSection.style.display = 'block';
            downloadBtn.style.display = 'none';

            if (typeof gtag !== 'undefined') {
                gtag('event', 'download_cta_click', {
                    'event_category': 'engagement',
                    'event_label': 'download_form'
                });
            }
        });
    }

    // Track actual download link click
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
            // Reddit Pixel - track installation (app download)
            if (typeof rdt !== 'undefined') {
                rdt('track', 'Lead');
            }
        });
    }

    // Optional email: submit only if they entered a valid email
    if (optionalEmailBtn && emailInput) {
        optionalEmailBtn.addEventListener('click', async function() {
            const email = emailInput.value.trim();
            emailError.style.display = 'none';
            emailError.textContent = '';

            if (!email) {
                return; // optional - do nothing
            }

            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                return;
            }

            optionalEmailBtn.disabled = true;
            optionalEmailBtn.textContent = 'Sending...';

            await storeDownloadLead(email);
            localStorage.setItem('backwatcher_email', email);

            optionalEmailThanks.style.display = 'block';
            emailInput.disabled = true;
            optionalEmailBtn.style.display = 'none';

            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_entry', {
                    'event_category': 'engagement',
                    'event_label': 'optional_after_download'
                });
            }
        });
    }

    if (emailInput && optionalEmailBtn) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                optionalEmailBtn.click();
            }
        });
    }
});
