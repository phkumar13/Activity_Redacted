import sql from 'mssql';
import dbConfig from '../config/dbConfig';
import { logInfo, logError } from '../logger';

// declaring variables
let pool: any;
let results: any;

// initiating azure sql connection
const setConnection = () => {
  pool = new sql.ConnectionPool(dbConfig);
};

const dbOperation = async (sqlQuery: string) => {
  logInfo('>>>>>>>> azureSQL >>>>>>> - sqlQuery ', sqlQuery);
  setConnection();
  let connection;
  try {
    connection = await pool.connect();
    results = await connection.request().query(sqlQuery);
    logInfo('>>>>>>>> azureSQL >>>>>>> - Query Results >> ', results);
  } catch (err: any) {
    logError(err, 'SQL query error');
  } finally {
    if (connection) {
      connection.close();
    }
  }
  return results;
};

// insert record in the db
export const insertRecord = (sqlQuery: string) => {
  return dbOperation(sqlQuery);
};

// get record from the db
export const getRecord = (sqlQuery: string) => {
  return dbOperation(sqlQuery);
};

// update record in the db
export const updateRecord = (sqlQuery: string) => {
  return dbOperation(sqlQuery);
};
