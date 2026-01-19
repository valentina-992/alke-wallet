// Autenticación
requireAuth();

$(document).ready(function () {

    const usuario = getUsuarioActual();
    const $list = $('#transactionsList');

    // Todas las transacciones
    const todas = JSON.parse(
        localStorage.getItem('transacciones_billetera')
    ) || [];

    // SOLO las del usuario logueado
    const transactions = todas.filter(
        tx => tx.owner === usuario.email
    );

    // Mostrar inicial
    mostrarUltimosMovimientos('todos');

    // Cambio de filtro
    $('#filterType').on('change', function () {
        const filtro = $(this).val();
        mostrarUltimosMovimientos(filtro);
    });

    // --------------------
    // Funciones
    // --------------------

    function mostrarUltimosMovimientos(filtro) {
        $list.empty();

        let filtradas = transactions;

        if (filtro !== 'todos') {
            filtradas = transactions.filter(tx => tx.type === filtro);
        }

        if (filtradas.length === 0) {
            $list.append(`
                <li class="list-group-item text-muted text-center">
                    No hay movimientos para este filtro.
                </li>
            `);
            return;
        }

        filtradas
            .slice()
            .reverse()
            .forEach(renderTransaction);
    }

    function renderTransaction(tx) {
        const esIngreso = tx.type === 'deposito' || tx.type === 'recepcion';
        const sign = esIngreso ? '+' : '−';
        const color = esIngreso ? 'text-success' : 'text-danger';

        $list.append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    ${getBadge(tx)}
                    <br>
                    <small class="text-muted">
                        ${new Date(tx.date).toLocaleString('es-CL')}
                    </small>
                </div>

                <span class="fw-semibold ${color}">
                    ${sign}$${tx.amount.toLocaleString('es-CL')}
                </span>
            </li>
        `);
    }

    function getTipoTransaccion(tx) {
        switch (tx.type) {
            case 'deposito':
                return 'Depósito';
            case 'retiro':
                return 'Retiro';
            case 'envio':
                return `Transferencia enviada a ${tx.to}`;
            case 'recepcion':
                return `Transferencia recibida de ${tx.from}`;
            default:
                return 'Movimiento';
        }
    }

    function getBadge(tx) {
        switch (tx.type) {
            case 'deposito':
                return `<span class="badge badge-deposito">Depósito</span>`;
            case 'retiro':
                return `<span class="badge badge-retiro">Retiro</span>`;
            case 'envio':
                return `<span class="badge badge-envio">Envío</span>`;
            case 'recepcion':
                return `<span class="badge badge-recepcion">Recepción</span>`;
        }
    }
    
});
