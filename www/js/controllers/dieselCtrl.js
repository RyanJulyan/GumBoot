app.controller('DieselCtrl', ['$scope', '$rootScope',function($scope, $rootScope){
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = true;
    $rootScope.message = 'Select the process you would like to complete';
    $scope.dieselData = [];

}]);

// can probably create a generic controller for all forms
app.controller('CaptureSentOutDieselCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage','appServices', 'consultant', '$location', '$cordovaNetwork', function($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork){
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.dateClicked = false;
    $scope.updateDate = function(item) {
        var newDate = item;
        $scope.currentDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDay();
    };

    // Get plants created by consultant
    API.getPlantByConsultantID(consultant.getConsultant().Id).success(function (data, status) {
        $scope.consultantPlants = data;
    }).error(function (data, status) {
        //console.log(status)
    });

    $scope.changeModelItem = function (item) {
        for (var x in $scope.consultantPlants) {
            if ($scope.consultantPlants[x].Id == item) {
                $scope.plant = $scope.consultantPlants[x];
                $scope.user.Reference = $scope.plant.Reference;
                break;
            }
        }
    };

    //confiramtion alert
    $scope.showComplete = function() {
        var confirm = $mdDialog.alert()
            .title('Success!')
            .content('All your content has been saved.')
            .ariaLabel('Success')
            .ok('Got it!');
        $mdDialog.show(confirm).then(function() {
            $location.path('/diesel');

        }, function() {

        });
    };

    $scope.showError = function() {
        var confirm = $mdDialog.alert()
            .title('Error!')
            .content('we seem to have encountered something mysterious, please try again')
            .ariaLabel('Success')
            .ok('Ok');
        $mdDialog.show(confirm).then(function() {

        }, function() {

        });
    };

    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Would you like to save information?')
            //.content('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Lucky day')
            .ok('confirm!')
            .cancel('cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $rootScope.loading = true;

            consultant.getConsultant().Id;

            var CaptureDate = $scope.user.CaptureDate;
            $scope.user.CaptureDate = Date.parse(CaptureDate);

            if ($scope.user.CaptureType == "Plant")
                $scope.user.CaptureType = appServices.dieselCaptureServiceList()[0].Id; //Plant
            else
                $scope.user.CaptureType = appServices.dieselCaptureServiceList()[1].Id; //Contractor

			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-dieselSentOut-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postDieselSentOut($localstorage.getObject($scope.localStorageRecordId))
                .success(function(data){
					// What is this for as message is returned
                    // $rootScope.message = 'Your information has been successfully saved';
					if(data.Status == "Ok"){
						console.log("data.localStorageRecordId: " + data.localStorageRecordId);
						$localstorage.removeObject(data.localStorageRecordId);
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showComplete();
					}
					else{
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showError();
					}
                }).
                error(function (error) {
                    $rootScope.message = 'error saving information please try again';
                    //console.log("error posing:" + error);
                    $rootScope.loading = false;
                });
			}
			else{
                    $rootScope.message = 'You are not connected to the internet, when you connect again, it will retry';
                    $rootScope.loading = false;
			}
			
        }, function() {

        });
    };

}]);

app.controller('CaptureReceivedDieselCtrl', ['$http', '$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($http, $scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork) {
    $http.defaults.useXDomain = true;
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.dateClicked = false;
    $scope.updateDate = function(item) {
        var newDate = item;
        $scope.currentDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDay();
    };

    //confiramtion alert
    $scope.showComplete = function() {
        var confirm = $mdDialog.alert()
            .title('Success!')
            .content('All your content has been saved.')
            .ariaLabel('Success')
            .ok('Got it!');
        $mdDialog.show(confirm).then(function() {
            $location.path('/diesel');

        }, function() {

        });
    };

    $scope.showError = function() {
        var confirm = $mdDialog.alert()
            .title('Error!')
            .content('we seem to have encountered something mysterious, please try again')
            .ariaLabel('Success')
            .ok('Ok');
        $mdDialog.show(confirm).then(function() {

        }, function() {

        });
    };

    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Would you like to save information?')
            //.content('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Lucky day')
            .ok('confirm!')
            .cancel('cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            $scope.user.Consultant = consultant.getConsultant().Id;

            var DateReceived = $scope.user.DateReceived;
            $scope.user.DateReceived = Date.parse(DateReceived);

			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-dieselReceived-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postDieselReceived($localstorage.getObject($scope.localStorageRecordId))
                .success(function(data){
					// What is this for as message is returned
                    // $rootScope.message = 'Your information has been successfully saved';
					if(data.Status == "Ok"){
						console.log("data.localStorageRecordId: " + data.localStorageRecordId);
						$localstorage.removeObject(data.localStorageRecordId);
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showComplete();
					}
					else{
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showError();
					}
                }).
                error(function (error) {
                    $rootScope.message = 'error saving information please try again';
                    //console.log("error posing:" + error);
                    $rootScope.loading = false;
                });
			}
			else{
                    $rootScope.message = 'You are not connected to the internet, when you connect again, it will retry';
                    $rootScope.loading = false;
			}

        }, function() {

        });
    };

}]);

app.controller('CaptureTankDieselCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork){
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.dateClicked = false;
    $scope.updateDate = function(item) {
        var newDate = item;
        $scope.currentDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDay();
    };

    //confiramtion alert
    $scope.showComplete = function() {
        var confirm = $mdDialog.alert()
            .title('Success!')
            .content('All your content has been saved.')
            .ariaLabel('Success')
            .ok('Got it!');
        $mdDialog.show(confirm).then(function() {
            $location.path('/diesel');

        }, function() {

        });
    };

    $scope.showError = function() {
        var confirm = $mdDialog.alert()
            .title('Error!')
            .content('we seem to have encountered something mysterious, please try again')
            .ariaLabel('Success')
            .ok('Ok');
        $mdDialog.show(confirm).then(function() {

        }, function() {

        });
    };

    $scope.showConfirm = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Would you like to save information?')
            //.content('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Lucky day')
            .ok('confirm!')
            .cancel('cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $rootScope.loading = true;

            $scope.user.Consultant = consultant.getConsultant().Id

            var DateCaptured = $scope.user.DateCaptured;
            $scope.user.DateCaptured = Date.parse(DateCaptured);

            if ($scope.user.readingType == "true" || $scope.user.readingType == true)
                $scope.user.readingType = "Morning";
            else
                $scope.user.readingType = "Evening";
			
			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-dieselTankReading-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postDieselTankReading($localstorage.getObject($scope.localStorageRecordId))
                .success(function(data){
					// What is this for as message is returned
                    // $rootScope.message = 'Your information has been successfully saved';
					if(data.Status == "Ok"){
						console.log("data.localStorageRecordId: " + data.localStorageRecordId);
						$localstorage.removeObject(data.localStorageRecordId);
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showComplete();
					}
					else{
						$rootScope.message = data.Message;
						$rootScope.loading = false;
                        $scope.showError();
					}
                }).
                error(function (error) {
                    $rootScope.message = 'error saving information please try again';
                    //console.log("error posing:" + error);
                    $rootScope.loading = false;
                });
			}
			else{
                    $rootScope.message = 'You are not connected to the internet, when you connect again, it will retry';
                    $rootScope.loading = false;
			}


        }, function() {

        });
    };

}]);