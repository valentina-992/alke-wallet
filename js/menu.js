// Menú principal

// Autenticación
requireAuth();

$(document).ready(function () {

    // Cerrar el sidebar 
    function cerrarSidebar() {
        const sidebarEl = document.getElementById('sidebar');
        const instance = bootstrap.Offcanvas.getInstance(sidebarEl);

        if (instance) {
            instance.hide();
        }
    }

    function navegar(url) {
        cerrarSidebar();
        setTimeout(() => {
            window.location.href = url;
        }, 200);
    }

    // Navegación entre pantallas
    const rutas = {
        btnGoDeposit: 'deposit.html',
        btnGoWithdraw: 'withdraw.html',
        btnGoSendMoney: 'sendmoney.html',
        btnGoTransactions: 'transactions.html'
    };

    $.each(rutas, function (btnId, url) {
        $('#' + btnId).on('click', function (e) {
            e.preventDefault();
            navegar(url);
        });
    });

  
    // Mostrar saldo (usuario actual)
    const usuario = getUsuarioActual();

    if (usuario) {
        $('#saldo').text(
            `$${usuario.saldo.toLocaleString('es-CL')}`
        );
    }

    // Logout (evento click)
    $('#btnLogout').on('click', function () {
        showAlert({
            type: 'warning',
            title: 'Sesión cerrada',
            message: 'Has cerrado sesión correctamente.',
            dismissible: false
        });

        setTimeout(() => {
            logoutUsuario();
            window.location.href = 'login.html';
        }, 1000);
    });

});
