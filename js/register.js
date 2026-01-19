$(document).ready(function () {

    // Formulario de registro (evento submit)
    $('#formRegister').on('submit', function (e) {
        e.preventDefault(); // Evitar que recargue 

        // Captura de elementos
        const nombre = $('#nombre').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        // Caso: Usuario no completa todos los campos
        if (!nombre || !email || !password) {
            showAlert({
                type: 'warning',
                message: 'Debes completar todos los campos para continuar.'
            });
            return;
        }

        const resultado = registrarUsuario(nombre, email, password);

        // Registro fallido
        if (!resultado.ok) {
            showAlert({
                type: 'danger',
                message: resultado.msg
            });
            return;
        }

        // Registro exitoso
        showAlert({
            type: 'success',
            title: 'Registro exitoso',
            message: `
                Tu cuenta fue creada correctamente.<br>
                <strong>CBU asignado:</strong> ${resultado.cbu}
            `,
            dismissible: false
        });

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    });

});
