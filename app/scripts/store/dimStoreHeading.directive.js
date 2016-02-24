/*jshint -W027*/

(function() {
  'use strict';

  angular.module('dimApp')
    .directive('dimStoreHeading', StoreHeading);

  StoreHeading.$inject = ['ngDialog'];

  function StoreHeading(ngDialog) {
    return {
      controller: StoreHeadingCtrl,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        'store': '=storeData',
        'charCol': '='
      },
      link: Link,
      template: [
        '<div class="character-box" ng-class="::{ \'vault-box\': !vm.isGuardian }" ng-style="{ \'background-image\': \'url(http://bungie.net\' + vm.store.background + \')\' }">',
        '  <div class="emblem" ng-if="::vm.isGuardian" ng-style="{ \'background-image\': \'url(http://bungie.net\' + vm.store.icon + \')\' }"></div>',
        '  <div class="class">{{:: vm.store.class || "Vault" }}</div>',
        '  <div class="race-gender" ng-if="::vm.isGuardian">{{:: vm.store.race }} {{:: vm.store.gender }}</div>',
        '  <div class="level" ng-if="::vm.isGuardian">Level {{ vm.store.level }}</div>',
        '  <div class="level powerLevel" ng-if="vm.isGuardian">{{ vm.store.powerLevel }}</div>',
        '  <div class="glimmer" ng-if="::!vm.isGuardian"> {{ vm.store.glimmer }} <img src="/images/glimmer.png"></div>',
        '  <div class="legendaryMarks" ng-if="::!vm.isGuardian"> {{ vm.store.legendaryMarks }} <img src="/images/legendaryMarks.png"></div>',
        '  <div class="levelBar" ng-if="::vm.isGuardian">',
        '    <div class="barFill" ng-style="{width: vm.store.percentToNextLevel + \'%\'}"></div>',
        '  </div>',
        '</div>',
        '<div class="loadout-button" ng-if="::vm.isGuardian" ng-click="vm.openLoadoutPopup($event)"><i class="fa fa-chevron-down"></i></div>',
        '<div loadout-id="{{:: vm.store.id }}" style="position: relative; top: 50px;"></div>',
        '<div class="stats" ng-if="vm.isGuardian">',
        '  <span class="stat" title="{{vm.formatTooltip(\'STAT_INTELLECT\')}}">',
        '    <img src="images/intellect.png" /><span class="bar bar-{{vm.charCol}}" ng-repeat="n in vm.store.stats.STAT_INTELLECT.tiers track by $index">',
        '      <span class="progress" style="width:{{n/60*100}}%"></span></span></span>',
        '  <span class="stat" title="{{vm.formatTooltip(\'STAT_DISCIPLINE\')}}">',
        '    <img src="images/discipline.png" /><span class="bar bar-{{vm.charCol}}" ng-repeat="n in vm.store.stats.STAT_DISCIPLINE.tiers track by $index">',
        '      <span class="progress" style="width:{{n/60*100}}%"></span></span></span>',
        '  <span class="stat" title="{{vm.formatTooltip(\'STAT_STRENGTH\')}}">',
        '    <img src="images/strength.png" /><span class="bar bar-{{vm.charCol}}" ng-repeat="n in vm.store.stats.STAT_STRENGTH.tiers track by $index">',
        '      <span class="progress" style="width:{{n/60*100}}%"></span></span></span>',
        '</div>'
      ].join('')
    };

    function Link(scope, element) {
      var vm = scope.vm;
      var dialogResult = null;

      $(document).ready(function() {
        element.scrollToFixed({
          marginTop: 61,
          fixed: function() {
            $(document.body).addClass('something-is-sticky');
            $(this).addClass('fixed-header');
          },
          unfixed: function() {
            $(document.body).removeClass('something-is-sticky');
            $(this).removeClass('fixed-header');
          }
        });
      });

      vm.formatTooltip = function(which) {
        var next = ' (' + vm.store.stats[which].value + '/300)',
            tier = vm.store.stats[which].tier,
            type = '';
        switch(which) {
          case 'STAT_INTELLECT': type = 'Super'; break;
          case 'STAT_DISCIPLINE': type = 'Grenade'; break;
          case 'STAT_STRENGTH': type = 'Melee'; break;
        }
        if(tier !== 5) {
          next = ' (' + (vm.store.stats[which].value%60) + '/60 for T' + (tier+1) + ')';
        }
        return 'T' + tier + ' Intellect' + next + '\n' + type + ' cooldown: ' + vm.store.stats[which].cooldown;

      };

      vm.openLoadoutPopup = function openLoadoutPopup(e) {
        e.stopPropagation();

        if (!_.isNull(dialogResult)) {
          dialogResult.close();
        } else {
          ngDialog.closeAll();

          dialogResult = ngDialog.open({
            template: '<div ng-click="$event.stopPropagation();" dim-click-anywhere-but-here="vm.closeLoadoutPopup()" dim-loadout-popup="vm.store"></div>',
            plain: true,
            appendTo: 'div[loadout-id="' + vm.store.id + '"]',
            overlay: false,
            className: 'loadout-popup',
            showClose: false,
            scope: scope
          });

          dialogResult.closePromise.then(function(data) {
            dialogResult = null;
          });
        }
      };

      vm.closeLoadoutPopup = function closeLoadoutPopup() {
        if (!_.isNull(dialogResult)) {
          dialogResult.close();
        }
      };
      element.addClass('character');
    }
  }

  StoreHeadingCtrl.$inject = ['$scope'];

  function StoreHeadingCtrl($scope) {
    var vm = this;
    vm.isGuardian = (vm.store.id !== 'vault');
  }
})();
