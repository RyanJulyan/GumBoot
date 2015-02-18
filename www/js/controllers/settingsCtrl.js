app.controller('notificationCtrl', function($scope, $rootScope, $mdToast) {
    $scope.notification = $rootScope.message;
    $scope.closeToast = function() {
        $mdToast.hide();
    };
});
app.controller('SideNavCtrl', function($scope, $timeout, $mdSidenav, $log, $location, $localstorage) {
    $scope.items = [
        { name: 'Home', class: 'home', link:'home', icon: 'share' },
        { name: 'Plant', class: 'optionsplant', link:'plant', icon: 'upload' },
        { name: 'Diesel', class: 'optionsdiesel', link:'diesel', icon: 'copy' },
        { name: 'Request Login', class: 'settings', link:'', icon: 'print' },
        { name: 'Logout', class: 'logout', link:'', icon: 'print' },
    ];
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];

        if (clickedItem.name == 'Logout') {
            $mdSidenav('left').close();
            navigator.app.exitApp();
        }
        else if(clickedItem.name == 'Request Login') {
            $localstorage.removeObject("user");
            $mdSidenav('left').close()
        }
        else {
            $location.path(clickedItem.link);
            $mdSidenav('left').close()
        }
    };
    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function(){
                //$log.debug("close RIGHT is done");
            });
    };
});
