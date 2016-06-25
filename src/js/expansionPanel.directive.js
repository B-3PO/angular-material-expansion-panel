angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanel', expansionPanelDirective);

/**
 * @ngdoc directive
 * @name mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanel` is the main container for panels
 *
 * @param {string=} md-component-id - add an id if you want to acces the panel via the `$mdExpansionPanel` service
 **/
function expansionPanelDirective() {
  var directive = {
    restrict: 'E',
    require: ['mdExpansionPanel', '?^^mdExpansionPanelGroup'],
    scope: true,
    compile: compile,
    controller: ['$scope', '$element', '$attrs', '$window', '$$rAF', '$mdConstant', '$mdUtil', '$mdComponentRegistry', controller]
  };
  return directive;




  function compile(tElement, tAttrs) {
    tElement.attr('tabindex', tAttrs.tabindex || '0');

    return function postLink(scope, element, attrs, ctrls) {
      var epxansionPanelCtrl = ctrls[0];
      var epxansionPanelGroupCtrl = ctrls[1];
      var componentId = attrs.mdComponentId;

      epxansionPanelCtrl.componentId = componentId;
    };
  }




  function controller($scope, $element, $attrs, $window, $$rAF, $mdConstant, $mdUtil, $mdComponentRegistry) {
    /* jshint validthis: true */
    var vm = this;

    var collapsedCtrl;
    var expandedCtrl;
    var headerCtrl;
    var footerCtrl;
    var deregister;
    var scrollContainer;
    var stickyContainer;
    var topKiller;
    var resizeKiller;
    var isOpen = false;
    var isDisabled = false;
    var debouncedUpdateScroll = $$rAF.throttle(updateScroll);
    var debouncedUpdateResize = $$rAF.throttle(updateResize);

    vm.registerCollapsed = function (ctrl) { collapsedCtrl = ctrl; };
    vm.registerExpanded = function (ctrl) { expandedCtrl = ctrl; };
    vm.registerHeader = function (ctrl) { headerCtrl = ctrl; };
    vm.registerFooter = function (ctrl) { footerCtrl = ctrl; };

    vm.$element = $element;
    vm.expand = expand;
    vm.collapse = collapse;


    $attrs.$observe('disabled', function(disabled) {
      isDisabled = disabled;
      if (disabled === true) {
        $element.attr('tabindex', '-1');
      } else {
        $element.attr('tabindex', '0');
      }
    });

    $element
      .on('focus', function (ev) {
        $element.on('keydown', handleKeypress);
      })
      .on('blur', function (ev) {
        $element.off('keydown', handleKeypress);
      });

    function handleKeypress(ev) {
      var keyCodes = $mdConstant.KEY_CODE;

      switch (ev.keyCode) {
        case keyCodes.ENTER:
          expand();
          break;
        case keyCodes.ESCAPE:
          collapse();
          break;
      }
    }


    $scope.$panel = {
      collapse: collapse,
      expand: expand
    };


    $scope.$on('$destroy', function () {
      // remove component from registry
      if (typeof deregister === 'function') { deregister(); }
    });


    if ($attrs.mdComponentId) {
      deregister = $mdComponentRegistry.register({
        expand: expand,
        collapse: collapse
      }, $attrs.mdComponentId);
    }



    function expand() {
      if (isOpen === true || isDisabled === true) { return; }
      isOpen = true;

      $element.removeClass('md-close');
      $element.addClass('md-open');

      initEvents();
      collapsedCtrl.hide();
      expandedCtrl.show();

      if (headerCtrl) { headerCtrl.show(); }
      if (footerCtrl) { footerCtrl.show(); }
    }


    function collapse() {
      if (isOpen === false) { return; }
      isOpen = false;

      $element.addClass('md-close');
      $element.removeClass('md-open');

      killEvents();
      collapsedCtrl.show();
      expandedCtrl.hide();

      if (headerCtrl) { headerCtrl.hide(); }
      if (footerCtrl) { footerCtrl.hide(); }
    }



    function initEvents() {
      if ((!footerCtrl || footerCtrl.noSticky === true) && (!headerCtrl || headerCtrl.noSticky === true)) {
        return;
      }

      // watch for panel position changes
      topKiller = $scope.$watch(function () { return $element[0].offsetTop; }, debouncedUpdateScroll, true);

      // watch for panel position changes
      resizeKiller = $scope.$watch(function () { return $element[0].offsetWidth; }, debouncedUpdateResize, true);

      // listen to md-content scroll events id we are nested in one
      scrollContainer = $mdUtil.getNearestContentElement($element);
      if (scrollContainer.nodeName === 'MD-CONTENT') {
        angular.element(scrollContainer).on('scroll', debouncedUpdateScroll);
      }

      // listen to expanded content scroll if height is set
      if (expandedCtrl.setHeight === true) {
        expandedCtrl.$element.on('scroll', debouncedUpdateScroll);
      }

      // listen to window scroll events
      angular.element($window)
        .on('scroll', debouncedUpdateScroll)
        .on('resize', debouncedUpdateScroll);
    }


    function killEvents() {
      if (typeof topKiller === 'function') {
        topKiller();
        topKiller = undefined;
      }

      if (typeof resizeKiller === 'function') {
        resizeKiller();
        resizeKiller = undefined;
      }

      if (scrollContainer.nodeName === 'MD-CONTENT') {
        angular.element(scrollContainer).off('scroll', debouncedUpdateScroll);
      }

      if (expandedCtrl.setHeight === true) {
        expandedCtrl.$element.off('scroll', debouncedUpdateScroll);
      }

      angular.element($window)
        .off('scroll', debouncedUpdateScroll)
        .off('resize', debouncedUpdateScroll);
    }


    function updateScroll(e) {
      var top
      var bottom
      var bounds;
      if (expandedCtrl.setHeight === true) {
        bounds = expandedCtrl.$element[0].getBoundingClientRect();
      } else {
        bounds = scrollContainer.getBoundingClientRect();
      }

      // we never want the header going post the top of the page. to prevent this don't allow top to go below 0
      top = Math.max(bounds.top, 0);
      bottom = top + bounds.height;

      if (footerCtrl && footerCtrl.noSticky === false) { footerCtrl.onScroll(top, bottom); }
      if (headerCtrl && headerCtrl.noSticky === false) { headerCtrl.onScroll(top, bottom); }
    }


    function updateResize(value) {
      if (footerCtrl && footerCtrl.noSticky === false) { footerCtrl.onResize(value); }
      if (headerCtrl && headerCtrl.noSticky === false) { headerCtrl.onResize(value); }
    }
  }
}
