document.addEventListener('DOMContentLoaded', () => {

    // -- SELECCIÓN DE ELEMENTOS --
    const creditosForm = document.getElementById('creditos-form');
    const creditosTbody = document.getElementById('creditos-tbody');

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

    // -- ASIGNAR EVENTOS --
    creditosForm.addEventListener('submit', addCredito);

    // -- INICIALIZAR LA CARGA DE CRÉDITOS --
    fetchCreditos();

});
