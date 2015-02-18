// can probably create a generic controller for all forms
app.controller('CaptureStartTimePlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork) {
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.timeList = [];
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.timeList = appServices.timeTypeServiceList();
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

    $scope.changeModelItem = function(item) {
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
            $location.path('/plant');

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

            $scope.user.Consultant = consultant.getConsultant().Id;
            $scope.user.CaptureTimeType = appServices.timeServiceList()[0].Id

            // create Unique Timestamped Id
            var d = new Date();
            var n = d.getTime();

            $scope.localStorageRecordId = $scope.user.ConsultantId + "-captureTime-" + n;
            $scope.user.localStorageRecordId = $scope.localStorageRecordId;

            $localstorage.setObject($scope.localStorageRecordId, $scope.user);

            if(navigator.onLine){
                // console.log("isOnline");
                // console.log($localstorage.getObject($scope.localStorageRecordId));
                API.postCaptureTime($localstorage.getObject($scope.localStorageRecordId))
                    .success(function(data){
                        // What is this for as message is returned
                        // $rootScope.message = 'Your information has been successfully saved';
                        if(data.Status == "Ok"){
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

app.controller('CaptureStopTimePlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork){
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.timeList = [];
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.timeList = appServices.timeTypeServiceList();
    $scope.dateClicked = false;
    $scope.updateDate = function(item) {
        var newDate = item;
        $scope.currentDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDay();
    };

    // Get plants created by consultant
    API.getPlantByConsultantID(consultant.getConsultant().Id).success(function (data, status) {
        $scope.consultantPlants = data;
    }).error(function (data, status) {
        console.log(status)
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
            $location.path('/plant');

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

            $scope.user.Consultant = consultant.getConsultant().Id;
            $scope.user.CaptureTimeType = appServices.timeServiceList()[1].Id

            var DateReceived = $scope.user.ActivityDate;
            $scope.user.ActivityDate = Date.parse(DateReceived);

			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-captureTime-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postCaptureTime($localstorage.getObject($scope.localStorageRecordId))
                .success(function(data){
					// What is this for as message is returned
                    // $rootScope.message = 'Your information has been successfully saved';
					if(data.Status == "Ok"){
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