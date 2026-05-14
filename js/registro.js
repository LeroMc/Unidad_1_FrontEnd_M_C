
//CON ESTO ES POSIBLE EL REGISTRAR UN USUARIO Y QUE ESTE SE GUARDE EN LA BASE DE DATOS,
//ADEMAS DE MOSTRAR AVISOS DE ERRORES SEGUN LA SITUACION QUE SE PRESENTE
document.getElementById('btnRegistrar').addEventListener('click', async () => {
    const full_name = document.getElementById('full_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const birth_date = document.getElementById('birth_date').value;
    const gender = document.getElementById('gender').value;
    const practica_deporte = document.getElementById('practica_deporte').value;
    const nivel_experiencia = document.getElementById('nivel_experiencia').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;
    const mensajeError = document.getElementById('mensajeError');

    mensajeError.textContent = "";
    if (!full_name || !email || !password || !confirm_password) {
        mensajeError.textContent = "Todos los campos marcados son obligatorios.";
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensajeError.textContent = "Por favor, ingresa un correo electrónico válido.";
        return;
    }
    if (password.length < 8) {
        mensajeError.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    if (!passwordRegex.test(password)) {
        mensajeError.textContent = "La contraseña debe contener letras y números.";
        return;
    }
    if (password !== confirm_password) {
        mensajeError.textContent = "Las contraseñas no coinciden.";
        return;
    }
    const userData = {
        full_name: full_name,
        email: email,
        password: password,
        role: "user", 
        birth_date: birth_date || null,
        metadata: {
            gender: gender,
            practica_deporte: practica_deporte,
            nivel_experiencia: nivel_experiencia
        }
    };
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Registro completado con éxito! Ahora puedes iniciar sesión.");
            window.location.href = "login.html";
        } else {
            mensajeError.textContent = result.message || "Error al registrar el usuario.";
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        mensajeError.textContent = "No se pudo conectar con el servidor.";
    }
});