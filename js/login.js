$(document).ready(function () {

    // Formulario de inicio de sesión (evento submit)
    $('#formLogin').on('submit', function (event) {
        event.preventDefault();

        // Obtención de datos del input
        const email = $('#exampleInputEmail1').val().trim();
        const password = $('#exampleInputPassword1').val().trim();

        // Caso: el usuario no completa todos los campos.
        if (!email || !password) {
            showAlert({
                type: 'warning',
                title: 'Campos incompletos',
                message: 'Debes completar email y contraseña.'
            });
            return;
        }

        const ok = loginUsuario(email, password);

        // Auntenticación fallida
        if (!ok) {
            showAlert({
                type: 'danger',
                title: 'Error de autenticación',
                message: 'Email o contraseña incorrectos.'
            });
            return;
        }

        // Inicio de sesión exitoso
        showAlert({
            type: 'success',
            title: 'Inicio de sesión exitoso',
            message: 'Redirigiendo al menú principal...',
            dismissible: false
        });

        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
    });

});
