  angular.module('adf.config', []).
	  provider('configuration', function () {
	      this.$get = function () {
	          return {
	              rootUrl: '..'
	          };
	      };
	  });