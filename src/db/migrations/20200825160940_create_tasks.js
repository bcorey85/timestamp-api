exports.up = function(knex) {
	return knex.schema.createTable('tasks', tbl => {
		tbl.increments('task_id');
		tbl.integer('user_id').unsigned().notNullable();
		tbl.integer('project_id').unsigned().notNullable();
		tbl.string('title', 1000).notNullable();
		tbl.string('tags', 1000);
		tbl.text('description');
		tbl.boolean('pinned').defaultTo(false);
		tbl.decimal('hours').notNullable().defaultTo(0);
		tbl.integer('notes').notNullable().defaultTo(0);
		tbl.timestamp('completed_on').defaultTo(null);
		tbl.string('completed_by');
		tbl.timestamp('created_at').defaultTo(knex.fn.now());
		tbl.timestamp('updated_at').defaultTo(knex.fn.now());

		tbl.foreign('user_id').references('users.user_id').onDelete('CASCADE');
		tbl
			.foreign('project_id')
			.references('projects.project_id')
			.onDelete('CASCADE');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('tasks');
};
