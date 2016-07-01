describe('material.components.expansionPanels', function () {
  var panel;
  var scope;
  var content;
  var $mdUtil;
  var $timeout;
  var $animate;


  // disable all css transitions so test wont fail
  var disableAnimationStyles = ''+
    '-webkit-transition: none !important;'+
    '-moz-transition: none !important;'+
    '-ms-transition: none !important;'+
    '-o-transition: none !important;'+
    'transition: none !important;';
  window.onload = function () {
    var animationStyles = document.createElement('style');
    animationStyles.type = 'text/css';
    animationStyles.innerHTML = '* {' + disableAnimationStyles + '}';
    document.head.appendChild(animationStyles);
  };



  beforeEach(module('ngAnimateMock'));
  beforeEach(module('material.components.expansionPanels'));
  beforeEach(inject(function(_$mdUtil_, _$timeout_, _$animate_) {
    $mdUtil = _$mdUtil_;
    $timeout = _$timeout_;
    $animate = _$animate_;
  }));

  // destroy all created scopes and elements
  afterEach(function () {
    if (scope == undefined) { return; }
    scope.$destroy();
    panel.remove();
    panel = undefined;
    scope = undefined;

    if (content) {
      content.remove();
      content = undefined;
    }
  });






  // --- Expansion Panel Service ---

  describe('$mdExpansionPanel Service', function () {

    // it('should expand panel', function (done) {
    //   var element = getDirective();
    //   inject(function ($mdExpansionPanel) {
    //
    //     $mdExpansionPanel('expansionPanelId').then(function (instance) {
    //       console.log(element);
    //       // instance.expand();
    //       // flushAnimations();
    //       // expect(element.hasClass('md-open')).toBe(false);
    //       expect(true).toBe(true);
    //       done();
    //     });
    //   });
    // });


    it('should find instance by id', inject(function($mdExpansionPanel) {
      var instance;

      $mdExpansionPanel('expansionPanelId').then(function(inst) {
        instance = inst;
      });
      expect(instance).toBeUndefined();

      var element = getDirective();
      $timeout.flush();

      expect(instance).toBeDefined();
    }));


    it('should expand panel', inject(function($mdExpansionPanel) {
      $mdExpansionPanel('expansionPanelId').then(function(instance) {
        instance.expand();
      });

      var element = getDirective();
      flushAnimations();

      expect(element.hasClass('md-open')).toBe(true);
    }));


    it('should expand panel', inject(function($mdExpansionPanel) {
      $mdExpansionPanel('expansionPanelId').then(function(instance) {
        instance.expand();
        instance.collapse();
      });

      var element = getDirective();
      flushAnimations();

      expect(element.hasClass('md-close')).toBe(true);
    }));close

  });






  // ---- Expansion Panel Directive ---

  describe('md-expansion-panel directive', function () {
    it('should have `tabindex` attribute', function () {
      var element = getDirective();
      expect(element.attr('tabindex')).not.toBe(undefined);
    });

    it('should set `tabindex` to `-1` if `disabled`', function () {
      var element = getDirective({disabled: true});
      expect(element.attr('tabindex')).toEqual('-1');
    });


    it('should thow errors on invalid markup', inject(function($compile, $rootScope) {
      function buildBadPanelOne() {
        $compile('<md-expansion-panel></md-expansion-panel>')($rootScope);
      }

      function buildBadPanelTwo() {
        $compile('<md-expansion-panel><md-expansion-panel-collapsed></md-expansion-panel-collapsed></md-expansion-panel>')($rootScope);
      }

      expect(buildBadPanelOne).toThrow();
      expect(buildBadPanelTwo).toThrow();
    }));


    it('should add `md-open` class on expand', function () {
      var element = getDirective();
      expandPanel();
      expect(element.hasClass('md-open')).toBe(true);
    });

    it('should add `md-close` class on collapse', function () {
      var element = getDirective();
      expandPanel();
      collapsePanel();
      expect(element.hasClass('md-close')).toBe(true);
    });


    describe('Focused', function () {
      it('should be the focused element', function () {
        var element = getDirective();
        focusPanel();
        expect(document.activeElement).toBe(element[0]);
      });

      it('should Expand on `enter` keydown', function () {
        var element = getDirective();
        focusPanel();
        pressKey(13);
        expect(element.hasClass('md-open')).toBe(true);
      });


      it('should Collapse on `escape` keydown', function () {
        var element = getDirective();
        expandPanel();
        focusPanel();
        pressKey(27);

        expect(element.hasClass('md-close')).toBe(true);
      });
    });






    // --- expanded Directive ---

    describe('md-expansion-panel-expanded directive', function () {
      describe('Expanded', function () {
        it('should have `md-show` class', function () {
          var element = getDirective();
          expandPanel();
          expect(element.find('md-expansion-panel-expanded').hasClass('md-show')).toBe(true);
        });

        describe('Animating', function () {
          it('should have `md-overflow` class', function () {
            var element = getDirective();
            expandPanel();
            expect(element.find('md-expansion-panel-expanded').hasClass('md-overflow')).toBe(true);
          });
        });

        describe('After Animating', function () {
          it('should not have `md-overflow` class', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            expect(element.find('md-expansion-panel-expanded').hasClass('md-overflow')).toBe(false);
          });

          it('should not have `max-height` style', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            expect(element.find('md-expansion-panel-expanded').css('max-height')).toBe('none');
          });
        });
      });


      describe('Expanded with height set', function () {
        it('should have `max-height` style', function () {
          var element = getDirective({height: 300});
          expandPanel();
          flushAnimations();
          expect(element.find('md-expansion-panel-expanded').css('max-height')).toBe('300px');
        });

        it('should have `md-scroll-y` class', function () {
          var element = getDirective({height: 300});
          expandPanel();
          flushAnimations();
          expect(element.find('md-expansion-panel-expanded').hasClass('md-scroll-y')).toBe(true);
        });
      });


      describe('Collapse', function () {
        it('should have `md-hide` class', function () {
          var element = getDirective();
          expandPanel();
          collapsePanel();
          expect(element.find('md-expansion-panel-expanded').hasClass('md-hide')).toBe(true);
        });

        it('should have `md-overflow` class', function () {
          var element = getDirective();
          expandPanel();
          collapsePanel();
          expect(element.find('md-expansion-panel-expanded').hasClass('md-overflow')).toBe(true);
        });


        describe('After Animating', function () {
          it('should not have `md-hide` class', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            collapsePanel();
            flushAnimations();
            expect(element.find('md-expansion-panel-expanded').hasClass('md-hide')).toBe(false);
          });
        });
      });
    });






    // --- collapsed Directive ----

    describe('md-expansion-panel-collapsed directive', function () {
      describe('Expanded', function () {
        it('should have `md-hide` class', function () {
          var element = getDirective();
          expandPanel();
          expect(element.find('md-expansion-panel-collapsed').hasClass('md-hide')).toBe(true);
        });

        it('should not have `md-show` class', function () {
          var element = getDirective();
          expandPanel();
          expect(element.find('md-expansion-panel-collapsed').hasClass('md-show')).toBe(false);
        });

        it('should have `width` style', function () {
          var element = getDirective();
          expandPanel();
          expect(element.find('md-expansion-panel-collapsed').css('width')).toBeDefined();
        });


        describe('After Animating', function () {
          it('should have `md-absolute` class', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            expect(element.find('md-expansion-panel-collapsed').hasClass('md-absolute')).toBe(true);
          });

          it('should not have `md-hide` style', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            expect(element.find('md-expansion-panel-collapsed').hasClass('md-hide')).toBe(false);
          });

          it('should add `max-hight` to `md-expansion-panel`', function () {
            var element = getDirective();
            expandPanel();
            flushAnimations();
            expect(element.css('min-height')).toBeDefined();
          });
        });



        describe('Collapsed', function () {
          it('should have `md-show` class', function () {
            var element = getDirective();
            expandPanel();
            collapsePanel();
            expect(element.find('md-expansion-panel-collapsed').hasClass('md-show')).toBe(true);
          });

          it('should have `width` style', function () {
            var element = getDirective();
            expandPanel();
            expect(element.find('md-expansion-panel-collapsed').css('width')).toBeDefined();
          });


          describe('After Animating', function () {
            it('should not have `md-absolute` class', function () {
              var element = getDirective();
              expandPanel();
              flushAnimations();
              collapsePanel();
              flushAnimations();
              expect(element.find('md-expansion-panel-collapsed').hasClass('md-absolute')).toBe(false);
            });

            it('should not have `width` style', function () {
              var element = getDirective();
              expandPanel();
              flushAnimations();
              collapsePanel();
              flushAnimations();
              expect(element.find('md-expansion-panel-collapsed').css('width')).toBe('');
            });

            it('should remove `max-hight` from `md-expansion-panel`', function () {
              var element = getDirective();
              expandPanel();
              flushAnimations();
              collapsePanel();
              flushAnimations();
              expect(element.css('min-height')).toBe('');
            });
          });
        });
      });
    });







    // --- Header Directive ----

    describe('md-expansion-panel-header directive', function () {
      describe('On Scroll', function () {
        it('should have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 80;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 80}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-header').hasClass('md-stick')).toBe(true);
        }));
      });


      describe('On Scroll Top', function () {
        it('should not have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 0;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 0}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-header').hasClass('md-stick')).toBe(false);
        }));
      });



      describe('No Sticky', function () {
        it('should not have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true, headerNoStick: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 80;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 80}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-header').hasClass('md-stick')).toBe(false);
        }));
      });
    });






    // --- Foooter Directive ----

    describe('md-expansion-panel-footer directive', function () {
      describe('On Scroll', function () {
        it('should have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 80;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 80}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-footer').hasClass('md-stick')).toBe(true);
        }));
      });


      describe('On Scroll Bottom', function () {
        it('should not have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 1000;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 1000}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-footer').hasClass('md-stick')).toBe(false);
        }));
      });



      describe('No Sticky', function () {
        it('should not have `md-stick` class', inject(function($$rAF) {
          var element = getDirective({content: true, footerNoStick: true});
          expandPanel();
          flushAnimations();

          content[0].scrollTop = 80;
          content.triggerHandler({
            type: 'scroll',
            target: {scrollTop: 80}
          });
          $$rAF.flush();

          expect(element.find('md-expansion-panel-footer').hasClass('md-stick')).toBe(false);
        }));
      });
    });


  });






  // --- Helpers -------------------


  function getDirective(options) {
    options = options || {};

    var template = $mdUtil.supplant('{2}' +
    '<md-expansion-panel {0} md-component-id="expansionPanelId">'+
      '><md-expansion-panel-collapsed>'+
        '<div class="md-title">Title</div>'+
        '<div class="md-summary">Summary</div>'+
      '</md-expansion-panel-collapsed>'+
      '<md-expansion-panel-expanded{1}>'+
        '<md-expansion-panel-header{4}>'+
          '<div class="md-title">Expanded Title</div>'+
          '<div class="md-summary">Expanded Summary</div>'+
        '</md-expansion-panel-header>'+
        '<md-expansion-panel-content>'+
          '<h4>Content</h4>'+
          '<p>Put content in here</p>'+
        '</md-expansion-panel-content>'+
        '<md-expansion-panel-footer{5}>'+
          '<div flex></div>'+
          '<md-button class="md-warn">Collapse</md-button>'+
        '</md-expansion-panel-footer>'+
      '</md-expansion-panel-expanded>'+
    '</md-expansion-panel>{3}',
    [
      options.disabled ? 'disabled' : '',
      options.height ? ' height="'+options.height+'" ' : '',
      options.content ? '<md-content style="height: 200px;">' : '',
      options.content ? '</md-content>' : '',
      options.headerNoStick ? ' md-no-sticky ' : '',
      options.footerNoStick ? ' md-no-sticky ' : '',
      options.componentId ? ' md-component-id="'+options.componentId+'" ' : ''
    ]);

    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      panel = $compile(template)(scope);
    });

    document.body.appendChild(panel[0]);

    if (options.content) {
      content = panel;
      panel = content.find('md-expansion-panel');
    }

    panel.scope().$digest();
    return panel;
  }


  function expandPanel() {
    panel.find('md-expansion-panel-collapsed').triggerHandler('click');
    panel.scope().$digest();
  }

  function collapsePanel() {
    panel.scope().$panel.collapse();
    panel.scope().$digest();
  }

  function focusPanel() {
    panel.focus();
    panel.scope().$digest();
  }

  function pressKey(keycode) {
    panel.triggerHandler({
      type: 'keydown',
      keyCode: keycode
    });
    panel.scope().$digest();
  }


  function flushAnimations() {
    $animate.flush();
    $timeout.flush();
  }

});
