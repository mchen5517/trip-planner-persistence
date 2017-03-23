/* eslint-disable camelcase */
var Sequelize = require('sequelize');
var Promise = require('bluebird')
var db = require('./_db');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');

var Day = db.define('day', {
    number: Sequelize.INTEGER
}, {
    getterMethods: {
        type: function() {
            return 'day';
        }
        // ,
        // attractions: function () {
        //   return Promise.all([this.getRestaurant(), this.getActivity()])
        //   .spread(function(restaurants, activities ){
        //     return {restaurants: restaurants, activities: activities}
        //   })
        // }
    },
    hooks: {
        afterDestroy: function(day, options, fn) {
            Day.findAll({
                    where: ['number > ?', day.number]
                })
                .then(function(days) {
                    days.forEach(function(day) {
                        day.decrement('number');
                        day.save();
                    })
                })
        }
    },
    classMethods: {
        getAllDays: function() {
            return Day.findAll({
                    include: [Hotel, Restaurant, Activity],
                    order: 'number ASC'

                })
                .then(function(days) {
                    // console.log(day.get({
                    //     plain: true
                    // })); // woah it has a .hotel property
                    return days
                });
        }
    }
});

// Day.hook('Destroy', function(day, options, fn){
//   console.log("????:", day);
// });

module.exports = Day;
