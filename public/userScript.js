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
      window.location.href = '/profile';

  } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed!');
  }
});

