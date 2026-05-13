
let u = null;
//ESTO DE SIRVE PARA MOSTRAR LOS DATOS DEL USUARIO EN LA SECCION DEL PERFIL
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); 

    if (!token || !userData) {
        window.location.href = 'Login.html';
        return;
    }
    u = JSON.parse(userData);

    const btnEditar = document.getElementById('btnHabilitarEdicion');
    const btnGuardar = document.getElementById('btnGuardarInfo');
    const inputsInfo = document.querySelectorAll('#formInfoPersonal input, #formInfoPersonal textarea');
    const btnVolver = document.getElementById('btnVolver');
    const btnUpdatePass = document.getElementById('btnUpdatePass');
    inputsInfo.forEach(input => input.disabled = true);
    if(btnGuardar) btnGuardar.style.display = 'none';

//CON ESTO SE VAN A MOSTRA LOS DATOS DEL USUARIO EN LOS LUGARES CORRESPONDIENTES DEL PERFIL
    llenarDatos(u);
    function llenarDatos(usuario) {
    const nombreCap = usuario.full_name.split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');

    document.getElementById('sideName').textContent = nombreCap;
    document.getElementById('sideEmail').textContent = usuario.email.toLowerCase();
    document.getElementById('sideRole').textContent = usuario.role.toUpperCase();
    
    const badge = document.getElementById('sideRole');
    badge.className = `badge ${usuario.role}`;
    const fReg = usuario.created_at || usuario.createdAt;
    document.getElementById('sideRegister').textContent = fReg ? new Date(fReg).toLocaleDateString('es-ES') : '---';
    const fNac = usuario.birth_date || usuario.birthdate;
    document.getElementById('sideBirth').textContent = fNac ? new Date(fNac).toLocaleDateString('es-ES') : '---';
    document.getElementById('editName').value = usuario.full_name;
    document.getElementById('editEmail').value = usuario.email;
    if(fNac) document.getElementById('editBirth').value = fNac.split('T')[0];
    if(usuario.metadata) {
        const deporteDB = usuario.metadata.practica_deporte || "";
        const bioDB = usuario.metadata.nivel_experiencia || "";
        const valoresRegistro = ["si", "no", "principiante", "intermedio", "avanzado"];

        document.getElementById('editSport').value = valoresRegistro.includes(deporteDB.toLowerCase()) 
            ? "" 
            : deporteDB;
        document.getElementById('editBio').value = valoresRegistro.includes(bioDB.toLowerCase()) 
            ? "" 
            : bioDB;
    }
}
//CON ESTA FUNCION SE PODRA HABILITAR LA EDICION DE LOS CAMPOS
    btnEditar.addEventListener('click', () => {
        inputsInfo.forEach(input => input.disabled = false);
        btnGuardar.style.display = 'block';
        btnEditar.style.display = 'none';
    });
//CON ESTA PARTE SE VAN A GUARDAR LOS CAMBIOS REALIZADOS EN LOS CAMPOS DEL PERFIL
    btnGuardar.addEventListener('click', async () => {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const birth = document.getElementById('editBirth').value;
        const sport = document.getElementById('editSport').value;
        const bio = document.getElementById('editBio').value;
        try {
            const resp = await fetch(`http://localhost:3000/api/users/${u.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    birth_date: birth,
                    metadata: {
                        practica_deporte: sport,
                        nivel_experiencia: bio
                    }
                })
            });

            if (resp.ok) {
                const result = await resp.json();
                localStorage.setItem('user', JSON.stringify(result.data));
                alert("¡Perfil actualizado correctamente!");
                location.reload(); 
            } else {
                const errorData = await resp.json();
                alert("Error: " + (errorData.message || "No se pudo guardar"));
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor.");
        }
    });
//GRACIAS A ESTO SE PODRA CAMBIAR LA CONTRASEÑA Y MOSTRAR AVISOS DE ERROS SEGUN LA SITUACION QUE SE PRESENTE
    if (btnUpdatePass) {
        btnUpdatePass.addEventListener('click', async () => {
            const oldPass = document.getElementById('oldPass').value;
            const newPass = document.getElementById('newPass').value;
            const confirm = document.getElementById('confirmNewPass').value;
            if (!oldPass || !newPass || !confirm) {
                alert("Completa todos los campos de contraseña.");
                return;
            }
            if (newPass.length < 8) {
                alert("La nueva contraseña debe tener al menos 8 caracteres.");
                return;
            }
            if (newPass !== confirm) {
                alert("Las contraseñas no coinciden.");
                return;
            }
            try {
                const resp = await fetch(`http://localhost:3000/api/users/${u.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ 
                        password: newPass,
                        old_password: oldPass 
                    })
                });
                if (resp.ok) {
                    alert("¡Contraseña actualizada correctamente en la base de datos!");
                    document.getElementById('formPass').reset();
                } else {
                    const data = await resp.json();
                    alert("Error: " + (data.message || "No se pudo cambiar la clave"));
                }
            } catch (err) {
                console.error("Error al cambiar contraseña:", err);
            }
        });
    }
//ESTA FUNCION ES PARA QUE CUANDO TOQUE EL BOTON DE VOLVER SE REDIRECCIONE A LA PAGINA CORRESPONDIENTE SEGUN EL ROL DEL USUARIO
    btnVolver.addEventListener('click', () => {
        const rol = u.role.toLowerCase();
        if (rol === 'admin') window.location.href = 'Admin.html';
        else if (rol === 'coach') window.location.href = 'Coach.html';
        else window.location.href = 'Cliente.html';
    });
}); 