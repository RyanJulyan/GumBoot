
app.factory('API', ['$http', function ($http) {

    var apiURI = "http://gumboot.dev-staging.co.za/umbraco/api/";

    return {
        /*
        |---------------------------------------
        | Login & General API Call
        |---------------------------------------
         */
        postConsultantLoginID: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Consultant/LoginById/',
                method: "POST",
                data: $.param({ 'id': id }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        getServices: function () {
            return $http.get(apiURI+'Services/GetServices/');
        },


        /*
        |---------------------------------------
        | Contract Services Call
        |---------------------------------------
         */
        getContractByID: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Contract/GetContractById/',
                method: "GET",
                data: $.param({ 'id': id }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        getContractByConsultantID: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Contract/GetContractByConsultantId/',
                method: "GET",
                data: $.param({ 'id': id }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        getAllContracts: function () {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Contract/GetAll/',
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },

        /*
        |---------------------------------------
        | Plant Services Call
        |---------------------------------------
         */
        getPlantByConsultantID: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Plant/GetByConsultantId/' + id,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        getPlantHirerAll: function () {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'PlantHirer/GetAll/',
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        getPlantHirer: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'PlantHirer/GetHirer/' + id,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },

        getPlantType: function () {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Plant/GetPlantTypes/',
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        GetPlantById: function (id) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Plant/GetPlantById/' + id,
                method: "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        postPlant: function (PostPlant) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Plant/PostPlant/',
                method: "POST",
                data: $.param(PostPlant),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        postReturnPlant: function (ReturnPlant) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Plant/PostReturnPlant/',
                method: "POST",
                data: $.param(ReturnPlant),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        
        /*
        |---------------------------------------
        | Diesel Services Call
        |---------------------------------------
         */
        postDieselTankReading: function (DieselTank) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Diesel/TankReading/',
                method: "POST",
                data: $.param(DieselTank),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        postDieselReceived: function (DieselReceived) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Diesel/Received/',
                method: "POST",
                data: $.param(DieselReceived),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        postDieselSentOut: function (SentOut) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'Diesel/SentOut/',
                method: "POST",
                data: $.param(SentOut),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },

        /*
        |---------------------------------------
        | Capture Consultant Time Services Call
        |---------------------------------------
        */
        postCaptureTime: function (CaptureTime) {
            return $http({
                headers: { 'Content-Type': 'application/json' },
                url: apiURI + 'CaptureTime/PlantUsage/',
                method: "POST",
                data: $.param(CaptureTime),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }

    };
}]);

app.factory('$localstorage', ['$window', '$rootScope', 'API',  '$cordovaNetwork', function($window, $rootScope, API, $cordovaNetwork) {
    return {
        set: function(key, value) {
            window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse(window.localStorage[key] || '{}');
        },
        removeObject: function (key) {
            window.localStorage.removeItem(key);
        },
		cloudSaveLocalStorage: function (){
			if(navigator.onLine){
				var userData = JSON.parse(window.localStorage['user']);
				for(obj in window.localStorage){
					if(obj.indexOf('-') != -1){
						var firstDash = obj.indexOf('-');
						var userID = obj.substring(0,firstDash);
							secondObj = obj.substring(firstDash+1);
							secondDash = secondObj.indexOf('-');
							updateTypeObj = secondObj.substring(0, secondDash);
							if(updateTypeObj == "plant"){
								API.postPlant(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send plant ID: ' + obj);
							}
							else if(updateTypeObj == "returnPlant"){
								API.postReturnPlant(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send returnPlant ID: ' + obj);
							}
							else if(updateTypeObj == "captureTime"){
								API.postCaptureTime(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send captureTime ID: ' + obj);
							}
							else if(updateTypeObj == "dieselSentOut"){
								API.postDieselSentOut(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send dieselSentOut ID: ' + obj);
							}
							else if(updateTypeObj == "dieselReceived"){
								API.postDieselReceived(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send dieselReceived ID: ' + obj);
							}
							else if(updateTypeObj == "dieselTankReading"){
								API.postDieselTankReading(JSON.parse(window.localStorage[obj]))
								.success(function(data){
									// What is this for as message is returned
									// $rootScope.message = 'Your information has been successfully saved';
									if(data.Status == "Ok"){
										window.localStorage.removeItem(data.localStorageRecordId);
										$rootScope.message = data.Message;
										$rootScope.loading = false;
									}
									else{
										$rootScope.message = 'error saving information please try again';
										$rootScope.loading = false;
									}
								}).
								error(function (error) {
									$rootScope.message = 'error saving information please try again';
									//console.log("error posing:" + error);
									$rootScope.loading = false;
								});
								
								console.log('Send dieselTankReading ID: ' + obj);
							}
					}
				}
			}
			else{
				$rootScope.message = 'You are not connected to the internet, when you connect again, it will try to sync to the cloud';
				$rootScope.loading = false;
			}
		}
    }
}]);