exports.up = function(knex) {
	return knex.schema.createTable('notes', tbl => {
		tbl.increments('note_id');
		tbl.integer('user_id').unsigned().notNullable();
		tbl.integer('project_id').unsigned().notNullable();
		tbl.integer('task_id').unsigned().notNullable();
		tbl.string('title', 1000).notNullable();
		tbl.timestamp('start_time').notNullable();
		tbl.timestamp('end_time').notNullable();
		tbl.string('tags', 1000);
		tbl.text('description').notNullable();
		tbl.decimal('hours').notNullable().defaultTo(0);
		tbl.boolean('pinned').defaultTo(false);
		tbl.timestamp('created_at').defaultTo(knex.fn.now());
		tbl.timestamp('updated_at').defaultTo(knex.fn.now());

		tbl.foreign('user_id').references('users.user_id').onDelete('CASCADE');
		tbl
			.foreign('project_id')
			.references('projects.project_id')
			.onDelete('CASCADE');
		tbl.foreign('task_id').references('tasks.task_id').onDelete('CASCADE');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('notes');
};
