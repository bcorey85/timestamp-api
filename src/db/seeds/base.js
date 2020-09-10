const bcrypt = require('bcryptjs');

exports.seed = async knex => {
	await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
	await knex.raw('TRUNCATE TABLE projects RESTART IDENTITY CASCADE');
	await knex.raw('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE');
	await knex.raw('TRUNCATE TABLE notes RESTART IDENTITY CASCADE');

	await knex('users').insert([
		{ email: 'bcorey85@gmail.com', password: bcrypt.hashSync('111111') }
	]);

	await knex('projects').insert([
		{
			title: 'project 1',
			user_id: '1',
			description: 'This is project 1',
			pinned: true,
			tasks: 2,
			notes: 2
		},
		{
			title: 'project 2',
			user_id: '1',
			description: 'This is project 2',
			pinned: true,
			tasks: 0,
			notes: 0
		},
		{
			title: 'project 3',
			user_id: '1',
			description: 'This is project 3',
			pinned: false,
			tasks: 1,
			notes: 1
		}
	]);

	await knex('tasks').insert([
		{
			title: 'task 1',
			user_id: '1',
			project_id: '1',
			tags: '#tag1#tag2#tag3',
			description: 'This is project 1',
			pinned: true,
			notes: 1
		},
		{
			title: 'task 2',
			user_id: '1',
			project_id: '1',
			tags: '#tag1#tag2#tag3',
			description: 'This is project 2',
			pinned: true,
			notes: 1
		},
		{
			title: 'task 3',
			user_id: '1',
			project_id: '3',
			tags: '#tag1#tag2#tag3',
			description: 'This is project 3',
			pinned: false,
			notes: 1
		}
	]);

	const start1 = new Date('08/25/2020 14:00:00');
	const start2 = new Date('08/24/2020 14:00:00');
	const start3 = new Date('08/23/2020 14:00:00');
	const end = new Date(Date.now());

	const getHours = (startDate, endDate) => {
		return (Math.abs(startDate.getTime() - endDate.getTime()) /
			3600000).toFixed(2);
	};

	await knex('notes').insert([
		{
			title: 'note 1',
			user_id: '1',
			project_id: '1',
			task_id: '1',
			start_time: start1.toISOString(),
			end_time: end.toISOString(),
			hours: getHours(start1, end),
			tags: '#tag1#tag2#tag3',
			description: 'This is project 1',
			pinned: true
		},
		{
			title: 'note 2',
			user_id: '1',
			project_id: '1',
			task_id: '2',
			start_time: start2.toISOString(),
			end_time: end.toISOString(),
			hours: getHours(start2, end),
			tags: '#tag1#tag2#tag3',
			description: 'This is project 2',
			pinned: true
		},
		{
			title: 'note 3',
			user_id: '1',
			project_id: '3',
			task_id: '1',
			start_time: start3.toISOString(),
			end_time: end.toISOString(),
			hours: getHours(start3, end),
			tags: '#tag1#tag2#tag3',
			description: 'This is project 3',
			pinned: false
		}
	]);
};
