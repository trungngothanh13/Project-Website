// public/js/fetchSignup.js
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const full_name = document.getElementById('fullname').value;
  const username = document.getElementById('username').value;
  const passwordFields = document.querySelectorAll('#signupForm input[type="password"]');
  const password = passwordFields[0].value;
  const passwordConfirmation = passwordFields[1].value;

  if (password !== passwordConfirmation) {
    alert('Passwords do not match');
    return;
  }

  const response = await fetch('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, username, password })
  });  

  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    // Optionally redirect to login page or cus page
    window.location.href = 'login.html';
  } else {
    alert('Error: ' + data.message);
  }
});
