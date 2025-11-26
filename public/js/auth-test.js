const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Load teams on page load
async function loadTeams() {
    try {
        const response = await fetch(`${API_URL}/teams`);
        const data = await response.json();

        const teamSelect = document.getElementById('teamId');
        if (!teamSelect) return;

        teamSelect.innerHTML = '';

        if (data.success && data.data.length > 0) {
            teamSelect.innerHTML = '<option value="">Select a team...</option>';
            data.data.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = `${team.name} (${team.region})`;
                teamSelect.appendChild(option);
            });
        } else {
            teamSelect.innerHTML = '<option value="">No teams available - Create one first!</option>';
        }
    } catch (error) {
        console.error('Error loading teams:', error);
        const teamSelect = document.getElementById('teamId');
        if (teamSelect) {
            teamSelect.innerHTML = '<option value="">Error loading teams</option>';
        }
    }
}

// Show help for creating a team
function showCreateTeamHelp() {
    const message = `To create a team, use this command in terminal:\n\ncurl -X POST http://localhost:3000/api/teams \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "My Team", "region": "My Region"}'\n\nOr use Swagger UI at http://localhost:3000/api-docs`;
    alert(message);
}

// Update UI based on auth state
function updateAuthUI() {
    const loggedInSection = document.getElementById('loggedIn');
    const loggedOutSection = document.getElementById('loggedOut');

    if (!loggedInSection || !loggedOutSection) return;

    if (authToken && currentUser) {
        loggedInSection.classList.remove('hidden');
        loggedOutSection.classList.add('hidden');
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = JSON.stringify(currentUser, null, 2);
        }
    } else {
        loggedInSection.classList.add('hidden');
        loggedOutSection.classList.remove('hidden');
    }
}

// Show result message
function showResult(message, isSuccess) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    resultDiv.textContent = message;
    resultDiv.className = isSuccess ? 'result success' : 'result error';
    resultDiv.style.display = 'block';
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

// Switch tabs
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));

    const activeTab = document.getElementById(`tab-${tab}`);
    if (activeTab) activeTab.classList.add('active');

    const activeSection = document.getElementById(`${tab}-section`);
    if (activeSection) activeSection.classList.add('active');

    if (tab === 'test') {
        updateAuthUI();
    }
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            authToken = data.data.token;
            currentUser = {
                email: data.data.user.email,
                id: data.data.user.id,
                player: data.data.player
            };

            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showResult('Login successful!', true);
            setTimeout(() => {
                showTab('test');
            }, 1000);
        } else {
            showResult(data.error || 'Login failed', false);
        }
    } catch (error) {
        showResult('Error: ' + error.message, false);
    }
}

// Register Handler
async function handleRegister(e) {
    e.preventDefault();

    const registerData = {
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        player_name: document.getElementById('playerName').value,
        date_of_birth: document.getElementById('dateOfBirth').value,
        curp: document.getElementById('curp').value,
        team_id: document.getElementById('teamId').value,
        federation_id: parseInt(document.getElementById('federationId').value),
        phone_number: document.getElementById('phoneNumber').value || null,
        category: document.getElementById('category').value || null,
        eligibility: true,
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showResult('Registration successful! You can now login.', true);
            setTimeout(() => {
                showTab('login');
            }, 2000);
        } else {
            showResult(data.error || 'Registration failed', false);
        }
    } catch (error) {
        showResult('Error: ' + error.message, false);
    }
}

// Test API endpoint
async function testEndpoint(endpoint) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            showResult(`Success! Check console for response`, true);
            console.log('API Response:', data);
        } else {
            showResult(data.error || 'API call failed', false);
        }
    } catch (error) {
        showResult('Error: ' + error.message, false);
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    showResult('Logged out successfully', true);
    setTimeout(() => {
        showTab('login');
    }, 1000);
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTeams();
    updateAuthUI();

    // Tabs
    document.getElementById('tab-login')?.addEventListener('click', () => showTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => showTab('register'));
    document.getElementById('tab-test')?.addEventListener('click', () => showTab('test'));

    // Help Link
    document.getElementById('create-team-help')?.addEventListener('click', (e) => {
        e.preventDefault();
        showCreateTeamHelp();
    });

    // Forms
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);

    // API Test Buttons
    document.getElementById('btn-test-teams')?.addEventListener('click', () => testEndpoint('/api/teams'));
    document.getElementById('btn-test-players')?.addEventListener('click', () => testEndpoint('/api/players'));
    document.getElementById('btn-test-profile')?.addEventListener('click', () => testEndpoint('/api/auth/me'));
    document.getElementById('btn-test-seasons')?.addEventListener('click', () => testEndpoint('/api/seasons'));

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', logout);
});
