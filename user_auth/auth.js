// Configuration
const API_BASE_URL = 'https://car-rental-api-ks0u.onrender.com/api/users'


// Utility Functions
function showError(message, elementId = 'errorMessage') {
    const errorDiv = document.getElementById(elementId);
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        hideSuccess();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
}

function showSuccess(message, elementId = 'successMessage') {
    const successDiv = document.getElementById(elementId);
    const successText = document.getElementById('successText');
    
    if (successDiv && successText) {
        successText.textContent = message;
        successDiv.classList.remove('hidden');
        hideError();
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);
    }
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function hideSuccess() {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.classList.add('hidden');
    }
}

function setLoading(isLoading, buttonId, textId, loaderId) {
    const button = document.getElementById(buttonId);
    const text = document.getElementById(textId);
    const loader = document.getElementById(loaderId);
    
    if (button && text && loader) {
        button.disabled = isLoading;
        if (isLoading) {
            button.classList.add('opacity-75', 'cursor-not-allowed');
            loader.classList.remove('hidden');
        } else {
            button.classList.remove('opacity-75', 'cursor-not-allowed');
            loader.classList.add('hidden');
        }
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// API Functions
async function makeAPICall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

async function signupUser(userData) {
    return await makeAPICall('/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

// Password Toggle Functionality
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('#togglePassword');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Signup Functionality
function initializeSignup() {
    const signupForm = document.getElementById('signupForm');
    
    // Initialize password toggle
    initializePasswordToggle();
    
    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {
                name: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            const confirmPassword = formData.get('confirmPassword');
            const termsAccepted = formData.get('terms');
            
            // Validation
            if (!userData.name.trim()) {
                showError('Please enter your full name');
                return;
            }
            
            if (!validateEmail(userData.email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (!validatePassword(userData.password)) {
                showError('Password must be at least 6 characters long');
                return;
            }
            
            if (userData.password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (!termsAccepted) {
                showError('Please accept the terms and conditions');
                return;
            }
            
            try {
                setLoading(true, 'signupBtn', 'signupBtnText', 'signupLoader');
                hideError();
                
                await signupUser(userData);
                
                showSuccess('Account created successfully! Please check your email for verification.');
                
                // Optionally redirect to login page after success
                setTimeout(() => {
                    window.location.href = './user_auth/login.html';
                }, 2000);
                
            } catch (error) {
                showError(error.message || 'Failed to create account. Please try again.');
            } finally {
                setLoading(false, 'signupBtn', 'signupBtnText', 'signupLoader');
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
});