// Stripe Checkout Integration
// Replace these with your actual values
const SUPABASE_URL = 'https://srdtobhozcsupwyfxvxv.supabase.co'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRvYmhvemNzdXB3eWZ4dnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTU1NDEsImV4cCI6MjA4NDg5MTU0MX0.xH48IkxcRqvLEvqBvIY4PmuxIoeF2lsc0C6Tsnj7HbM';
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/create-checkout-session`;

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.getElementById('checkoutButton');
    const checkoutEmail = document.getElementById('checkoutEmail');
    const errorMessage = document.getElementById('errorMessage');
    const checkoutForm = document.getElementById('checkoutForm');
    const loadingMessage = document.getElementById('loadingMessage');

    // Check if redirected from canceled payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('canceled') === 'true') {
        errorMessage.textContent = 'Payment was canceled. You can try again when ready.';
        errorMessage.style.color = 'orange';
    }

    // Pre-fill email from localStorage (if user came from download flow)
    const savedEmail = localStorage.getItem('backwatcher_email');
    if (savedEmail && checkoutEmail && !checkoutEmail.value) {
        checkoutEmail.value = savedEmail;
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function() {
            const email = checkoutEmail.value.trim();

            // Clear previous errors
            errorMessage.textContent = '';
            errorMessage.style.color = 'red';

            // Validate email
            if (!email) {
                errorMessage.textContent = 'Please enter your email address';
                return;
            }

            if (!validateEmail(email)) {
                errorMessage.textContent = 'Please enter a valid email address';
                return;
            }

            // Show loading, hide form
            checkoutForm.style.display = 'none';
            loadingMessage.style.display = 'block';

            try {
                // Call Supabase Edge Function to create checkout session
                const response = await fetch(SUPABASE_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify({
                        email: email,
                        address: '' // No address needed
                    })
                });

                const data = await response.json();

                if (data.success && data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = data.url;
                } else {
                    // Show error
                    checkoutForm.style.display = 'block';
                    loadingMessage.style.display = 'none';
                    errorMessage.textContent = data.error || 'Failed to create checkout session. Please try again.';
                }
            } catch (error) {
                console.error('Error:', error);
                checkoutForm.style.display = 'block';
                loadingMessage.style.display = 'none';
                errorMessage.textContent = 'An error occurred. Please try again or contact support.';
            }
        });
    }

    // Allow Enter key to submit
    if (checkoutEmail) {
        checkoutEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkoutButton.click();
            }
        });
    }
});
