exports.up = function(knex) {
	return knex.schema.createTable('users', tbl => {
		tbl.increments('user_id');
		tbl.string('email', 320).notNullable();
		tbl.string('password', 60).notNullable();
		tbl.timestamp('created_at').defaultTo(knex.fn.now());
		tbl.timestamp('updated_at').defaultTo(knex.fn.now());
		tbl.timestamp('last_login').defaultTo(knex.fn.now());
		tbl.string('password_reset_link', 100);
		tbl.timestamp('password_reset_expires');
		tbl.unique([ 'email' ]);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('users');
};
