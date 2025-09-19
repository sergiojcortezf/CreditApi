# Gestor de Créditos - CreditApi

Aplicación web full-stack que permite gestionar créditos (crear, leer, actualizar y eliminar) y visualizar un resumen financiero a través de una gráfica.

## Descripción Técnica

La aplicación está construida con un backend en Python utilizando el micro-framework **Flask**, que sirve una API RESTful para gestionar los datos. La información se persiste en una base de datos **SQLite**. El frontend es una aplicación de página única (SPA) creada con **JavaScript** puro (vanilla JS), HTML5 y CSS3, que consume la API para ofrecer una experiencia de usuario dinámica. La visualización de datos se realiza con la librería **Chart.js**.

---

## Tecnologías Utilizadas

- **Backend:** Python, Flask
- **Base de Datos:** SQLite
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Visualización:** Chart.js
- **Herramientas:** Git, venv

---

## Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- Tener instalado [Git](https://git-scm.com/).
- Tener instalado [Python](https://www.python.org/) 3.8 o superior.

### Pasos

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/sergiojcortezf/CreditApi.git
    cd CreditApi
    ```

2.  **Crear y activar un entorno virtual:**

    ```bash
    # Crear el entorno
    python -m venv venv

    # Activar en Windows (Git Bash)
    source venv/Scripts/activate

    # Activar en macOS/Linux
    source venv/bin/activate
    ```

3.  **Instalar las dependencias:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Inicializar la base de datos:**
    Este comando creará el archivo `creditos.db` con la tabla necesaria.

    ```bash
    flask init-db
    ```

5.  **Ejecutar la aplicación:**
    ```bash
    flask --app app --debug run
    ```
    La aplicación estará disponible en `http://127.0.0.1:5000`.

---

## Mejoras Futuras y Consideraciones

Esta implementación cumple con todos los requisitos básicos. Sin embargo, para una aplicación a nivel de producción, se podrían considerar las siguientes mejoras:

- **Soporte para Actualizaciones Parciales (PATCH):** Implementar un endpoint `PATCH` para permitir la actualización de campos específicos de un crédito sin necesidad de enviar el objeto completo.
- **Pruebas Unitarias y de Integración:** Desarrollar una suite de pruebas con `pytest` para garantizar la fiabilidad y estabilidad del backend ante futuros cambios.
- **Tipos de Datos Precisos:** Migrar los tipos de datos monetarios (`monto`, `tasa_interes`) de `REAL` a `DECIMAL` en la base de datos para evitar posibles problemas de precisión con números de punto flotante.
- **Refactorización del Frontend:**
  - **CSS:** Utilizar variables CSS para unificar colores y espaciados, mejorando la mantenibilidad.
- **Validación Avanzada:** Implementar validaciones más robustas tanto en el frontend (con JavaScript) como en el backend para asegurar la integridad de los datos.
