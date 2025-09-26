// Check if user is already logged in and redirect to home.html
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'home.html';
    }
});

// Toggle between login and register forms (called by buttons)
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'home.html';
    } else {
        // Show error styling 
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        emailInput.style.borderColor = '#dc3545';
        passwordInput.style.borderColor = '#dc3545';
        
        // Reset border color after 3 seconds
        setTimeout(() => {
            emailInput.style.borderColor = '#e1e1e1';
            passwordInput.style.borderColor = '#e1e1e1';
        }, 3000);
    }
});

// Password strength checker for registration
document.getElementById('regPassword').addEventListener('input', function() {
    const password = this.value;
    const suggestions = document.getElementById('passwordSuggestions');
    const lengthCheck = document.getElementById('lengthCheck');
    const letterCheck = document.getElementById('letterCheck');
    const numberCheck = document.getElementById('numberCheck');
    
    if (password.length > 0) {
        suggestions.classList.add('show');
        
        // Check length
        if (password.length >= 6) {
            lengthCheck.classList.add('valid');
            lengthCheck.querySelector('.icon').textContent = '✓';
        } else {
            lengthCheck.classList.remove('valid');
            lengthCheck.querySelector('.icon').textContent = '○';
        }
        
        // Check for letters
        if (/[a-zA-Z]/.test(password)) {
            letterCheck.classList.add('valid');
            letterCheck.querySelector('.icon').textContent = '✓';
        } else {
            letterCheck.classList.remove('valid');
            letterCheck.querySelector('.icon').textContent = '○';
        }
        
        // Check for numbers
        if (/\d/.test(password)) {
            numberCheck.classList.add('valid');
            numberCheck.querySelector('.icon').textContent = '✓';
        } else {
            numberCheck.classList.remove('valid');
            numberCheck.querySelector('.icon').textContent = '○';
        }
    } else {
        suggestions.classList.remove('show');
    }
});

// Handle register form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const successMessage = document.getElementById('successMessage');
    
    // Simple validation
    if (!name || !email || !password) {
        if (!name) document.getElementById('regName').style.borderColor = '#dc3545';
        if (!email) document.getElementById('regEmail').style.borderColor = '#dc3545';
        if (!password) document.getElementById('regPassword').style.borderColor = '#dc3545';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('regPassword').style.borderColor = '#dc3545';
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        document.getElementById('regEmail').style.borderColor = '#dc3545';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        joinDate: new Date().toISOString()
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Show success message and redirect
    document.getElementById('passwordSuggestions').classList.remove('show');
    successMessage.classList.add('show');
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 2000);
});

// Input animation effects
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
});