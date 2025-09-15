// Import API_BASE_URL from your config file
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Find the Google Signup button in the DOM
    const googleButton = document.getElementById('googleSignup');

    if (googleButton) {
        // Add click event listener to the Google Signup button
        googleButton.addEventListener('click', async (event) => {
            event.preventDefault();

            try {
                // Disable the button and show a loading state
                const button = event.target.closest('button');
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Connecting to Google...';
                button.disabled = true;

                // Fetch the Google Auth URL from the backend
                const response = await fetch(`${API_BASE_URL}/users/google`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                // Check if the response is successful
                if (!response.ok) {
                    throw new Error(`Failed to fetch Google Auth URL. Status: ${response.status}`);
                }

                // Parse the response JSON to get the auth URL
                const data = await response.json();
                const authUrl = data.url;

                if (!authUrl) {
                    throw new Error('Google Auth URL not found in the backend response');
                }

                // Redirect the user to the Google Auth URL
                window.location.href = authUrl;
            } catch (error) {
                // Log the error and alert the user
                console.error('Google Auth Error:', error.message);
                alert('Failed to connect to Google. Please try again.');
            } finally {
                // Restore the button's original state
                const button = event.target.closest('button');
                button.innerHTML = 'Sign in with Google'; // Replace with your button's original content
                button.disabled = false;
            }
        });
    } else {
        console.error('Google Signup button not found in the DOM!');
    }
});