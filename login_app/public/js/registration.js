// registration.js

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener for the form's submit event
    document.getElementById('registrationForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        // Send the form data to the server using Fetch API
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify({ phone, password }), // Send the data as JSON
            });

            if (response.ok) {
                const data = await response.json();
                // Handle the response from the server
                if (data.message === 'Registration successful') {
                    // Redirect to a success page or perform other actions
                    window.location.href = '/login'; // Redirect to the dashboard, for example
                } else {
                    // Handle registration failure
                    alert('Registration failed. Please try again.');
                }
            } else {
                // Handle HTTP error
                alert('Registration failed due to a network error. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
