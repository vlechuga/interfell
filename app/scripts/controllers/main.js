'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */
angular.module('app')
  .controller('MainCtrl', function (restObjectsFactory, NgTableParams, ngTableEventsChannel) {

    var vm = this;
    vm.controlPage = {
      page: 1,
      count: 10,
      total: 0
    };

    vm.filter = {
      search: undefined,
      date:{
        from:undefined,
        to:undefined
      }
    };

    vm.counter = {
      totalSeen: 0,
      totalNoSeen: 0
    };

    vm.search = searchFn;

    $onInit();

    function $onInit() {
      updateTableFn();
      restObjectsFactory.counter().then(function (response) {
        vm.counter.totalSeen = response.totalSeen;
        vm.counter.totalNoSeen = response.totalNoSeen;
      });
    }

    function updateTableFn() {
      vm.dataTable = new NgTableParams({
        page: vm.controlPage.page ? vm.controlPage.page : 1,
        count: vm.controlPage.count ? vm.controlPage.count : 10
      }, {

        getData: function (params) {

          return restObjectsFactory.find(params.page(), params.count(), vm.filter.search, params.orderBy()).then(function (response) {
            vm.controlPage.total = response.total;
            vm.controlPage.page = response.page;
            vm.controlPage.count = response.size;
            params.total(vm.controlPage.total);
            return response.data;
          });
        }
      });
    }

    function searchFn() {
      updateTableFn();
    }

  });
