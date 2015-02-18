/**
 * Created by Shan on 1/22/2015.
 */

// paging provider and listener
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};


    $routeProvider
        .when('/', {
            templateUrl: "views/login-page-extension.html",
            controller: "HomeCtrl"
        })
        .when('/home', {
            templateUrl: "views/login-page-extension.html",
            controller: "HomeCtrl"
        })
        .when('/landing', {
            templateUrl: "views/landing-page-extension.html",
            controller: "HomeCtrl"
        })
        .when('/plant', {
            templateUrl: "views/plant-page-extension.html",
            controller: "PlantCtrl"
        })
        .when('/plant/capture-start-time', {
            templateUrl: "views/plant/plant-capture-start-time-extension.html",
            controller: "CaptureStartTimePlantCtrl"
        })
        .when('/plant/capture-stop-time', {
            templateUrl: "views/plant/plant-capture-stop-time-extension.html",
            controller: "CaptureStopTimePlantCtrl"
        })
        .when('/plant/receive-plant', {
            templateUrl: "views/plant/plant-receive-extension.html",
            controller: "ReceivePlantCtrl"
        })
        .when('/plant/update-plant', {
            templateUrl: "views/plant/plant-update-extension.html",
            controller: "UpdatePlantCtrl"
        })
        .when('/plant/return-plant', {
            templateUrl: "views/plant/plant-return-extension.html",
            controller: "ReturnPlantCtrl"
        })
        .when('/diesel', {
            templateUrl: "views/diesel-page-extension.html",
            controller: "DieselCtrl"
        })
        .when('/diesel/capture-diesel-sent', {
            templateUrl: "views/diesel/diesel-capture-sent-out-extension.html",
            controller: "CaptureSentOutDieselCtrl"
        })
        .when('/diesel/capture-diesel-tank', {
            templateUrl: "views/diesel/diesel-capture-tank-extension.html",
            controller: "CaptureTankDieselCtrl"
        })
        .when('/diesel/capture-diesel-received', {
            templateUrl: "views/diesel/diesel-capture-diesel-received-extension.html",
            controller: "CaptureReceivedDieselCtrl"
        })
        .otherwise({ redirect: '/' });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
});
// Services

app.service('httpService',['$http', '$q', function($http, $q){// this dependancy injection is minifier safe
    var httpGet = function(path){
        return $http({
            method: 'GET',
            url: path
        });
    };
    return {
        httpGet: httpGet
    };
}]);
// Factories
app.factory('Auth', function(){
    var user;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return(user)? user : false;
        }
    }
});
app.factory('DBCheck', function(){
    var data;

    return{
        checkData : function(aUser){
            user = aUser;
        },
        isDataUpdated : function(){
            return(user)? user : false;
        }
    }
});

//Current logged in user
app.service('consultant', ['$localstorage', function ($localstorage) {
    return {
        saveConsultant: function (userData) {
            $localstorage.setObject("user", userData);
        },

        getConsultant: function () {
            return $localstorage.getObject("user");
        }
    }
}]);


// applications checks
app.run(['$rootScope', '$location', '$http', 'Auth', '$localstorage','$interval', function ($rootScope, $location, $http, Auth, $localstorage, $interval) {

    $rootScope.$on('$routeChangeStart', function (event) {
        if (!Auth.isLoggedIn()) {
            //console.log('DENY');
            //$rootScope.message = 'Please login first';
            $location.path('/');
            //event.preventDefault();

        }
        else {
            //console.log('ALLOW');
            $rootScope.loggedIn = 'connected';
            $rootScope.userConnected = true;
        }
    });
	// Check for connection every hour
	
	function cloudSaveLocalStorageLoop(){
		
		$localstorage.cloudSaveLocalStorage();
		
		$interval(cloudSaveLocalStorageLoop, 3600000, 0);
	}
	
	cloudSaveLocalStorageLoop();
	
}]);



