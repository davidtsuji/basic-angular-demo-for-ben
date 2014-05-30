/**
 * Example 3rd party lib to demonstrate how an Angular SPA interacts
 * @description Will put a red box on the page
 */
var redBox = {
  show: function() {
    if ($('body .red-box').length) return;
    $('body').append('<div class="red-box" style="width: 100px; height: 100px; background-color: red"></div>');
  },
  destroy: function() {
    $('body .red-box').remove();
  }
}
Emitter(redBox);



/**
 * Controller Base Class
 * @description Not necessary but a good idea to extend all your controllers off it
 */
var Controller = klass({
  get: function() {
    this.scope = app.scope;
  }
});



/**
 * App Controllers
 * @description These controllers are raw js functions (except for the inheritence in this example)
 */
var MainController = Controller.extend({
  data: {
    title: 'MainController',
    content: 'the mainController has a red box'
  },
  get: function() {
    this.supr();
    redBox.show();
  }
});

var OneController = Controller.extend({
  data: {
    title: 'OneController',
    content: 'the oneController has **no** red box'
  },
  get: function() {
    this.supr();
    redBox.destroy();
  }
});

var TwoController = Controller.extend({
  data: {
    title: 'TwoController',
    content: 'the twoController has **no** red box'
  },
  get: function() {
    this.supr();
    redBox.destroy();
  }
});



/**
 * The main `app` object
 * @description Define your app here
 */
var app = {

  /**
   * The main angular controller defined in the <html> tag
   */
  controller: function($scope) {
    app.scope = $scope;
  },

  /**
   * Route definitions
   * @description For consistency with other libs, we are defining a `template` and a `controller` at a minimum
   */
  routes: {
    '/': {
      template: '/assets/partials/main.html',
      controller: new MainController()
    },
    '/one': {
      template: '/assets/partials/one.html',
      controller: new OneController()
    },
    '/two': {
      template: '/assets/partials/two.html',
      controller: new TwoController()
    }
  }
}

Emitter(app); // Mixin event emitting capabilities (not necessary, but a good idea)



/**
 * Add a listener for when an Angular route is triggered
 * @description Tell the Angular scope which is the current controller and trigger a common method
 */
app.on('route', function(_route) {
  app.scope.self = _route.controller;
  _route.controller.scope = app.scope;
  _route.controller.get();
});



/**
 * Instantiate the Angular app
 * @description Because of the way we are using a global `app` var this code does not need to change
 */
angular.module('app', ['ngRoute']).config(function($routeProvider, $locationProvider) {

  /**
   * A faux route controller so we can catch the route and emit an event with the appropriate controller
   */
  var routeController = function(_route) {
    return function() {
      app.trigger('route', _route);
    }
  }

  /**
   * Loop through the `app` route definitions and add them to Angular
   */
  Object.keys(app.routes).forEach(function(_route) {

    $routeProvider.when(_route, {
      templateUrl: app.routes[_route].template,
      controller: routeController(app.routes[_route])
    });

  });

  $locationProvider.html5Mode(true);

});