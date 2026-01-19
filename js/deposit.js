// DEPÓSITO

// Asegurar autenticación
requireAuth();

// Mostrar saldo del usuario logueado
function renderBalance() {
    const usuario = getUsuarioActual();
    $('#saldo').text(`$${usuario.saldo.toLocaleString('es-CL')}`);
}

$(document).ready(function () {
    renderBalance();
});

// Depósito (evento submit)
$('#formDeposit').on('submit', function (e) {
    e.preventDefault();

    // Obtención del monto de depósito desde el input
    const amount = Number($('#depositAmount').val());

    // Caso: No hay monto o monto negativo
    if (!amount || amount <= 0) {
        showAlert({
            type: 'danger',
            message: 'Ingresa un monto válido.'
        });
        return;
    }

    const usuario = getUsuarioActual();

    // Actualizar saldo
    usuario.saldo += amount;
    updateUsuario(usuario);

    // Registrar transacción
    saveTransaction({
        type: 'deposito',
        owner: usuario.email,   
        amount: amount,
        date: new Date().toISOString()
    });
    

    renderBalance();

    // Alerta de depósito exitoso
    showAlert({
        type: 'success',
        message: `Depósito de $${amount.toLocaleString('es-CL')} realizado con éxito.`
    });

    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 1500);
});
