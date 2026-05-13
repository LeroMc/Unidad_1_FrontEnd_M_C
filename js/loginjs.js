
document.getElementById('btnIngresar').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensajeError = document.getElementById('mensajeError');

    mensajeError.textContent = "";

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));

            const role = result.data.user.role;
            if (role === "admin") {
                window.location.href = "/html/Admin.html";
            } else if (role === "coach") {
                window.location.href = "/html/Coach.html";
            } else {
                window.location.href = "/html/Cliente.html";
            }
        } else {
            mensajeError.textContent = result.message || "Credenciales incorrectas.";
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        mensajeError.textContent = "Error al conectar con el servidor.";
    }
});