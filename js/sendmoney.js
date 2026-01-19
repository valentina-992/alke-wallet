// ENVÍO DE DINERO

// Auntenticación
requireAuth();

$(document).ready(function () {

    // Partir sin contactos seleccionados
    let selectedContact = null;

    // Iniciar con botón de envío oculto
    $('#btnSendMoney').hide();

    let contactos = JSON.parse(localStorage.getItem('contactos')) || [];

    // Abrir - cerrar formulario de contactos
    $('#btnOpenForm').on('click', function () {
        $('#formNewContact').removeClass('d-none');
    });

    $('#btnCloseForm').on('click', function () {
        $('#formNewContact').addClass('d-none');
    });

    // Guardar contacto
    function saveContact(contacto) {
        const existe = contactos.some(c =>
            c.cbu === contacto.cbu || c.alias === contacto.alias
        );

        if (existe) {
            showAlert({
                type: 'danger',
                message: 'Este contacto ya existe'
            });
            return false;
        }

        contactos.push(contacto);
        localStorage.setItem('contactos', JSON.stringify(contactos));
        return true;
    }

    // Renderizar contacto
    function renderContact(contacto) {
        const $li = $(`
            <li class="list-group-item cursor-pointer">
                ${contacto.name} CBU: ${contacto.cbu}, Alias: ${contacto.alias}, Banco: ${contacto.bank}
            </li>
            `);

            $li.on('click', function () {
                $('#contactos li').removeClass('active');
                $(this).addClass('active');
                selectedContact = contacto;

                $('#btnSendMoney').fadeIn();
            });

            $('#contactos').append($li);
    }

    // Renderizar lista completa
    function renderContactList(lista) {
        const $ul = $('#contactos');
        $ul.empty();

        selectedContact = null;
        $('#btnSendMoney').hide();
    
        if (lista.length === 0) {
            $ul.append(`
                <li class="list-group-item text-muted text-center">
                    No se encontraron contactos.
                </li>
            `);
            return;
        }
    
        lista.forEach(renderContact);
    }


    // Búsqueda de contactos (lista con autocomplete)
    const $autocomplete = $('#autocompleteList');

    $('#searchContact').on('input', function () {
        const query = $(this).val().toLowerCase().trim();
        $autocomplete.empty();

        if (!query) {
            $autocomplete.addClass('d-none');
            renderContactList(contactos);
            return;
        }

        const matches = contactos.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.alias.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            $autocomplete.addClass('d-none');
            renderContactList([]);
            return;
        }

        matches.forEach(contacto => {
            const $item = $(`
                <li class="list-group-item list-group-item-action">
                    <strong>${contacto.name}</strong><br>
                    <small class="text-muted">${contacto.alias} · ${contacto.bank}</small>
                </li>
            `);

            $item.on('click', function () {
                selectContact(contacto);
                $('#searchContact').val(contacto.name);
                $autocomplete.addClass('d-none');
            });

            $autocomplete.append($item);
        });

        $autocomplete.removeClass('d-none');
        renderContactList(matches);
    });

    // Seleccionar contacto
    function selectContact(contacto) {
        selectedContact = contacto;

        $('#contactos li').removeClass('active');

        $('#contactos li').filter(function () {
            return $(this).text().includes(contacto.cbu);
        }).addClass('active');

        $('#btnSendMoney').fadeIn();
    }

    // Cerrar la lista de autocomplete al hacer click en otra parte
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#searchContact, #autocompleteList').length) {
            $autocomplete.addClass('d-none');
        }
    });


    // Agregar contacto
    $('#addContact').on('click', function (event) {
        event.preventDefault();

        if (
            !$('#nombreApellido').val().trim() ||
            !$('#CBU').val().trim() ||
            !$('#alias').val().trim() ||
            !$('#banco').val().trim()
        ) {
            showAlert({
                type: 'danger',
                message: 'Completa todos los campos del contacto.'
            });
            return;
        }

        const cbu = $('#CBU').val().trim();
    
        if (!/^\d{9}$/.test(cbu)) { // Determinar formato del CBU
            showAlert({
                type: 'danger',
                message: 'El CBU debe contener exactamente 9 dígitos numéricos.'
            });
            return;
        }
    
        const contacto = {
            name: $('#nombreApellido').val(),
            cbu: cbu,
            alias: $('#alias').val(),
            bank: $('#banco').val()
        };
    
        if (!saveContact(contacto)) return;
    
        renderContact(contacto);
    
        $('#nombreApellido, #CBU, #alias, #banco').val('');
        $('#formNewContact').addClass('d-none');
    });

    renderContactList(contactos);


    // Enviar dinero
    $('#sendMoneyForm').on('submit', function (event) {
        event.preventDefault();
    
        // Obtener monto a enviar
        const amount = Number($('#amountToSend').val()); 
    
        // Caso: no hay contacto seleccionado
        if (!selectedContact) {
            showAlert({ type: 'danger', message: 'Selecciona un contacto.' });
            return;
        }
    
        // No hay monto o es menor o igual a cero
        if (!amount || amount <= 0) {
            showAlert({ type: 'danger', message: 'Monto inválido.' });
            return;
        }
    
        // Determinar usuario que envía y ususario que recibe
        const emisor = getUsuarioActual();
        const receptor = getUsuarioByCBU(selectedContact.cbu);
    
        // Caso: Contacto que no está registrado como usuario
        if (!receptor) {
            showAlert({
                type: 'warning',
                message: 'Este contacto no corresponde a un usuario registrado.'
            });
            return;
        }
    
        // Caso: Monto de envío mayor al disponible
        if (amount > emisor.saldo) {
            showAlert({ type: 'danger', message: 'Saldo insuficiente.' });
            return;
        }
    
        // Transferencia real
        emisor.saldo -= amount;
        receptor.saldo += amount;
    
        updateUsuario(emisor);
        updateUsuario(receptor);
    
        saveTransaction({
            type: 'envío',
            from: emisor.email,
            to: receptor.email,
            amount,
            date: new Date().toISOString()
        });
    
        showSendFeedback(`Enviaste $${amount.toLocaleString('es-CL')} a ${selectedContact.name}`);
    
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
    });

    // Función para el feedback
    function showSendFeedback(message) {
        $('#send-feedback').html(`
            <div class="alert alert-success text-center fade show" role="alert">
                ${message}
            </div>
        `);
    }

});