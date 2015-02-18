// Controllers
app.controller('appCtrl', ['$scope', '$rootScope', '$timeout', '$mdToast', '$animate', '$mdSidenav', '$cordovaNetwork', '$cordovaSplashscreen', '$localstorage', 'Auth', '$location',  function($scope, $rootScope, $timeout, $mdToast, $animate, $mdSidenav, $cordovaNetwork, $cordovaSplashscreen, $localstorage, Auth, $location){
    $scope.changeBg = "";
    $rootScope.isActiveMessage = false;
    $scope.currentUser = [];
    $scope.notifications = "";
    $rootScope.message = 'Welcome to Gumboot';
    $scope.notification = $rootScope.message;


    // check user local test - uncomment when testing locally
    $rootScope.userData = $localstorage.getObject("user");
    if ($rootScope.userData.Name == null || $rootScope.userData.Name == undefined || $rootScope.userData.Name == ''){
        $rootScope.message = 'no stored data';
    }
    else {
        $rootScope.message = 'Thank you '+$rootScope.userData.Name+' you are now connected';
        // Simulate a login delay. Remove this and replace with your login
        Auth.setUser($rootScope.userData.Name);
        $rootScope.loggedIn = 'connected';
        $rootScope.userConnected = true;
        $scope.user = $rootScope.userData.Name;
        $scope.currentUser.push({
            name: $rootScope.userData.Name,
            currentSite: $rootScope.userData.CurrentSiteName
        });
        $location.path('/landing');
    }
	
    document.addEventListener("deviceready", function () {
        //$cordovaSplashscreen.show();
        document.body.style.minHeight = document.body.clientHeight + 'px';
        var type = $cordovaNetwork.getNetwork();
        var isOnline = $cordovaNetwork.isOnline();
        var isOffline = $cordovaNetwork.isOffline();

        // check user
        $rootScope.userData = $localstorage.getObject("user");
        if ($rootScope.userData.Name == null || $rootScope.userData.Name == undefined || $rootScope.userData.Name == ''){
            $rootScope.message = 'no stored data';
        }
        else {
            $rootScope.message = 'Thank you '+$rootScope.userData.Name+' you are now connected';
            // Simulate a login delay. Remove this and replace with your login
            Auth.setUser($rootScope.userData.Name);
            $rootScope.loggedIn = 'connected';
            $rootScope.userConnected = true;
            $scope.currentUser.push({
                name: $rootScope.userData.Name,
                currentSite: $rootScope.userData.CurrentSiteName
            });
            $location.path('/landing');
        }


        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            var onlineState = networkState;
            $rootScope.message = 'Network found, syncing data to cloud';
            $rootScope.loading = true;

            // will do posts of stored data here
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            $rootScope.loading = false;
            $rootScope.message = 'No network, data will be sent when network restored';

            // if offline then we need to store data locally to be sent once back online
        });

    }, false);

    // notification settings
    $scope.showActionToast = function() {
        $mdToast.show({
            templateUrl: 'views/notifications.html',
            controller: 'notificationCtrl',
            hideDelay: 3000,
            position:"top right"
        });
    };

    // watchers to check if connected and notification message updates
    $rootScope.$watch('message', function() {
        $scope.showActionToast();
    });
    $rootScope.$watch('userConnected', function() {
        if ($rootScope.userConnected == true ){
            $scope.changeBg = 'connected';
        }
        else {
            $scope.changeBg = '';
        }
    });

    // for menu actions
    $scope.toggleRight = function() {
        $mdSidenav('left').toggle()
            .then(function(){
                //$log.debug("toggle RIGHT is done");
            });
    };
    $scope.onSwipeRight = function() {
        $mdSidenav('left').open();
    };
    $scope.onSwipeLeft = function() {
        $mdSidenav('left').close()
    };
}]);

app.controller('HomeCtrl', ['$scope', 'Auth', 'API', '$rootScope', '$location', '$cordovaSplashscreen', '$localstorage', function ($scope, Auth, API, $rootScope, $location, $cordovaSplashscreen, $localstorage) {
    $rootScope.isHome = true;
    $rootScope.isPage = false;
    //$rootScope.userConnected = false;
    $scope.loginData = [];

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $rootScope.loggedIn = 'connected';
        $rootScope.loading = false;
        $rootScope.userConnected = true;
        $location.path('/landing');
        return $rootScope.userConnected;
    };
    $scope.connectUser = function() {
        $rootScope.loading = true;
        $rootScope.loggedIn = 'connecting';
        $rootScope.message = 'Please fill in your login details to connect';
    };
    // Perform the login action when the user submits the login form
    $scope.userAuth = function() {
        $rootScope.loading = true;

        API.postConsultantLoginID($scope.loginData.password)
        .success(function (data) {
            if (data == null){
                $rootScope.message = 'Invalid pin, please try again';
            }
            else {
                $rootScope.message = 'Thank you ' + data.Name + ' you are now connected';
                // Simulate a login delay. Remove this and replace with your login
                Auth.setUser(data.Name);
                $localstorage.setObject("user", data)
                // code if using a login system
                $scope.closeLogin();
            }
        }).
        error(function (error) {
            $rootScope.message = 'Invalid pin, please try again';
        });
    };


    //We need to set date to track when to update localStorage,
    //this code needs to be improved.

    var loginDate = new Date();
    var appTimeSpanDate = loginDate.getDay();


    //Fetch App Services only if localStorage has expired
    if("appServices" in $localstorage){
        $rootScope.message = 'No services updated';
    }
    else {
        API.getServices()
        .success(function (data) {
            $localstorage.setObject('appServices', data);
            $localstorage.set('appTimeSpan', appTimeSpanDate);
        })
        .error(function (error) {
            $rootScope.message = error;
        });

        //Hirer List
        API.getPlantHirerAll()
        .success(function (data) {
            $localstorage.setObject('PlantHirerList', data);
        })
        .error(function (error) {
            $rootScope.message = error;
        });
    }

}]);