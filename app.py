import sqlite3
from flask import Flask, render_template, g, jsonify

# --Configuration
app = Flask(__name__)
DATABASE = 'instance/creditos.db' # Route to the database file

# --Database connection

# Obtain a database connection
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # To return rows as dictionaries
    return db


# Close the database connection at the end of the request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# --DB Initialization

# Initialize the database with the schema
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# initialize the database with flask init-db command
@app.cli.command('init-db')
def init_db_command():
    """Initialize the database."""
    init_db()
    print('Initialized the database.')

# --Routes
@app.route('/')
def index():
    return render_template('index.html')

# API route to get all credits
@app.route('/api/creditos', methods=['GET'])
def get_creditos():
    db = get_db()
    cursor = db.execute('SELECT * FROM creditos ORDER BY id DESC')
    lista_creditos = [dict(row) for row in cursor.fetchall()]
    return jsonify(lista_creditos)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
