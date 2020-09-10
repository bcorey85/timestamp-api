exports.up = function(knex) {
	knex.raw('create extension if not exists "uuid-ossp"');
	return knex.schema.createTable('users', tbl => {
		tbl.increments('user_id');
		tbl.string('email', 320).notNullable();
		tbl.string('password', 60).notNullable();
		tbl.timestamp('created_at').defaultTo(knex.fn.now());
		tbl.timestamp('updated_at').defaultTo(knex.fn.now());
		tbl.timestamp('last_login').defaultTo(knex.fn.now());
		tbl.uuid('public_user_id').defaultTo(knex.raw('uuid_generate_v4()'));
		tbl.string('password_reset_link', 100);
		tbl.timestamp('password_reset_expires');
		tbl.unique([ 'email' ]);
	});
};

exports.down = function(knex) {
	knex.raw('drop extension if exists "uuid-ossp"');
	return knex.schema.dropTableIfExists('users');
};
