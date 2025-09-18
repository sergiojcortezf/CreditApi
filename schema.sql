DROP TABLE IF EXISTS creditos;

CREATE TABLE creditos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    monto REAL NOT NULL,
    tasa_interes REAL NOT NULL, -- tasa de interés anual
    plazo INTEGER NOT NULL, -- plazo en meses
    fecha_otorgamiento TEXT NOT NULL -- formato YYYY-MM-DD
);