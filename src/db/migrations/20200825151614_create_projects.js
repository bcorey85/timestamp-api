exports.up = function(knex) {
	return knex.schema.createTable('projects', tbl => {
		tbl.increments('project_id');
		tbl.integer('user_id').unsigned().notNullable();
		tbl.string('title', 1000).notNullable();
		tbl.text('description').notNullable();
		tbl.boolean('pinned').defaultTo(false);
		tbl.decimal('hours').notNullable().defaultTo(0);
		tbl.integer('tasks').notNullable().defaultTo(0);
		tbl.integer('notes').notNullable().defaultTo(0);
		tbl.timestamp('created_at').defaultTo(knex.fn.now());
		tbl.timestamp('updated_at').defaultTo(knex.fn.now());

		tbl.foreign('user_id').references('users.user_id').onDelete('CASCADE');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('projects');
};
