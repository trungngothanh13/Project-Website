document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    // Store the IDs and role locally
    alert('Login successful! You are logged in as ' + data.role + ' with ID: ' + data.user_id);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user_id', data.user_id);
  
    if (data.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'cus.html';
    }
  } else {
    alert('Error: ' + data.message);
  }

});
