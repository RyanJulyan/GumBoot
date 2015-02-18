app.controller('PlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', '$cordovaNetwork', 'consultant', function($scope, $rootScope, $mdDialog, API, $localstorage, $cordovaNetwork, consultant){
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Select the process you would like to complete';

    // Get plants created by consultant
    API.getPlantByConsultantID(consultant.getConsultant().Id).success(function (data, status) {
        if (data.length > 0) {
            $scope.activeTimes = true;
        }
        else {
            $scope.activeTimes = false;
        }
    }).error(function (data, status) {

    });
    
    $scope.handlePlantpages = function(target) {
        $rootScope.loading = true;
        $scope.navOption = target;

        return $scope.navOption;
    };
}]);

app.controller('ReceivePlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork) {

    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.currentSite = $rootScope.userData.CurrentSiteName;

    $scope.user = {};
	
    $scope.itemList = [];
    $scope.modelList = [];
    $scope.hirerList = [];
    $scope.itemList = appServices.plantTypes();
    $scope.weatherList = appServices.weatherServiceList();
    $scope.hirerList = appServices.plantHirerList();
    $scope.isEmpty = false;
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.dateClicked = false;
    $scope.updateDate = function(item) {
        var newDate = item;
        $scope.currentDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDay();
    };
    //Plant Type onChange even handler
    $scope.changeModelItem = function(item) {
        $scope.modelList = appServices.plantTypeModels(item);
    };

    $scope.checkDiesel = function(option) {
        console.log(option);
        if (option == true) {
            $scope.tank = true;
            $scope.isEmpty = false;
        }
        else {
            $scope.tank = false;
            $scope.isEmpty = true;
            var field = document.getElementById("litres-filled");
            angular.element(field).focus();

        }
    };

    //confirmation alert
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
            $scope.user.ConsultantId = consultant.getConsultant().Id;
            $scope.user.ContractId = consultant.getConsultant().CurrentSiteId;

            //var DateReceived = $scope.user.DatePlantReceived;
            //
			//console.log('------DateReceived------');
			//console.log(DateReceived);
            // $scope.user.DatePlantReceived = DateReceived.getFullYear() + '/' + (DateReceived.getMonth() + 1) + '/' + DateReceived.getDay();

            var DateReceived = $scope.user.DateReceived;
            $scope.user.DateReceived = Date.parse(DateReceived);
			
			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-plant-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postPlant($localstorage.getObject($scope.localStorageRecordId))
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

app.controller('UpdatePlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork) {
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.consultantPlants = {};
    $scope.plant = {};
    $scope.weatherList = appServices.weatherServiceList();
    $scope.currentDate = new Date().toISOString().substring(0, 10);

    // Get plants created by consultant
    API.getPlantByConsultantID(consultant.getConsultant().Id).success(function (data, status) {
        $scope.consultantPlants = data;
    }).error(function(data, status){
        //console.log(status)
    });

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

    //Dropdown event handler
    $scope.changeModelItem = function (item) {
        //Populate plant with a selected Plant Received
        for (var x in $scope.consultantPlants) {
            if ($scope.consultantPlants[x].Id == item)
            {
                //create a plant Object
                $scope.plant = $scope.consultantPlants[x];
                $scope.user = $scope.consultantPlants[x];

                /*$scope.user.Reference = $scope.plant.Reference;
                $scope.user.Rate = parseFloat($scope.plant.Rate);
                $scope.user.WeatherTerm = $scope.plant.WeatherTerm;*/

                $scope.user.Hirer = appServices.getPlantHirer($scope.plant.Hirer).Name;
                break;
            }
        }
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

            $scope.user.ConsultantId = $rootScope.userData.Id;
            $scope.user.ContractId = $scope.currentSite;

			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-plant-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postPlant($localstorage.getObject($scope.localStorageRecordId))
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

app.controller('ReturnPlantCtrl', ['$scope', '$rootScope', '$mdDialog', 'API', '$localstorage', 'appServices', 'consultant', '$location', '$cordovaNetwork', function ($scope, $rootScope, $mdDialog, API, $localstorage, appServices, consultant, $location, $cordovaNetwork) {
    $rootScope.isHome = false;
    $rootScope.isPage = true;
    $rootScope.loading = false;
    $rootScope.message = 'Please note that the grey areas cannot be edited';
    $scope.user = {};
    $scope.consultantPlants = {};
    $scope.plant = {};
    $scope.isEmpty = false;
    $scope.weatherList = appServices.weatherServiceList();
    $scope.currentDate = new Date().toISOString().substring(0, 10);
    $scope.user.DieselInTank = true;
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
                $scope.user = $scope.consultantPlants[x];
                $scope.user.Hirer = appServices.getPlantHirer($scope.plant.Hirer).Name;
                break;
            }
        }
    };

    //confirmation alert
    $scope.showComplete = function() {
        var confirm = $mdDialog.alert()
            .title('Success!')
            .content('All your content has been saved.')
            .ariaLabel('Success')
            .ok('Got it!');
        $mdDialog.show(confirm).then(function() {
            if ($scope.user.swapout = 'true'){
                $location.path('/plant/receive-plant');
            }
            else {
                $location.path('/plant');
            }


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

            $scope.user.ConsultantId = $rootScope.userData.Id;
            $scope.user.ContractId = $rootScope.userData.CurrentSiteName;

            var DateReceived = $scope.user.DatePlantReturned;
            $scope.user.DatePlantReturned = DateReceived.getFullYear() + '/' + (DateReceived.getMonth() + 1) + '/' + DateReceived.getDay();

			// create Unique Timestamped Id
			var d = new Date();
			var n = d.getTime();
			
			$scope.localStorageRecordId = $scope.user.ConsultantId + "-returnPlant-" + n;
			$scope.user.localStorageRecordId = $scope.localStorageRecordId;
			
			$localstorage.setObject($scope.localStorageRecordId, $scope.user);
			
			if(navigator.onLine){
				// console.log("isOnline");
				// console.log($localstorage.getObject($scope.localStorageRecordId));
				API.postReturnPlant($localstorage.getObject($scope.localStorageRecordId))
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