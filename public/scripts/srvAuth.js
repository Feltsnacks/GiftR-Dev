
var app = angular.module('srvAuth', []);
app.factory('srvAuth', function() {
  return {
    watchAuthenticationStatusChange: function() {
      var _self = this;
      FB.Event.subscribe('auth.authResponseChange', function(response) {

        if (response.status === 'connected') {
          _self.getUserInfo();
          /*
           This is also the point where you should create a 
           session for the current user.
           For this purpose you can use the data inside the 
           response.authResponse object.
          */

        } 
        else 
        {
          /*
           The user is not logged to the app, or into Facebook:
           destroy the session on the server.
          */
        }
      });
      },

    getUserInfo: function() {

      var _self = this;

      FB.api('/me', function(response) {
        $rootScope.$apply(function() { 
          $rootScope.user = _self.user = response; 
        });
      });
    },

    logout: function() {

      var _self = this;

      FB.logout(function(response) {
        $rootScope.$apply(function() { 
          $rootScope.user = _self.user = {}; 
        }); 
      });
    }
  }
});