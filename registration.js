document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
        login: formData.get('login'),
        password: formData.get('password'),
        phone: formData.get('phone')
    };

    fetch('/process-registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Registration successful') {
            window.location.href = '/dash';
        } else {
            showError(data.message);
        }
    })
    .catch(error => {
        showError('invalid password or user already exists');
    });

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.style.color = 'red';
        errorElement.textContent = message;
        form.appendChild(errorElement);
        Array.from(form.elements).forEach(input => {
            if (input.tagName === 'INPUT') {
                input.style.borderColor = 'red';
            }
        });
    }
});