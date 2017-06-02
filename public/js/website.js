angular.module('website', ['ngRoute','chart.js','ngFlash']).
    config(function ($routeProvider,ChartJsProvider,FlashProvider) {
        $routeProvider.
            when('/acadmeics', {templateUrl: 'partials/acadmeics.html', controller: 'acadmeicsCtrl'}).
            when('/contact', {templateUrl: 'partials/contact.html', controller: 'contactCtrl'}).
            when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'}).
            when('/work-experience', {templateUrl: 'partials/workExperience.html', controller: 'workExperienceCtrl'}).
            when('/skills', {templateUrl: 'partials/skills.html', controller: 'skillsCtrl'}).
            when('/feedback', {templateUrl: 'partials/feedback.html', controller: 'feedbackCtrl'}).
            otherwise({redirectTo: '/home'});
        
        ChartJsProvider.setOptions({
        	legend: {
                display: true,
                position : "right"
            },
            chartColors: ['#330099', '#000066','#6996AD','#0D4F8B','#003F87','#236B8E','#75A1D0','#344152',
				'#003333','#333300','#006633','#003399','#000099','#003366','#003333','#333366','#333399']
           });

         // FlashProvider.setTemplatePreset('transclude');
    })
    .controller('feedbackCtrl', function ($scope,$http,$location,storageService) {
        $scope.labels = [];
        $scope.data = [];
        $scope.rating = 3;
        $scope.ratings = [{
            current: 3,
            max: 5
        }];

       $scope.getSelectedRating = function (rating) {
            $scope.rating = rating;
            $scope.feedbackObj.rating = $scope.rating;
        }
        $http.get('/feedback').success(function(response) {
            if(response!==null){
                $scope.feedbackCount = response.length;
            }
        });

        $scope.feedbackObj = {};
        $scope.feedbackObj.rating = $scope.rating;
        $scope.submitFeedack = function (feedbackObj){
          $http.post('/feedback',feedbackObj).then(function(response) {
              if(response!==null && response.status===200){
                $location.path( "/home" );
                var sharedData = {};
                sharedData.page = 'feedback';
                sharedData.message = 'Your feedback has been submitted successfully';
                storageService.set(sharedData);
              }else{
                $scope.error = 'Some error occured please try again.'
              }
        });

        }
       
    })
    .controller('acadmeicsCtrl', function ($scope,$http) {
        $scope.labels = [];
        $scope.data = [];
        
        $http.get('./details.json').success(function(response) {
            if(response!==null){
            	angular.forEach(response.acads,function(data){
            		$scope.labels.push(data.id);
            		$scope.data.push(data.value);
            	});
            }else{
            	$scope.about = 'Sorry the website is offline. Please try after sometime'
            }
            $scope.type = 'pie';
            $scope.toggle = function () {
                $scope.type = $scope.type === 'pie' ?
                  'polarArea' : 'pie';
            };
        });
       
    })
    .controller('workExperienceCtrl', function ($scope,$http) {
        $scope.title = 'Work Experience';
        $scope.labels = [];
        $scope.data = [];
        $scope.options = {
     		   legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Technology',
                            fontFamily: "Montserrat",
                            fontSize :20
                          }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Experience in months',
                            fontFamily: "Montserrat",
                            fontSize :20
                          }
                    }]
                },
