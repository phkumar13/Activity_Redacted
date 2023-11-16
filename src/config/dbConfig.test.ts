import { getKeyFromFile, dbConfig } from './dbConfig';
import dotenv from 'dotenv';
dotenv.config();
describe('load Secret from file', () => {
  test('reading non existing secret file throws error', () => {
    process.env.DB_PASSWORD = './secrets/sqlq-database-admin-password';
    expect(() => {
      getKeyFromFile(process.env.DB_PASSWORD as string);
    }).toThrowError();
  });
  test('reading existing secret file is successful', () => {
    process.env.DB_PASSWORD = './secrets/sql-database-admin-password';
    expect(getKeyFromFile(process.env.DB_PASSWORD)).toBe('TestPassword@1');
  });
  test('dbconfig to be called', () => {
    dbConfig.user = "test"
    dbConfig.password = "test"
    dbConfig.server = "test",
    dbConfig.port = 100,
    dbConfig.database= "test",
    dbConfig.options = {
      encrypt: true, // Use this option if you're on Windows Azure
      enableArithAbort: true, // Required to avoid SQL server errors
      trustServerCertificate: true,
    },
    dbConfig.pool = {
      max: 200, // Maximum number of connections
      min: 2, // Minimum number of connections
      idleTimeoutMillis: 30000, // How long a connection is allowed to stay idle
      }
    console.log(dbConfig);
  });
});
