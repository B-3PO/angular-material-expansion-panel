(function(){"use strict";angular
  .module('angularMaterialExpansionPanel')
  .controller('GroupController', GroupController);



GroupController.$inject = ['$mdExpansionPanelGroup'];
function GroupController($mdExpansionPanelGroup) {
  var vm = this;

  var groupInstance;

  vm.title = 'Panel Title';
  vm.summary = 'Panel Summary text';
  vm.content = 'Many were increasingly of the opinion that they’d all made a big mistake in coming down from the trees in the first place. And some said that even the trees had been a bad move, and that no one should ever have left the oceans.';

  vm.addTemplated = addTemplated;

  $mdExpansionPanelGroup().waitFor('expansionPanelGroup').then(function (instance) {
    groupInstance = instance;

    instance.register('templated', {
      templateUrl: 'pages/group/panels/templated/templated.html',
      controller: 'TemplatedPanelController',
      controllerAs: 'vm'
    });

    instance.add({
      templateUrl: 'pages/group/panels/one/one.html',
      controller: 'OnePanelController',
      controllerAs: 'vm'
    }).then(function (panelInstance) {
      panelInstance.expand();
    });

    var change = instance.onChange(function (count) {
      console.log('panel count', count);
    });


    setTimeout(function () {
      change();
    }, 10000);
  });

  function addTemplated() {
    groupInstance.add('templated', {
      title: vm.title,
      summary: vm.summary,
      content: vm.content
    }).then(function (panel) {
      panel.onRemove(function () {
        console.log('panel removed');
      });
    });
  }
}
}());