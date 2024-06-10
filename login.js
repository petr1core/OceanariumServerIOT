// document.getElementById('loginForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const form = event.target;
//     const formData = new FormData(form);
//     const data = {
//         login: formData.get('login'),
//         password: formData.get('password')
//     };

//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json().then(data => ({ status: response.status, body: data })))
//     .then(({ status, body }) => {
//         if (status === 200) {
//             window.location.href = '/dash';
//         } else {
//             showError(body.message);
//         }
//     })
//     .catch(error => {
//         showError('An error occurred');
//     });

//     function showError(message) {
//         const errorElement = document.createElement('div');
//         errorElement.style.color = 'red';
//         errorElement.textContent = message;
//         form.appendChild(errorElement);
//         Array.from(form.elements).forEach(input => {
//             if (input.tagName === 'INPUT') {
//                 input.style.borderColor = 'red';
//             }
//         });
//     }
// });
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
        login: formData.get('login'),
        password: formData.get('password')
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            window.location.href = '/dash';
        } else {
            showError(body.message);
        }
    })
    .catch(error => {
        showError('An error occurred');
    });

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.style.color = 'red';
        errorElement.textContent = message;
        // Убедитесь, что предыдущие сообщения об ошибках удалены
        const previousError = form.querySelector('div');
        if (previousError) {
            previousError.remove();
        }
        form.appendChild(errorElement);
        Array.from(form.elements).forEach(input => {
            if (input.tagName === 'INPUT') {
                input.style.borderColor = 'red';
            }
        });
    }
});
