

document.getElementById('btnIngresar').addEventListener('click', () => {
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const mensajeError = document.getElementById('mensajeError');

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email:'user1@demo.cl',
            password:
        })

    if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));

        if (foundUser.role === "admin") {
            window.location.href = "Admin.html";
        } else if (foundUser.role === "coach") {
            window.location.href = "Coach.html";
        } else {
            window.location.href = "Cliente.html";
        }
    } else {
        mensajeError.textContent = "Credenciales incorrectas. Inténtalo de nuevo.";
    }
});
