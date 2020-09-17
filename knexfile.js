// Update with your config settings.
const { FsMigrations } = require('knex/lib/migrate/sources/fs-migrations');

module.exports = {
	development: {
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'postgres',
			password: 'password',
			database: 'timestamp-dev'
		},
		migrations: {
			directory: './src/db/migrations'
		},
		seeds: {
			directory: './src/db/seeds'
		}
	},
	test: {
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'postgres',
			password: 'password',
			database: 'timestamp-dev-test'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			// directory: './src/db/migrations'
			migrationSource: new FsMigrations('./src/db/migrations', false)
		},
		seeds: {
			directory: './src/db/seeds'
		}
	},

	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './src/db/migrations'
		}
	}
};
