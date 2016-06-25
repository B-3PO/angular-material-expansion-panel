angular.module('angularMaterialExpansionPanel', [
  'ngRoute',
  'ngAnimate',
  'ngMaterial',
  'material.components.expansionPanels'
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
