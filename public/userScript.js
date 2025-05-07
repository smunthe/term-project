// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      password: document.getElementById('password').value,
      rePassword: document.getElementById('confirmPassword').value
  };

  try {
      const response = await fetch('/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Registration success:', data);
      alert('User registered successfully!');
  } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed!');
  }
});

document.getElementById('displayBtn').addEventListener('click', async () => {
  try {
      console.log('Fetching users...'); // Debug log
      const response = await fetch('http://localhost:3000/newUser');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      console.log('Received users:', users); // Debug log
      document.getElementById('userDisplay').textContent = JSON.stringify(users, null, 2);
  } catch (error) {
      console.error('Error fetching users:', error);
      document.getElementById('userDisplay').textContent = 'Error loading users: ' + error.message;
  }
});