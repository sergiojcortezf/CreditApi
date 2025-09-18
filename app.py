import sqlite3
from flask import Flask, render_template, g, jsonify, request

# --Configuracion
app = Flask(__name__)
DATABASE = 'instance/creditos.db' # Ruta a la base de datos SQLite

# --Conexion a la DB

# Obtener una conexión a la base de datos
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # Para devolver filas como diccionarios
    return db


# Cerrar la conexión a la base de datos al final de la solicitud
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# --Inicializar la DB

# Inicializar la base de datos con el esquema
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# inicializar la base de datos con el comando flask init-db
@app.cli.command('init-db')
def init_db_command():
    """Initialize the database."""
    init_db()
    print('Initialized the database.')

# --Rutas
@app.route('/')
def index():
    return render_template('index.html')

# Ruta API para obtener la lista de créditos
@app.route('/api/creditos', methods=['GET'])
def get_creditos():
    db = get_db()
    cursor = db.execute('SELECT * FROM creditos ORDER BY id DESC')
    lista_creditos = [dict(row) for row in cursor.fetchall()]
    return jsonify(lista_creditos)

# Ruta API para registrar un nuevo crédito
@app.route('/api/creditos', methods=['POST'])
def add_credito():
    # Obtener datos de la solicitud
    datos_credito = request.get_json()

    # Extraer campos individuales
    cliente = datos_credito['cliente']
    monto = datos_credito['monto']
    tasa_interes = datos_credito['tasa_interes']
    plazo = datos_credito['plazo']
    fecha_otorgamiento = datos_credito['fecha_otorgamiento']

    # Conectar a la base de datos e insertar el nuevo crédito
    db = get_db()
    cursor= db.execute('INSERT INTO creditos (cliente, monto, tasa_interes, plazo, fecha_otorgamiento) VALUES (?, ?, ?, ?, ?)',
               (cliente, monto, tasa_interes, plazo, fecha_otorgamiento))
    db.commit() # Guardar cambios

    return jsonify({'id': cursor.lastrowid, 'mensaje': 'Crédito registrado exitosamente'}), 201

# --Ejecutar la app
if __name__ == '__main__':
    app.run(debug=True)
