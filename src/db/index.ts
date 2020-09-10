import knex from 'knex';
import pg from 'pg';

const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);

const config = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const connectionOptions = config[env];
const db = knex(connectionOptions);

export { db };
