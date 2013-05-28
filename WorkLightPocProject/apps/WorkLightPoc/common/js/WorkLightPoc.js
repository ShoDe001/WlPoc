/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
window.$ = window.jQuery = WLJQ;
var homeController;
var featuredController;
var categoryController;
var categoryDetailController;
var searchController;
var topController;
var topDetailController;
var cordovaController;

var contents;
var movieStore;

var busy;

function wlCommonInit(){
	require([	"dojo/core-web-layer",
				"dojo/mobile-ui-layer",
				"dojo/mobile-compat-layer" ], dojoInit);
}

function dojoInit() {
	require([	"dojo", 
	         	"dojo/has",
	         	"dijit/registry",
                "dojo/_base/Deferred",
                "dojo/_base/connect",
                "dojo/_base/lang",
                "js/model/Contents",
                "js/store/MovieStore",
                "js/controllers/HomeController",
	         	"dojo/parser",
				"dojox/mobile",
				"dojox/mobile/compat", 
				"dojox/mobile/deviceTheme", 
				"dojox/mobile/ScrollableView", 
				"dojox/mobile/ContentPane", 
				"dojox/mobile/TabBar" ,
				"dojox/mobile/TabBarButton" 
				], function(dojo,has,registry,Deferred,connect,lang,Contents,MovieStore,HomeController) {
		
		homeController = new HomeController();
    	contents = new Contents();
    	movieStore = new MovieStore();
		dojo.ready(function() {
			try{
          	  connect.connect(registry.byId("featurePane"),"onLoad",this,function(){
          		  Deferred.when(contents.loadContends(),lang.hitch(homeController,homeController.start));
                });
            }
            catch(e){
          	  WL.Logger.debug("Failed to load customer information");
            }
		});
	});
}
