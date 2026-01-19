// RETIRO

// Auntenticación
requireAuth();

// Saldo
function renderBalance() {
    const usuario = getUsuarioActual();
    $('#saldo').text(`$${usuario.saldo.toLocaleString('es-CL')}`);
}

$(document).ready(function () {
    renderBalance();

    // Formulario de retiro (evento submit)
    $('#withdrawForm').on('submit', function (e) {
        e.preventDefault();

        // Obtención de monto de retiro desde el input
        const amount = Number($('#withdrawAmount').val());
        const usuario = getUsuarioActual();

        // Caso: No hay monto o es negativo
        if (!amount || amount <= 0) {
            showAlert({
                type: 'danger',
                message: 'Monto inválido.'
            });
            return;
        }

        // Caso de intento de retiro mayor al saldo disponible
        if (amount > usuario.saldo) {
            showAlert({
                type: 'danger',
                message: 'Saldo insuficiente.'
            });
            return;
        }

        // Restar saldo
        usuario.saldo -= amount;
        updateUsuario(usuario);

        // Registrar transacción
        saveTransaction({
            type: 'retiro',
            owner: usuario.email,
            amount,
            date: new Date().toISOString()
        });

        renderBalance();

        // Alerta de retiro exitoso
        showAlert({
            type: 'success',
            message: `Retiro de $${amount.toLocaleString('es-CL')} realizado con éxito.`
        });

        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
});

});
