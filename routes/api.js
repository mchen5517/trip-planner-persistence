var Promise = require('bluebird');
var db = require('../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Day = db.model('day');
var router = require('express').Router();

router.get('/hotels', function (req, res, next) {
  Hotel.findAll()
  .then(function (allHotels) {
    res.json(allHotels)
  })
  .catch(next);
});

router.get('/restaurants', function (req, res, next) {
  Restaurant.findAll()
  .then(function (allRestaurants) {
    res.json(allRestaurants)
  })
  .catch(next);
});

router.get('/activities', function (req, res, next) {
  Activity.findAll()
  .then(function (allActivities) {
    res.json(allActivities)
  })
  .catch(next);
});

router.get('/api/attractions', function(req, res, next){
  Promise.all([
    Hotel.findAll(),
    Restaurant.findAll(),
    Activity.findAll()
    ])
  .spread(function(dbHotels, dbRestaurants, dbActivities) {
    res.json({
      hotels: dbHotels,
      restaurants: dbRestaurants,
      activities: dbActivities
    });
  })
  .catch(next);
})

router.get('/hotels', function(req, res, next){
  Hotel.findAll()
  .then(function(hotels){
    res.json(hotels);
  })
  .catch(next);
});

router.get('/restaurants', function(req, res, next){
  Restaurant.findAll()
  .then(function(restaurants){
    res.json(restaurants);
  })
  .catch(next);
});

router.get('/activities', function(req, res, next){
  Activity.findAll()
  .then(function(activities){
    res.json(activities);
  })
  .catch(next);
});

router.get('/days', function(req, res, next){
  // Day.findAll()
  // .then(function(days){
  //   console.log("GOT ALL DAYS");
  //   res.json(days);
  // })
  // .catch(next);
  Day.getAllDays()
  .then(function(days){
    //console.log(days)
    console.log('rest', days[0].restaurants)
    res.json(days)
  })
  .catch(next)
})

router.get('/days/:number', function(req, res, next){
  Day.findOne({where: {number: req.params.number}})
  .then(function(foundDay){
    console.log("FOUND A DAY");
    res.json(foundDay);
  })
  .catch(next);
})

router.get('/days/:number/attractions', function(req, res, next){
  Day.findOne({where: {number: req.params.number}})
  .then(function(foundDay){
    console.log('found day')
    return foundDay.attractions
  })
  .then(function(attractionLists){
    console.log('found attractions', attractionLists)
    res.json(attractionLists)
  })
  .catch(next);

})

router.delete('/days/:number', function(req, res, next){
  Day.destroy({where: {number: req.params.number}, individualHooks: true})
  .then(function(data){
    console.log("DELETED A DAY", data);
    res.json({});
  })
  .catch(next);
});

router.delete('/days/:number/hotel/:hotelId', function(req, res, next){
  Day.update({hotelId: null}, {where: {number: req.params.number}})
  .then(function(updatedDay){
    res.status(204).send();
  })
  .catch(next);
});
//

router.delete('/days/:number/restaurant/:restId', function(req, res, next){

  Day.findOne({where: {number: req.params.number}, include: [Restaurant]})
    //Restaurant.findById(req.params.restId)
  .then(function(day){
    return [day.getRestaurants(), day];
  })
  .spread(function(restaurants, day){
    for (var r = 0; r < restaurants.length; r++){
      if (restaurants[r].id === parseInt(req.params.restId)){
        restaurants.splice(r, 1)
        break;
      }
    }
    return day.setRestaurants(restaurants)
  })
  .then(function(){
    res.sendStatus(204)
  })
  .catch(next);
});

router.delete('/days/:number/activity/:actId', function(req, res, next){
  Day.findOne({where: {number: req.params.number}, include: [Activity]})
    //Activity.findById(req.params.restId)
  .then(function(day){
    return [day.getActivities(), day];
  })
  .spread(function(activities, day){
    for (var a = 0; a < activities.length; a++){
      if (activities[a].id === parseInt(req.params.actId)){
        activities.splice(a, 1)
        break;
      }
    }
    return day.setActivities(activities)
  })
  .then(function(){
    res.sendStatus(204)
  })
  .catch(next);
});

router.post('/days/', function(req, res, next){
  Day.create(req.body)
  .then(function(createdDay){
    console.log("CREATED A DAY");
    res.json(createdDay);
  })
  .catch(next);
});

router.post('/days/:number/hotel/:hotelId', function(req, res, next){
  Day.update({hotelId: req.params.hotelId}, {where: {number: req.params.number}})
  .then(function(updatedDays){
    res.status(204).send();
  })
  .catch(next);
});
//

router.post('/days/:number/restaurant/:restId', function(req, res, next){
  Promise.all([
    Day.findOne({where: {number: req.params.number}}),
    Restaurant.findById(req.params.restId)
  ])
  .spread(function(day, restaurant){
    return day.addRestaurant(restaurant);
  })
  .then(function(){
    res.sendStatus(204)
  })
  .catch(next);
});

router.post('/days/:number/activity/:actId', function(req, res, next){
  Promise.all([
    Day.findOne({where: {number: req.params.number}}),
    Activity.findById(req.params.actId)
  ])
  .spread(function(day, activity){
    return day.addActivity(activity);
  })
  .then(function(){
    res.sendStatus(204)
  })
  .catch(next);
});


module.exports = router;
