'use strict';

angular
  .module('app')
  .factory(
    'restObjectsFactory', function ($http, $q, $filter) {

      function counterFn() {
        var json = {
          totalSeen: 0,
          totalNoSeen: 0
        };
        var defered = $q.defer();
        $http.get('data/test_json.json').then(function (response) {

          angular.forEach(response.data, function(item) {
            if(item.checked === 'visto') {
              json.totalSeen = json.totalSeen + 1;
            } else {
              json.totalNoSeen = json.totalNoSeen + 1;
            }
          });
          defered.resolve(json);
        },function (error){
          defered.reject(error);
        });

        return defered.promise;
      }

      function findFn(page, count, search, orderBy) {
        var json = {};
        var defered = $q.defer();
        $http.get('data/test_json.json').then(function (response) {

          if (angular.isDefined(search)) {
            response.data = $filter('filter')(response.data, {$: search});
          }
          if (angular.isDefined(orderBy)) {
            response.data = $filter('orderBy')(response.data, orderBy);
          }

          json.total = response.data.length;
          json.data = response.data.slice((page - 1) * count, page * count);
          json.page = page;
          json.count = count;
          defered.resolve(json);
        },function (error){
          defered.reject(error);
        });

        return defered.promise;
      }

      return {
        find: findFn,
        counter: counterFn
      };

    });
