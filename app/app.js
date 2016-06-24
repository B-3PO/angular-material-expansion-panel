angular.module('angularMaterialExpansionPanel', [
  'ngRoute',
  'ngAnimate',
  'ngMaterial',
  'mdExpansionPanel'
])
  .config(configApp);


configApp.$inject = ['$routeProvider'];
function configApp($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .otherwise('/');
}
