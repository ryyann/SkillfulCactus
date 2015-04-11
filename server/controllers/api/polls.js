/**
 * Polls API Controller
 */

'use strict'

var Poll = require('../../database/models/poll');

var polls = {
	
	create: function ( req, res ) {
		if ( req.body.poll ) {
      var data = req.body.poll;
      console.log(data);
      var poll = new Poll({
        name: data.name,
        election_id: data.election_id,
        group_id: data.group_id
      }).save()
      .then(function(model){
        res.status(201);
        res.json({
          id: model.get('id'),
          name: model.get('name'),
          created_at: model.get('created_at')
        });
        res.end();
      }).error(function(error){
        res.status(500);
        console.error(error);
        res.end();
      });
    } else {
      res.status(400);
      res.end('Bad request');
    }
	},

	adminGetById: function ( id, req, res ) {

	},
	
	updateById: function ( id, req, res ) {

	}

}

module.exports = polls;