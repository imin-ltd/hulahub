"use strict";window.localStorage.removeItem("session.accessToken"),window.localStorage.removeItem("session.refreshToken"),window.localStorage.removeItem("session.currentUser");var app=angular.module("hulahubSEO",["config","ui.bootstrap","ngFacebook","ngMessages","slickCarousel","angucomplete-alt","daterangepicker","ngclipboard","hulahubShared"]);app.config(function($facebookProvider,$interpolateProvider,$uibTooltipProvider){$facebookProvider.setAppId("1727725177448781"),$facebookProvider.setVersion("v2.12"),$facebookProvider.setPermissions(["email","user_location","user_birthday","user_friends"]),$interpolateProvider.startSymbol("{[").endSymbol("]}"),$uibTooltipProvider.options({appendToBody:!0})}),app.run(function($rootScope,AnalyticsService,IntercomService,AlertService,StorageService){function disableTab(e){9===e.keyCode&&e.preventDefault()}$rootScope.alert=AlertService,$rootScope.clearBrowseSession=function($event){$event.preventDefault(),StorageService.removeItem("hh-activity-search"),window.location=$event.target.href},AnalyticsService.run(),$rootScope.$on("showLoading",function(){var $body=$("body");$body.is(".loading")||($(document).keydown(disableTab),$body.addClass("loading").append('<div class="pageLoadingSpinner loadingSpinner wink whiteBG"></div>'))}),$rootScope.$on("hideLoading",function(){$(document).unbind("keydown",disableTab),$("body").removeClass("loading"),$(".pageLoadingSpinner").remove()}),document.getElementById("facebook-jssdk")||(!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];d.getElementById(id)||(js=d.createElement(s),js.id=id,js.src="//connect.facebook.net/en_US/sdk.js",fjs.parentNode.insertBefore(js,fjs))}(document,"script","facebook-jssdk"),IntercomService.boot())}),app.factory("SEOService",function($templateCache){return{convertAngularToSEOBraces:function(templateURL){return $templateCache.get(templateURL).replace(/\{\{/g,"{[").replace(/\}\}/g,"]}")}}}),angular.module("hulahubSEO").controller("SEOActivityController",function($scope,$rootScope,$uibModal,$facebook,appSettings,StorageService,AnalyticsService,SEOService,IntercomService,ParameterService,TrackingService){$scope.bookOffsiteActivity=function(){AnalyticsService.sendUserBehaviourEvent("Booking Flow - Offsite - Start")},$scope.init=function(seriesHashId,activityTitle,groupSizeMin,groupSizeMax,nextInstanceHashId,isFlexible,isRepeating,activityUrl){TrackingService.trackActivityPageView(seriesHashId),$scope.activity={id:seriesHashId,title:activityTitle,groupSizeMin:groupSizeMin,groupSizeMax:groupSizeMax,url:activityUrl,nextInstance:nextInstanceHashId,flexible:isFlexible},isFlexible?$scope.bookFlexibleActivity=function(){AnalyticsService.sendUserBehaviourEvent("Booking Flow - HH - Availability"),$uibModal.open({template:SEOService.convertAngularToSEOBraces("booking-requests/views/flexible-booking-form.html"),controller:"FlexibleBookingFormModalController",resolve:{data:function(){return{activity:$scope.activity}}}})}:isRepeating&&($scope.bookRepeatingActivity=function(){AnalyticsService.sendUserBehaviourEvent("Booking Flow - HH - Availability"),$uibModal.open({template:SEOService.convertAngularToSEOBraces("activities/views/partials/repeat-activity-booking-form.html"),controller:"RepeatActivityBookingFormModalController",resolve:{data:function(){return{activity:$scope.activity}}}})})},$scope.storeParameters=function(parameters,hostOrJoiner){parameters.hostOrJoiner=hostOrJoiner,ParameterService.setData(parameters),angular.isDefined(parameters["host-intro"])&&StorageService.setItem("hostIntro",parameters["host-intro"],!0)},$scope.scrollTo=function(elementId){scrollToElement(elementId)},$scope.initMap=function(latitude,longitude,meetingPoint,flexibleLocationDistance){var mapCenter={lat:parseFloat(latitude),lng:parseFloat(longitude)},map=document.getElementById("map");if(map){var gMap=new google.maps.Map(map,{zoom:15,center:mapCenter,options:{maxZoom:16,scrollwheel:!1,mapTypeControl:!1,streetViewControl:!1,styles:appSettings.mapStyles}});if(null===flexibleLocationDistance&&"private"!==meetingPoint)new google.maps.Marker({map:gMap,position:mapCenter,icon:new google.maps.MarkerImage("/img/maps/light-blue.png",null,null,null,new google.maps.Size(40,40))});else{var circle=new google.maps.Circle({strokeWeight:0,fillColor:"#06A2DD",fillOpacity:.35,map:gMap,center:mapCenter,radius:flexibleLocationDistance?flexibleLocationDistance*appSettings.distanceMultiplier:appSettings.distanceMultiplier});gMap.fitBounds(circle.getBounds())}}},$scope.shareActivity=function(shareText){$uibModal.open({template:SEOService.convertAngularToSEOBraces("core/partials/share-modal.html"),controller:"ShareModalController",resolve:{data:function(){return{id:$scope.activity.id,idName:"activity_id",title:"Share "+$scope.activity.title,url:$scope.activity.url,text:shareText,intercomEventName:"shared-activity"}}}})},$scope.sendIntercomShareEvent=function(channel){IntercomService.sendEvent("shared-activity",{channel:channel,activity_id:$scope.activity.id,url:$scope.activity.url})},$scope.shareFacebook=function(){$scope.sendIntercomShareEvent("facebook"),$rootScope.$broadcast("showLoading"),$facebook.ui({method:"share",href:$scope.activity.url}).then(function(){$rootScope.$broadcast("hideLoading")},function(err){$rootScope.$broadcast("hideLoading")})},$scope.onClipboardSuccess=function(){$scope.linkCopiedToClipboard=!0},$scope.slickConfig={dots:!0,autoplay:!0,autoplaySpeed:5e3,pauseOnFocus:!1,pauseOnHover:!1,prevArrow:'<div class="button prevButton"><i class="fas fa-angle-left"></i></div>',nextArrow:'<div class="button nextButton"><i class="fas fa-angle-right"></i></div>'},$scope.openPhotoGallery=function(){$("#photoGalleryLightbox a").simpleLightbox({docClose:!1,disableRightClick:!0}).open()}}),angular.module("hulahubSEO").controller("SEOCallbackController",function($scope,$timeout,AnalyticsService,CallBackService){function validateCallBackForm(formName){return $scope.callBackValidationRun=!0,$scope[formName].$valid}var today=moment();today.isoWeekday()>=6&&today.weekday(8);var currentHour=today.hour();today.minutes()>30&&currentHour++,currentHour>=17&&(today.isoWeekday()>=5?today.weekday(8):today.add(1,"days")),today=today.startOf("day").toDate(),$scope.callTimeSlots=[{id:10,name:"10:00 - 11:00"},{id:11,name:"11:00 - 12:00"},{id:12,name:"12:00 - 13:00"},{id:13,name:"13:00 - 14:00"},{id:14,name:"14:00 - 15:00"},{id:15,name:"15:00 - 16:00"},{id:16,name:"16:00 - 17:00"},{id:17,name:"17:00 - 18:00"}];var actualToday=new Date;actualToday.setHours(0,0,0,0),$scope.showTimeSlot=function(timeSlot){return $scope.callBackFormData.dateToCall.getTime()!=actualToday.getTime()||timeSlot.id>currentHour},$scope.callBackFormData={dateToCall:today,timeToCall:"",serialized:function(){return{firstName:this.firstName,lastName:this.lastName,phoneNumber:this.phoneNumber,email:this.email?this.email:null,timeToCall:this.getCallTime().format("YYYY-MM-DD HH:mm:ss")}},getCallTime:function(){return moment(this.dateToCall.setHours(this.timeToCall))},clear:function(){this.dateToCall=today,this.timeToCall="",this.firstName=null,this.lastName=null,this.phoneNumber=null,this.email=null}},$scope.requestCallBack=function(formName){$scope.callBackFormErrors=null,$scope.callBackConfirmMessage=null,validateCallBackForm(formName)&&($scope.sendingCallBackRequest=!0,CallBackService.request($scope.callBackFormData.serialized(),function(response){AnalyticsService.sendGoalEvent("300 - Host enquiry",null),AnalyticsService.trigger("Lead",{type:"request callback"}),$scope.sendingCallBackRequest=!1;var callTime=$scope.callBackFormData.getCallTime(),oneHour=callTime.clone().add(1,"hours");$scope.callBackConfirmMessage="Call back scheduled for "+callTime.format("DD/MM/YYYY [between] HH:mm")+oneHour.format(" - HH:mm")+".",$scope.callBackFormData.clear(),$scope.callBackValidationRun=!1},function(errorResponse){$scope.sendingCallBackRequest=!1,$scope.callBackFormErrors=errorResponse.errors}))},$timeout(function(){var callBackDatePicker=$(".callBackDatePicker");callBackDatePicker.datepicker({maxViewMode:"days",startDate:today,daysOfWeekDisabled:[0,6],autoclose:!0,format:"dd/mm/yyyy",orientation:"bottom auto",weekStart:1}).on("changeDate",function(selected){$scope.callBackFormData.dateToCall=new Date(selected.date.valueOf()),$scope.callBackFormData.timeToCall="",$scope.$$phase||$scope.$apply()}),callBackDatePicker.datepicker("setDate",today)},0)}),angular.module("hulahubSEO").controller("SEOInterestListingController",function($scope,ENV){$scope.gotoInterestPage=function(){redirectToPage(ENV,"/activities/"+$scope.selectedInterest.slug)}}),angular.module("hulahubSEO").controller("SEOJoinChatController",function($scope,$rootScope,$timeout,ENV,AnalyticsService,FormService,PublicPageService,UserService,AuthService,ParameterService){function scrollChatToBottom(){$timeout(function(){var chatWindow=$(".step:visible .chatBubbles");chatWindow.animate({scrollTop:chatWindow[0].scrollHeight},"fast")},0)}$scope.currentStep="intro",$scope.init=function(interestLevel,content,location){"interest"===interestLevel&&$scope.formData.interests.push({id:content.id,name:content.name}),location&&$scope.formData.locations.push({latitude:+location.latitude,longitude:+location.longitude,name:location.name})},$scope.formData={interests:[],locations:[],dateOfBirth:FormService.controls().dateOfBirth(null,!0),gender:"u",fullName:null,firstName:null,lastName:null,email:null,addInterest:function(){this.interests.push({id:$scope.interestAutoComplete.id,name:$scope.interestAutoComplete.name}),$scope.$broadcast("angucomplete-alt:clearInput"),$scope.interestAutoComplete=null,scrollChatToBottom()},removeInterest:function(index){this.interests.splice(index,1),scrollChatToBottom()},addLocation:function(){this.locations.push({latitude:$scope.locationAutoComplete.latitude,longitude:$scope.locationAutoComplete.longitude,name:$scope.locationAutoComplete.name}),$scope.locationAutoComplete=null,scrollChatToBottom()},removeLocation:function(index){this.locations.splice(index,1),scrollChatToBottom()},clearDOB:function(){this.dateOfBirth.clear()},setName:function(){if($scope.nameSubmitted=!0,this.fullName){var lastIndex=this.fullName.lastIndexOf(" ");lastIndex===-1||(this.firstName=this.fullName.substr(0,lastIndex),this.lastName=this.fullName.substr(lastIndex))}},clearName:function(){$scope.nameSubmitted=!1,this.fullName=null,this.firstName=null,this.lastName=null},setEmail:function(){$scope.emailSubmitted=!0,$scope.existingUser=!1,this.emailText&&($rootScope.$broadcast("showLoading"),UserService.checkEmail(this.emailText,function(){$scope.emailForm.email.$setValidity("mxCheck",!0),$scope.formData.email=$scope.formData.emailText,$rootScope.$broadcast("hideLoading")},function(response){409===response.status?$scope.existingUser=!0:$scope.emailForm.email.$setValidity("mxCheck",!1),$rootScope.$broadcast("hideLoading")}))},clearEmail:function(){$scope.emailSubmitted=!1,$scope.existingUser=!1,this.email=null,this.emailText=null},quickMatch:function(){$rootScope.$broadcast("showLoading"),PublicPageService.getQuickMatchCount({interests:_.map(this.interests,"id"),locations:this.locations,dateOfBirth:this.dateOfBirth.getValue(),gender:this.gender},function(response){$scope.quickMatchCount=response.count,$scope.currentStep="email",$rootScope.$broadcast("hideLoading")},function(){$scope.quickMatchCount=0,$scope.currentStep="email",$rootScope.$broadcast("hideLoading")})},register:function(){$rootScope.$broadcast("showLoading"),UserService.quickRegister({interests:_.map(this.interests,"id"),locations:this.locations,dateOfBirth:this.dateOfBirth.getValue(),gender:this.gender,firstName:this.firstName,lastName:this.lastName,email:this.email},function(response){UserService.getMyDetails(function(user){ParameterService.clearData(),AuthService.save(!0),AnalyticsService.sendGoalEvent("0 - Register",user.id),AnalyticsService.trigger("Registration",{form:"generic",type:"joiner",method:"HH signup",status:"complete"}),$scope.quickMatchCount>=3?window.location=ENV.frontend+"/activities/find/matches":window.location=ENV.frontend+"/activities/find/browse"})},function(error){$rootScope.$broadcast("hideLoading")})}},$scope.interestAutoComplete=null,$scope.locationAutoComplete=null,$scope.$watch("currentStep",function(newVal){newVal&&scrollChatToBottom()}),$scope.$watch("interestAutoComplete",function(newVal){newVal&&$scope.formData.addInterest()}),$scope.$watch("locationAutoComplete",function(newVal){newVal&&$scope.formData.addLocation()}),$(window).resize(function(){scrollChatToBottom()})}),angular.module("hulahubSEO").controller("SEOLandingController",function($scope,$rootScope,$facebook,$uibModal,$window,ENV,AlertService,AnalyticsService,ParameterService,StorageService,UserService){function validate(){return $scope.validationRun=!0,$scope.form.$valid}function signupComplete(user,method){AnalyticsService.trigger("Conversion_Activity_Register"),AnalyticsService.sendGoalEvent(("host"===$scope.formData.registrationType?"100":"0")+" - Register",user.id),AnalyticsService.trigger("Registration",{form:"generic",type:$scope.formData.registrationType,method:method,status:"complete"}),ParameterService.clearData(),StorageService.setCookie("session.currentUser",StorageService.getItem("session.currentUser")),StorageService.setCookie("session.accessToken",StorageService.getItem("session.accessToken")),StorageService.setCookie("session.refreshToken",StorageService.getItem("session.refreshToken")),$window.localStorage.removeItem("session.currentUser"),$window.localStorage.removeItem("session.accessToken"),$window.localStorage.removeItem("session.refreshToken"),window.location=ENV.frontend+"/signup/create-account"}$scope.showCallbackForm=function(){$uibModal.open({templateUrl:"callbackForm.html",controller:"SEOCallbackController"})},$scope.storeParameters=function(parameters,hostOrJoiner){parameters.hostOrJoiner=hostOrJoiner,ParameterService.setData(parameters);var paramUser=ParameterService.getUser();$scope.formData={email:paramUser.email,invitation:paramUser.inviteToken,registrationType:paramUser.hostOrJoiner,tracking:ParameterService.getTracking()}};var banner=$("#landingPageBanner"),pager=$(".pager",banner);$(".slideShow",banner).on("cycle-before",function(e,optionHash){$(".active",pager).removeClass("active"),$("li",pager).eq(optionHash.slideNum-1).addClass("active")}).on("cycle-bootstrap",function(e,opts){var max=0;$(this).find(opts.slides).each(function(el){var h=$(this).height();h>max&&(max=h)}),max>0&&$(this).css("height",max)}).on("cycle-post-initialize",function(e,opts){var that=this;setTimeout(function(){$(that).css("height","auto")},0)}).cycle({timeout:8e3,speed:800,slides:".slide",log:!1,fx:"scrollHorz"}),$scope.scrollToVideo=function(){scrollToElement("howItWorks")},$scope.slickConfigs={numbers:{enabled:!0,prevArrow:!1,nextArrow:!1,swipe:!1,autoplay:!0,autoplaySpeed:5e3,mobileFirst:!0,responsive:[{breakpoint:767,settings:"unslick"}],event:{destroy:function(event,slick,breakpoint){var self=event.target;window.addEventListener("resize",_.debounce(function(){$(self).not(".slick-initialized").slick(slick.options)},100))}}},features:{enabled:!0,dots:!0,prevArrow:'<button type="button" class="hidden-xs slick-prev ico ico-chevron-left"></button>',nextArrow:'<button type="button" class="hidden-xs slick-next ico ico-chevron-right"></button>',autoplay:!0,autoplaySpeed:5e3},testimonials:{enabled:!0,dots:!0,prevArrow:!1,nextArrow:!1,autoplay:!0,autoplaySpeed:1e4,adaptiveHeight:!0,mobileFirst:!0,responsive:[{breakpoint:768,settings:"unslick"}],event:{destroy:function(event,slick,breakpoint){var self=event.target;window.addEventListener("resize",_.debounce(function(){$(self).not(".slick-initialized").slick(slick.options)},100))}}}};var isTouchCapable="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch||navigator.maxTouchPoints>0||window.navigator.msMaxTouchPoints>0;isTouchCapable&&$(".card",$(".profilesWithText")).bind("touchstart",function(e){$(this).on("touchend",function(e){$(".touched",$(".profilesWithText")).removeClass("touched"),$(this).addClass("touched"),$(this).off("touchend")}),$(this).on("touchmove",function(e){$(this).off("touchend")})}),$scope.register=function(){validate()&&($rootScope.$broadcast("showLoading"),UserService.register($scope.formData,function(response){UserService.getMyDetails(function(user){signupComplete(user,"HH signup")})},function(response){409===response.status&&response.data.errors.locked&&($scope.closedAccount=!0),$scope.formErrors=response.data.errors,$rootScope.$broadcast("hideLoading")}))},$scope.resend=function(){$scope.resent=!0,$scope.validationRun=!1,UserService.resendConfirmationEmail($scope.formData.email)},$scope.facebookRegister=function(){$rootScope.$broadcast("showLoading"),$scope.validationRun=!1,$facebook.login(void 0,!0).then(function(){$facebook.api("/me?fields=id,name,email").then(function(fbResponse){if(angular.isDefined(fbResponse.email)){var fbAuth=$facebook.getAuthResponse();UserService.registerExternal({provider:"facebook",id:fbResponse.id,email:fbResponse.email,registrationType:$scope.formData.registrationType,accessToken:fbAuth.accessToken,invitation:$scope.formData.invitation,tracking:$scope.formData.tracking},function(response){ParameterService.clearData(),UserService.getMyDetails(function(user){signupComplete(user,"FB signup")})},function(response){$rootScope.$broadcast("hideLoading"),409===response.status||response.data.errors.email?AlertService.showToast("error","An account with that email address already exists","<a class='underlinedLink' href='/login'>Go to Log in</a>."):AlertService.showToast("error","Registration error","An unknown error occurred during sign up. Please try again.")})}else AlertService.showToast("error","Registration error","Please share your email address to sign up."),$rootScope.$broadcast("hideLoading")},function(err){$rootScope.$broadcast("hideLoading")})})},$scope.redirectToBrowse=function(url){StorageService.removeItem("hh-activity-search"),window.location=url}}),angular.module("hulahubSEO").controller("SEOPricingController",function($scope,$uibModal){$scope.calculator={activityPrice:10,bookings:15,subtotal:function(){return this.bookings*this.activityPrice},serviceCharge:function(){var rate="professional"===$scope.currentPlan?.02:.013,charge=rate*this.subtotal();return charge<=1.5&&(charge=1.5),charge},total:function(){return this.subtotal()-this.serviceCharge()}};var bannerImages={standard:"A54-3",personal:"A54-3",professional:"A62-1",enterprise:"A6-1"};$scope.showDetails=function(newPlan,scrollToDetails){$scope.bannerImage=bannerImages[newPlan],$scope.currentPlan=newPlan,scrollToDetails&&scrollToElement("planSummary")},$scope.showContactForm=function(){$uibModal.open({templateUrl:"contactForm.html",controller:"EnterpriseContactController"})}}),angular.module("hulahubSEO").controller("SEOProfileController",function($scope,$uibModal,$timeout,ENV,SEOService,StorageService,TrackingService){function addMarker(markerData){var position={lat:markerData.latitude,lng:markerData.longitude};interestMarkers.push({marker:new google.maps.Marker({map:interestMap,position:position,name:markerData.name,icon:new google.maps.MarkerImage("/img/maps/light-pink.png",null,null,null,new google.maps.Size(40,40))}),circle:new google.maps.Circle({strokeWeight:0,fillColor:"#F15F6C",fillOpacity:.35,map:interestMap,center:position,radius:1609.34*markerData.distance})})}$scope.storeParameters=function(parameters){angular.isDefined(parameters["host-intro"])&&StorageService.setItem("hostIntro",parameters["host-intro"],!0)},$scope.init=function(userId,isHostAccount){isHostAccount&&TrackingService.trackProfilePageView(userId),$scope.user={id:userId,isHostAccount:isHostAccount}},$scope.goToReviews=function(){scrollToElement("reviews")},$scope.shareProfile=function(firstName,lastName,userId,profileLink){$uibModal.open({template:SEOService.convertAngularToSEOBraces("core/partials/share-modal.html"),controller:"ShareModalController",resolve:{data:function(){var userFullName=firstName+" "+lastName;return{id:userId,idName:"profile_id",title:"Share "+firstName+"'s profile",url:profileLink,text:{twitter:"Check out "+userFullName+" and their activities @HulaHubHQ!",email:{subject:"Check out "+userFullName+" and their activities @HulaHubHQ",body:"Find out more about them, read their reviews and see their activities!\n\n"+profileLink+"\n\nMaybe I'll see you at one of their activities soon!"}},intercomEventName:"shared-profile"}}}})};var mapOptions={maxZoom:15,draggable:$(window).width()>=768,scrollwheel:!1,mapTypeControl:!1,streetViewControl:!1,styles:[{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]},locationMap=null,locationMarkers=[];$scope.drawLocationMap=function(lat,lng,distance){locationMap||$timeout(function(){var element=document.getElementById("locationMap");if(null!==element){var position={lat:lat,lng:lng};locationMap=new google.maps.Map(element,{zoom:13,center:position,options:mapOptions}),locationMarkers.push({marker:new google.maps.Marker({map:locationMap,position:position,icon:new google.maps.MarkerImage("/img/maps/light-pink.png",null,null,null,new google.maps.Size(40,40))}),circle:new google.maps.Circle({strokeWeight:0,fillColor:"#F15F6C",fillOpacity:.35,map:locationMap,center:position,radius:1609.34*distance})});var bounds=new google.maps.LatLngBounds;bounds.union(locationMarkers[0].circle.getBounds()),locationMap.fitBounds(bounds)}},0)};var interestMap=null,interestMarkers=[];$scope.drawInterestMap=function(interests){interestMap||$timeout(function(){var element=document.getElementById("interestMap");if(null!==element){interestMap=new google.maps.Map(element,{zoom:13,center:{lat:0,lng:0},options:mapOptions});for(var allHubs=_.uniqBy(_.flatMap(interests,"hubs"),"id"),i=0;i<=allHubs.length-1;i++)addMarker(allHubs[i]);interestMarkers.length&&$timeout(function(){for(var bounds=new google.maps.LatLngBounds,i=0;i<interestMarkers.length;i++)bounds.union(interestMarkers[i].circle.getBounds());interestMap.fitBounds(bounds)},100)}},0)},$scope.trackContact=function(){var storedHostIntro=StorageService.getItem("hostIntro",!0);$scope.user.isHostAccount&&TrackingService.trackHostContact($scope.user.id,storedHostIntro)}}),angular.module("hulahubSEO").controller("SEOQuickSearchController",function($scope,ENV,StorageService){$scope.formData={interest:null,location:null,getUrl:function(){var url="/browse";return null!==this.interest&&(url+="/"+this.interest.id),null!==this.location&&null!==this.location.hloc&&null!==this.location.latitude&&null!==this.location.longitude&&(url+="?hloc="+this.location.name+"&hlat="+this.location.latitude+"&hlong="+this.location.longitude),url}},$scope.init=function(data){angular.isDefined(data.interest)&&($scope.formData.interest=data.interest),angular.isDefined(data.location)&&($scope.formData.location=data.location)},$scope.search=function(){StorageService.removeItem("hh-loggedout-search"),redirectToPage(ENV,$scope.formData.getUrl())}}),angular.module("hulahubSEO").controller("SEOSearchController",function($scope,$uibModal,ENV,StorageService,SEOService,BrowseActivityService,AlertService){var modalParams={template:SEOService.convertAngularToSEOBraces("activities/views/partials/browse-filters.html")};BrowseActivityService.load($scope,"profile",modalParams),$scope.init=function(vars){var sessionData=JSON.parse(StorageService.getItem("hh-activity-search",!0));null!==sessionData&&$scope.formData.loadFromSession(sessionData),null!==vars.interest&&($scope.formData.text=vars.interest.name,$scope.formData.sort.value="score"),null!==vars.searchText&&($scope.formData.text=vars.searchText,$scope.formData.sort.value="score"),null!==vars.location&&($scope.formData.location=vars.location,$scope.formData.sort.value="score"),vars.forceFeatured===!0&&($scope.formData.filters.special.featured=!0),$scope.formData.search()},$scope.viewActivity=function(activity){activity.isExternal?redirectToPage(ENV,"/activity/external/"+activity.activityURL):redirectToPage(ENV,"/activity/"+activity.activityURL)},$scope.viewProfile=function(host){redirectToPage(ENV,"/profile/"+host.profileURL)},$scope.suggestActivity=function(){$uibModal.open({templateUrl:"activities/views/partials/suggest-activity-modal.html",controller:"SuggestActivityModalController",resolve:{data:function(){return{activity:$scope.formData.text,location:$scope.formData.location}}}}).result.then(function(result){AlertService.showToast("success","Thank you for helping us!","We will let you know as soon as we add that activity."),jumpToTop()})}});