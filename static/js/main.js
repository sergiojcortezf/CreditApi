document.addEventListener('DOMContentLoaded', () => {

    // -- SELECCIÓN DE ELEMENTOS --
    const creditosForm = document.getElementById('creditos-form');
    const creditosTbody = document.getElementById('creditos-tbody');
    const creditoIdInput = document.getElementById('credito-id');
    const submitButton = document.querySelector('.btn-submit');
    const cancelButton = document.getElementById('cancel-edit');

    // -- URL DE LA API --
    const API_URL = '/api/creditos';

    // -- FUNCIÓN PARA RENDERIZAR LA TABLA DE CRÉDITOS --
    const renderCreditos = (creditos) => {
        // Limpiar el cuerpo de la tabla
        creditosTbody.innerHTML = '';

        // Si no hay créditos, mostrar un mensaje
        if (creditos.length === 0) {
            creditosTbody.innerHTML = '<tr><td colspan="7">No hay créditos registrados.</td></tr>';
            return;
        }

        // Recorrer los créditos y crear filas en la tabla
        creditos.forEach(credito => {
            const tr = document.createElement('tr');        
            tr.innerHTML = `
                <td>${credito.id}</td>
                <td>${credito.cliente}</td>
                <td>${credito.monto.toFixed(2)}</td>
                <td>${credito.tasa_interes.toFixed(2)}</td>
                <td>${credito.plazo}</td>
                <td>${credito.fecha_otorgamiento}</td>
                <td>
                    <button class="action-btn btn-edit" data-id="${credito.id}">Editar</button>
                    <button class="action-btn btn-delete" data-id="${credito.id}">Eliminar</button>
                </td>
            `;
            creditosTbody.appendChild(tr);
        });
    };

    // -- FUNCIÓN PARA CARGAR LOS CRÉDITOS DESDE LA API --
    const fetchCreditos = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar los créditos');
            const creditos = await response.json();
            renderCreditos(creditos);
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
            creditosTbody.innerHTML = '<tr><td colspan="7">Error al cargar los créditos.</td></tr>';
        }
    };

    // -- FUNCIÓN PARA AÑADIR UN NUEVO CRÉDITO --
    const addCredito = async (event) => {
        // Prevenir el envío del formulario
        event.preventDefault();

        // Obtener los datos del formulario
        const formData = new FormData(creditosForm);
        const creditoData = {
            cliente: formData.get('cliente'),
            monto: parseFloat(formData.get('monto')),
            tasa_interes: parseFloat(formData.get('tasa_interes')),
            plazo: parseInt(formData.get('plazo')),
            fecha_otorgamiento: formData.get('fecha_otorgamiento')
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creditoData)
            });
            if (!response.ok) throw new Error('Error al añadir el crédito');

            // Limpiar el formulario
            creditosForm.reset();

            // Recargar la lista de créditos
            fetchCreditos();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al añadir el crédito. Por favor, inténtelo de nuevo.');
        }
    };

    // -- FUNCIÓN PARA RESETAR EL FORMULARIO --
    const resetFormState = () => {
        creditosForm.reset();
        creditoIdInput.value = '';
        submitButton.textContent = 'Guardar Crédito';
        cancelButton.style.display = 'none';
    }

    // -- FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO --
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(creditosForm);
        const creditoData = {
            cliente: formData.get('cliente'),
            monto: parseFloat(formData.get('monto')),
            tasa_interes: parseFloat(formData.get('tasa_interes')),
            plazo: parseInt(formData.get('plazo')),
            fecha_otorgamiento: formData.get('fecha_otorgamiento')
        };

        const creditoId = creditoIdInput.value;
        const isEditing = !!creditoId; // Verificar si estamos en modo edición

        const url = isEditing ? `${API_URL}/${creditoId}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(creditoData)
            });
            if (!response.ok) throw new Error(isEditing ? 'Error al actualizar el crédito' : 'Error al guardar el crédito');

            resetFormState();
            fetchCreditos();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al guardar el crédito. Por favor, inténtelo de nuevo.');
        }
    };

    // -- FUNCIÓN PARA MANEJAR CLICS EN LA TABLA --
    const handleTableClick = async (event) => {
        const target = event.target; // Elemento que fue clickeado

        // -- LÓGICA PARA EL BOTÓN DE ELIMINAR --
        if (target.classList.contains('btn-delete')) {
            const creditoId = target.dataset.id; // Obtener el ID del crédito a eliminar

            if (confirm(`¿Está seguro de que desea eliminar el crédito con ID ${creditoId}?`)) {
                fetch(`${API_URL}/${creditoId}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) throw new Error('Error al eliminar el crédito');
                        fetchCreditos();
                    })
                    .catch(error => {
                        console.error('Error al eliminar el crédito:', error);
                        alert('Error al eliminar el crédito. Por favor, inténtelo de nuevo.');
                    });
            }
        }

        // -- LÓGICA PARA EL BOTÓN DE EDITAR --
        if (target.classList.contains('btn-edit')) {
            const row = target.closest('tr');

            creditoIdInput.value = row.children[0].textContent;
            document.getElementById('cliente').value = row.children[1].textContent;
            document.getElementById('monto').value = parseFloat(row.children[2].textContent);
            document.getElementById('tasa_interes').value = parseFloat(row.children[3].textContent);
            document.getElementById('plazo').value = parseInt(row.children[4].textContent);
            document.getElementById('fecha_otorgamiento').value = row.children[5].textContent;

            submitButton.textContent = 'Actualizar Crédito';
            cancelButton.style.display = 'inline-block';

            // Scrollear al formulario
            creditosForm.scrollIntoView({ behavior: 'smooth' });
        }

    };

    // -- ASIGNAR EVENTOS --
    creditosForm.addEventListener('submit', handleFormSubmit);
    creditosTbody.addEventListener('click', handleTableClick);
    cancelButton.addEventListener('click', resetFormState);

    // -- INICIALIZAR LA CARGA DE CRÉDITOS --
    fetchCreditos();

});
