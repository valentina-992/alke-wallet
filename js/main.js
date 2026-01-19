// Constantes
const TRANSACTIONS_KEY = "transacciones_billetera";

// Guardar transacciones
function saveTransaction(tx) {
    const txs = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY)) || [];
    txs.push(tx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
 }

 // Función para generar alertas
 function showAlert({ type, title = '', message, dismissible = true }) {
    const closeBtn = dismissible
        ? `<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`
        : '';

    const heading = title
        ? `<h4 class="alert-heading">${title}</h4>`
        : '';

    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
            ${heading}
            <p>${message}</p>
            ${closeBtn}
        </div>
    `;

    $('#alert-container').html(alertHTML);
 }



 // Usuarios (oobtener y guardar)
function getUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function saveUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Generar CBU único (9 dígitos)
function generarCBU() {
    let cbu;
    const usuarios = getUsuarios();

    do {
        cbu = Math.floor(100000000 + Math.random() * 900000000).toString();
    } while (usuarios.some(u => u.cbu === cbu));

    return cbu;
}

// Registrar usuario
function registrarUsuario(nombre, email, password) {
    const usuarios = getUsuarios();

    if (usuarios.some(u => u.email === email)) {
        return { ok: false, msg: 'El email ya está registrado.' };
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        email,
        password,
        cbu: generarCBU(),
        alias: email.split('@')[0] + '.wallet',
        saldo: 0,
        createdAt: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    saveUsuarios(usuarios);

    return { ok: true, cbu: nuevoUsuario.cbu };
}

// Sesión
function loginUsuario(email, password) {
    const usuarios = getUsuarios();

    const usuario = usuarios.find(
        u => u.email === email && u.password === password
    );

    if (!usuario) return false;

    localStorage.setItem('usuarioLogueado', usuario.id);
    return true;
}

function logoutUsuario() {
    localStorage.removeItem('usuarioLogueado');
}

function getUsuarioActual() {
    const id = Number(localStorage.getItem('usuarioLogueado'));
    if (!id) return null;

    const usuarios = getUsuarios();
    return usuarios.find(u => u.id === id) || null;
}

function updateUsuario(usuarioActualizado) {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.id === usuarioActualizado.id);
    usuarios[index] = usuarioActualizado;
    saveUsuarios(usuarios);
}

function getUsuarioByCBU(cbu) {
    const usuarios = getUsuarios();
    return usuarios.find(u => u.cbu === cbu) || null;
}


// Protección de páginas (auntenticación)
function requireAuth() {
    if (!getUsuarioActual()) {
        window.location.href = 'login.html';
    }
}

