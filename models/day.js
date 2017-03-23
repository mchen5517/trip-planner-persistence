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
    afterDestroy: function(day, options, fn){
      Day.findAll({where: ['number > ?', day.number]})
      .then(function(days){
        days.forEach(function(day){
          day.decrement('number');
          day.save();
        })
      })
    }
  }
});

// Day.hook('Destroy', function(day, options, fn){
//   console.log("????:", day);
// });

module.exports = Day;