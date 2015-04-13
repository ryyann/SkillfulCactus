/**
 * User Endpoint Controller
 */

'use strict';

var User = require('../../database/models/user');

var Users = {
  create: function(req, res) {
    var userData = req.body.user;
    var newUser = User.forge({
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      admin_level: 0
    });

    User.forge({email: userData.email})
        .fetch()
        .then(function(possibleExistingUser){
          if (possibleExistingUser) res.status(409).send('User with that e-mail already exists.'); //e-mail must be unique
          newUser.save()
                  .then(function(user){
                    res.status(201).send('User created.'); // return the new user's attributes
                  });
        });
  }
};

module.exports = Users;

    // db.knex.schema.createTable('users', function (users) {
    //   users.increments('id').primary();
    //   users.string('email');
    //   users.string('password');
    //   users.string('first_name');
    //   users.string('last_name');
    //   users.integer('admin_level');
    //   users.timestamps();
    // }).then(function (table) {
    //   console.log('Created Table', table);