//                chartColors: ['#330099', '#000066','#6996AD','#0D4F8B','#003F87','#236B8E','#75A1D0','#344152',
//                				'#003333']
         }  
        $http.get('./details.json').success(function(response) {
            if(response!==null){
            	angular.forEach(response.workExperience,function(data){
            		$scope.labels.push(data.id);
            		$scope.data.push(data.value);
            	});
            }else{
            	$scope.about = 'Sorry the website is offline. Please try after sometime'
            }
        });
       
    })
    .controller('skillsCtrl', function ($scope,$http) {
        $scope.title = 'Skills';
        $scope.labels = [];
        $scope.data = [];
   
        $scope.options = {
    		   legend: {
                   display: false
               },
               scales: {
                   xAxes: [{
                       stacked: true,
                       scaleLabel: {
                           display: true,
                           labelString: 'Rating',
                           fontFamily: "Montserrat",
                           fontSize :20
                         }
                   }],
                   yAxes: [{
                       stacked: true,
                       scaleLabel: {
                           display: true,
                           labelString: 'Technology',
                           fontFamily: "Montserrat",
                           fontSize :20
                         }
                   }]
               }
        }  
        $http.get('./details.json').success(function(response) {
            if(response!==null){
            	angular.forEach(response.skills,function(data){
            		$scope.labels.push(data.id);
            		$scope.data.push(data.value);
            	});
            }else{
            	$scope.about = 'Sorry the website is offline. Please try after sometime'
            }
        });
       
    })
    .controller('contactCtrl', function ($scope,$http) {
    	$scope.title = 'Contact Me'
    	 var mainInfo = null;
         $http.get('./details.json').success(function(data) {
             mainInfo = data;
             if(mainInfo!==null){
            	 if(mainInfo.contact!==null){
            		 $scope.email = mainInfo.contact.email;
            		 $scope.mobile = mainInfo.contact.mobile;
            	 }    	
             }else{
             	$scope.about = 'Sorry the website is offline. Please try after sometime'
             }
         });
    	
    })
    .controller('HomeCtrl', function ($scope,$http,storageService,Flash) {
        $scope.title = 'Home';
        var mainInfo = null;
        $http.get('./details.json').success(function(data) {
            mainInfo = data;
            if(mainInfo!==null){
            	$scope.about = mainInfo.about;
            }else{
            	$scope.about = 'Sorry the website is offline. Please try after sometime'
            }
        });
        

        $scope.labels = ['1 Star Rating','2 Star Rating', '3 Star Rating','4 Star Rating','5 Star Rating'];
        $scope.data = [];
        
        var count1Star = 0;
        var count2Star = 0;
        var count3Star = 0;
        var count4Star = 0;
        var count5Star = 0;

        $http.get('/feedback').success(function(response) {
            if(response!==null){
              $scope.feedbackCount =response.length;
              angular.forEach(response,function(feedbackObj){
                  if(feedbackObj!==null){
                      if(feedbackObj.rating===1){
                        count1Star++;
                      }else if(feedbackObj.rating===2){
                        count2Star++;
                      }else if(feedbackObj.rating===3){
                        count3Star++;
                      }else if(feedbackObj.rating===4){
                        count4Star++;
                      }else if(feedbackObj.rating===5){
                        count5Star++;
                      }
                  }
              });
              $scope.data.push(count1Star);
              $scope.data.push(count2Star);
              $scope.data.push(count3Star);
              $scope.data.push(count4Star);
              $scope.data.push(count5Star);
            }else{
              $scope.about = 'Sorry the website is offline. Please try after sometime'
            }
        });

        var sharedData = storageService.get();
        if(sharedData!==null && sharedData.page!==undefined && sharedData.page!==null){
            if(sharedData.message!==null && sharedData.message!==undefined){
                $scope.feedbackSuccessFlag = true;
                $scope.feedbackSuccessMsg = sharedData.message;
                successAlert();
                storageService.set(null);
            }
        }
         function successAlert() {
            var message = '<strong>Thank you!</strong> Your feedback has been received.';
            Flash.create('success', message);
         };
        
    })
    .directive('menu', function(){
        
        return {
            scope: true,
            restrict: 'A',
            templateUrl:'./partials/menus.html'
            }
    })
    .directive('tabImage', function(){
        
        return {
            scope: true,
            restrict: 'A',
            templateUrl:'./partials/tabImage.html',
        }
    })
    .directive('footer', function(){
        
        return {
            scope: true,
            restrict: 'A',
            templateUrl:'./partials/footer.html'
            }
    })
    .directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
  })
  .factory('storageService', function() {
     var savedData = {}
     function set(data) {
       savedData = data;
     }
     function get() {
      return savedData;
     }

     return {
      set: set,
      get: get
     }

});
    