
var dataModule = (function () {

  var publicAPI = {

    hotelsPromise: $.ajax({
      method: 'GET',
      url: '/api/hotels'
    }),

    restaurantsPromise: $.ajax({
      method: 'GET',
      url: '/api/restaurants'
    }),

    activitiesPromise: $.ajax({
      method: 'GET',
      url: '/api/activities'
    })

  };

  return publicAPI;

}());
