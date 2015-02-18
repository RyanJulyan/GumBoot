//Application Services Factory
app.service('appServices', ['$localstorage', function ($localstorage) {
    var services = $localstorage.getObject("appServices");
    var plantHirerService = $localstorage.getObject('PlantHirerList');

    return {
        timeServiceList: function () {
            return services.timeServiceList;
        },

        dieselCaptureServiceList: function () {
            return services.dieselCaptureServiceList;
        },

        dieselReadingServiceList: function () {
            return services.dieselReadingServiceList;
        },

        dieselTankServiceList: function () {
            return services.dieselTankServiceList;
        },

        //Populate Weather Searvices List
        weatherServiceList: function () {
            return services.weatherServiceList;
        },

        timeTypeServiceList: function () {
            return services.timeTypeServiceList;
        },

        //Populate PlantItems Services List
        plantTypes: function () {
            var items = [];
            for (var i = 0; i < services.plantTypes.length; i++) {
                items.push({
                    Name: services.plantTypes[i].Name,
                    Id: services.plantTypes[i].Id
                });
            }

            return items;
        },

        plantTypeModels: function (Id) {
            var items = [];
            for (var x in services.plantTypes) {
                if (services.plantTypes[x].Id == Id) {
                    for (var y in services.plantTypes[x].Models)
                    {
                        items.push({
                            Name: services.plantTypes[x].Models[y].Name,
                            Id: services.plantTypes[x].Models[y].Id
                        });
                    }
                }
            }

            return items;
        },

        plantHirerList: function () {
            return plantHirerService;
        },

        getPlantHirer: function (Id) {
            for (var x in plantHirerService) {
                if (plantHirerService[x].Id == Id) {
                    return plantHirerService[x];
                }
            }
        }
    };
}]);