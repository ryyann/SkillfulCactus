var path = require('path');
var fs = require('fs');
var knex = require('knex')({
  client: 'postgres',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8',
    port: process.env.DB_PORT
    // ssl: {
    //   ca: fs.readFileSync(path.join(__dirname, '../certs/mysql') + '/cacert.pem'),
    //   cert: fs.readFileSync(path.join(__dirname, '../certs/mysql') + '/client-cert.pem'),
    //   key: fs.readFileSync(path.join(__dirname, '../certs/mysql') + '/client-key.pem')
    // }
  }, debug: false
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (users) {
      users.increments('id').primary();
      users.string('email');
      users.string('password');
      users.string('first_name');
      users.string('last_name');
      users.integer('admin_level');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users_groups').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_groups', function (users_groups) {
      users_groups.increments('id').primary();
      users_groups.integer('user_id').references('id').inTable('users');
      users_groups.string('group_id').references('id').inTable('groups');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('groups').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('groups', function (groups) {
      groups.increments('id').primary();
      groups.integer('owner_id').references('id').inTable('users');
      groups.integer('parent_id');
      groups.json('children');
      groups.string('name');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('polls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('organizations', function (polls) {
      polls.increments('id').primary();
      polls.integer('election_id').references('id').inTable('elections');
      polls.integer('group_id').references('id').inTable('groups');
      polls.string('name');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('questions').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('questions', function (questions) {
      questions.increments('id').primary();
      questions.integer('poll_id').references('id').inTable('polls');
      questions.string('name');
      questions.text('description');
      questions.text('options');
      questions.json('count_strategy');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('elections').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('elections', function (elections) {
      elections.increments('id').primary();
      elections.integer('owner_id').references('id').inTable('users');
      elections.string('name');
      elections.time('start');
      elections.time('end');
      elections.boolean('timed');
      elections.boolean('accepting_votes');
      elections.boolean('locked');
      elections.json('privacy_strategy');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('ballots').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('ballots', function (ballots) {
      ballots.increments('id').primary();
      ballots.integer('election_id').references('id').inTable('elections');
      ballots.integer('user_id').references('id').inTable('users');
      ballots.json('choices');
      ballots.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users_elections').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_elections', function (users_elections) {
      users_elections.increments('id').primary();
      users_elections.integer('user_id').references('id').inTable('users');
      users_elections.integer('election_id').references('id').inTable('elections');
      users_elections.boolean('participated');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('results').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('results', function (results) {
      results.increments('id').primary();
      results.integer('election_id').references('id').inTable('elections');
      results.text('results');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('sessions').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('sessions', function (session) {
    session.integer('id').primary();
    session.string('sid').unique();
    session.string('data');
    session.timestamps();
  }).then(function (table) {
    console.log('Created Table', table);
    });
  }
});

// To do - 2fa

module.exports = db;



