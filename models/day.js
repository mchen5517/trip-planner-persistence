/* eslint-disable camelcase */
var Sequelize = require('sequelize');
var db = require('./_db');

var Day = db.define('day', {
  number: Sequelize.INTEGER
}, {
  getterMethods: {
    type: function () {
      return 'day';
    }
  },
  hooks: {
    afterCreate: function(user, options, fn){
      Day.max('number')
      .then(function(maxNum){
        return user.update({ number: ((maxNum + 1) || 1)});
      })
    }
  }
});

module.exports = Day;