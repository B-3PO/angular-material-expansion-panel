(function(){"use strict";/**
 * @ngdoc module
 * @name material.components.expansionPanels
 *
 * @description
 * Expansion panel component
 */
angular
  .module('material.components.expansionPanels', [
    'material.core'
  ]);
}());
(function(){"use strict";angular
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
      var top;
      var bottom;
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
}());
(function(){"use strict";angular
  .module('material.components.expansionPanels')
  .factory('$mdExpansionPanel', expansionPanelService);


/**
 * @ngdoc service
 * @name $mdExpansionPanel
 * @module material.components.expansionPanels
 *
 * @description
 * Expand and collapse Expansion Panel using its `md-component-id`
 *
 * @example
 * $mdExpansionPanel('comonentId').then(function (instance) {
 *  instance.exapand();
 *  instance.collapse();
 * });
 */
expansionPanelService.$inject = ['$mdComponentRegistry'];
function expansionPanelService($mdComponentRegistry) {
  return function (handle) {
    return $mdComponentRegistry
        .when(handle)
        .then(function (instance) {
          return instance;
        });
  };
}
}());
(function(){"use strict";angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelCollapsed', expansionPanelCollapsedDirective);



/**
 * @ngdoc directive
 * @name mdExpansionPanelCollapsed
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelCollapsed` is used to contain content when the panel is collapsed
 **/
expansionPanelCollapsedDirective.$inject = ['$animateCss'];
function expansionPanelCollapsedDirective($animateCss) {
  var directive = {
    restrict: 'E',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;


  function link(scope, element, attrs, expansionPanelCtrl) {
    expansionPanelCtrl.registerCollapsed({
      show: show,
      hide: hide
    });


    element.on('click', function () {
      expansionPanelCtrl.expand();
    });


    function hide() {
      // set width to maintian demensions when element is set to postion: absolute
      element.css('width', element[0].offsetWidth + 'px');

      // set min height so the expansion panel does not shrink when collapsed element is set to position: absolute
      expansionPanelCtrl.$element.css('min-height', element[0].offsetHeight + 'px');

      $animateCss(element, {
        addClass: 'md-absolute md-hide',
        from: {opacity: 1},
        to: {opacity: 0}
      })
      .start()
      .then(function () {
        element.removeClass('md-hide');
      });
    }


    function show() {
      // set width to maintian demensions when element is set to postion: absolute
      element.css('width', element[0].parentNode.offsetWidth + 'px');

      $animateCss(element, {
        addClass: 'md-show',
        from: {opacity: 0},
        to: {opacity: 1}
      })
      .start()
      .then(function () {
        element.removeClass('md-absolute md-show');

        // remove width when element is no longer position: absolute
        element.css('width', '');

        // remove min height when element is no longer position: absolute
        expansionPanelCtrl.$element.css('min-height', '');
      });
    }
  }
}
}());
(function(){"use strict";angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelExpanded', expansionPanelExpandedDirective);



/**
 * @ngdoc directive
 * @name mdExpansionPanelExpanded
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelExpanded` is used to contain content when the panel is expanded
 *
 * @param {number=} height - add this aatribute set the max height of the expanded content. The container will be set to scroll
 **/
expansionPanelExpandedDirective.$inject = ['$animateCss'];
function expansionPanelExpandedDirective($animateCss) {
  var directive = {
    restrict: 'E',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;


  function link(scope, element, attrs, expansionPanelCtrl) {
    var setHeight = attrs.height || undefined;
    if (setHeight !== undefined) { setHeight = setHeight.replace('px', '') + 'px'; }

    expansionPanelCtrl.registerExpanded({
      show: show,
      hide: hide,
      setHeight: setHeight !== undefined,
      $element: element
    });




    function hide() {
      var height = setHeight ? setHeight : element[0].scrollHeight + 'px';
      element.addClass('md-hide');
      element.removeClass('md-show md-scroll-y');

      $animateCss(element, {
        from: {'max-height': height, opacity: 1},
        to: {'max-height': '48px', opacity: 0}
      })
      .start()
      .then(function () {
        element.removeClass('md-hide');
      });
    }


    function show() {
      element.addClass('md-show md-overflow');

      // use passed in height or the contents height
      var height = setHeight ? setHeight : element[0].scrollHeight + 'px';

      $animateCss(element, {
        from: {'max-height': '48px', opacity: 0},
        to: {'max-height': height, opacity: 1}
      })
      .start()
      .then(function () {

        // if height was passed in then set div to scroll
        if (setHeight !== undefined) {
          element.addClass('md-scroll-y');
        } else {
          element.css('max-height', 'none');
        }

        element.removeClass('md-overflow');
      });
    }
  }
}
}());
(function(){"use strict";angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelFooter', expansionPanelFooterDirective);




/**
 * @ngdoc directive
 * @name mdExpansionPanelFooter
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelFooter` is nested inside of `mdExpansionPanelExpanded` and contains content you want at the bottom.
 * By default the Footer will stick to the bottom of the page if the panel expands past
 * this is optional
 *
 * @param {=} md-no-sticky - add this aatribute to disable sticky
 **/
function expansionPanelFooterDirective() {
  var directive = {
    restrict: 'E',
    transclude: true,
    template: '<div class="md-expansion-panel-footer-container" ng-transclude></div>',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;



  function link(scope, element, attrs, expansionPanelCtrl) {
    var isStuck = false;
    var noSticky = attrs.mdNoSticky !== undefined;
    var container = angular.element(element[0].querySelector('.md-expansion-panel-footer-container'));

    expansionPanelCtrl.registerFooter({
      show: show,
      hide: hide,
      onScroll: onScroll,
      onResize: onResize,
      noSticky: noSticky
    });



    function show() {

    }
    function hide() {
      unstick();
    }

    function onScroll(top, bottom) {
      var height;
      var footerBounds = element[0].getBoundingClientRect();
      var panelTop = element[0].parentNode.getBoundingClientRect().top;
      var offset = panelTop - bottom;

      if (footerBounds.bottom > bottom) {
        height = container[0].offsetHeight;

        // offset will push the fotter down when it hit the top of the card
        offset = Math.max(offset + height, 0);

        // set container width because element becomes postion fixed
        container.css('width', expansionPanelCtrl.$element[0].offsetWidth + 'px');

        // set element height so it does not loose its height when container is position fixed
        element.css('height', height + 'px');
        container.css('top', (bottom - height + offset) + 'px');

        element.addClass('md-stick');
        isStuck = true;
      } else if (isStuck === true) {
        unstick();
      }
    }

    function onResize(width) {
      if (isStuck === false) { return; }
      container.css('width', width + 'px');
    }


    function unstick() {
      isStuck = false;
      container.css('width', '');
      container.css('top', '');
      element.css('height', '');
      element.removeClass('md-stick');
    }
  }
}
}());
(function(){"use strict";angular
  .module('material.components.expansionPanels')
  .directive('mdExpansionPanelHeader', expansionPanelHeaderDirective);



/**
 * @ngdoc directive
 * @name mdExpansionPanelHeader
 * @module material.components.expansionPanels
 *
 * @restrict E
 *
 * @description
 * `mdExpansionPanelHeader` is nested inside of `mdExpansionPanelExpanded` and contains content you want in place of the collapsed content
 * this is optional
 *
 * @param {=} md-no-sticky - add this aatribute to disable sticky
 **/
expansionPanelHeaderDirective.$inject = [];
function expansionPanelHeaderDirective() {
  var directive = {
    restrict: 'E',
    transclude: true,
    template: '<div class="md-expansion-panel-header-container" ng-transclude></div>',
    require: '^^mdExpansionPanel',
    link: link
  };
  return directive;



  function link(scope, element, attrs, expansionPanelCtrl) {
    var isStuck = false;
    var noSticky = attrs.mdNoSticky !== undefined;
    var container = angular.element(element[0].querySelector('.md-expansion-panel-header-container'));

    expansionPanelCtrl.registerHeader({
      show: show,
      hide: hide,
      noSticky: noSticky,
      onScroll: onScroll,
      onResize: onResize
    });


    function show() {

    }
    function hide() {
      unstick();
    }


    function onScroll(top) {
      var bounds = element[0].getBoundingClientRect();

      if (bounds.top < top) {
        // set container width because element becomes postion fixed
        container.css('width', element[0].offsetWidth + 'px');
        container.css('top', top + 'px');

        // set element height so it does not shink when container is position fixed
        element.css('height', container[0].offsetHeight + 'px');

        element.removeClass('md-no-stick');
        element.addClass('md-stick');
        isStuck = true;
      } else if (isStuck === true) {
        unstick();
      }
    }

    function onResize(width) {
      if (isStuck === false) { return; }
      element.css('width', width + 'px');
    }


    function unstick() {
      isStuck = false;
      container.css('width', '');
      element.css('height', '');
      element.css('top', '');
      element.removeClass('md-stick');
      element.addClass('md-no-stick');
    }
  }
}
}());