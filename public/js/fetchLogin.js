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
    alert('Login successful! You are logged in as ' + data.role);
    if (data.role === 'admin') {
      localStorage.setItem('role', 'admin');
      window.location.href = 'admin.html';
    } else {
      localStorage.setItem('role', 'customer');
      window.location.href = 'cus.html';
    }
  } else {
    alert('Error: ' + data.message);
  }
});
