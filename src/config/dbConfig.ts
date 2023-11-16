import sql from 'mssql';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const getKeyFromFile = (DB_PASSWORD: string) => {
  try {
    return fs.readFileSync(process.env.DB_PASSWORD as string).toString();
  } catch (e) {
    throw new Error(`Error while reading key: ${DB_PASSWORD}`);
  }
};

export const dbConfig: sql.config = {
  user: process.env.DB_USERNAME as string,
  password: getKeyFromFile(process.env.DB_PASSWORD as string),
  server: process.env.DB_HOST as string,
  port: +parseInt(process.env.DB_PORT as string),
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use this option if you're on Windows Azure
    enableArithAbort: true, // Required to avoid SQL server errors
    trustServerCertificate: true,
  },
  pool: {
    max: 200, // Maximum number of connections
    min: 2, // Minimum number of connections
    idleTimeoutMillis: 30000, // How long a connection is allowed to stay idle
  },
};

export default dbConfig;
