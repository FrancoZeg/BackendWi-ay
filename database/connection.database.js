// database/connection.database.js
import pkg from 'pg';
const { Pool } = pkg;

// Render te da DATABASE_URL en las variables de entorno
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render necesita SSL
});

// Probar conexión al arrancar
db.connect()
  .then(() => console.log('✅ Conexión exitosa a PostgreSQL'))
  .catch((err) => console.error('❌ Error de conexión a PostgreSQL:', err.message));
