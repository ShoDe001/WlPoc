define(["dojo/has",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/query",
        "dojo/dom-style",
        "dojo/dom-attr",
        "dojo/on",
        "dojo/_base/Deferred",
        "dojo/topic",
        "dojo/_base/connect",
        "dijit/registry",
        "dojo/selector/acme"
        ],
       function(has,declare,lang,array,dom,domClass,domConstruct,query,domStyle,domAttr,on,Deferred,topic,connect,registry)
       {
       
       declare("controllers.HomeController", [], {
               constructor : function(args) {
               WL.Logger.debug("HomeController created");
               lang.mixin(this,args);
               },
               start:function()
               {
               
               WL.Logger.debug("Device Environment is: " + WL.Client.getEnvironment());
               
               this.handleFeatured();
               registry.byId("featurePane").resize();
               
               connect.connect(registry.byId('mainMenuView'),'onBeforeTransitionOut',this,function(moveTo)
                               {
                               this.loadView(moveTo);	
                               });
               (has("hybrid"))?busy.hide():busy.stop();
               WL.Logger.debug("Home Controller Initialized");
               },
               
               handleFeatured:function(){
               
            	   require(["controllers/FeaturedController"],
              			function(FeaturedController)
              			{
              				if(!featuredController)
              				{
              					featuredController = new FeaturedController();
              				}
              				featuredController.start();
              			});
               },
               handleCategory:function(){

          			require(["controllers/CategoryController",
          			         "controllers/CategoryDetailController"],
          			function(CategoryController,CategoryDetailController){
          				if(!categoryController){
              				categoryController = new CategoryController();
              				categoryDetailController = new CategoryDetailController();
          				}
          				
          				categoryController.start({categoryDetailController:categoryDetailController});
          			});
               },
               handleToprate:function(){

         			require(["controllers/TopController",
         			         "controllers/TopDetailController"],
         			function(TopController,TopDetailController){
         				if(!topController){
             				topController = new TopController();
             				topDetailController = new TopDetailController();
         				}
         				
         				topController.start({topDetailController:topDetailController});
         			});
			   },
			   handleSearch:function(){
          			require(["controllers/SearchController"],
          			function(SearchController){
          				if(!searchController){
          					searchController = new SearchController();
          				}
          				
          				searchController.start();
          			});
			   }, 
			   handleCordova:function(){
         			require(["controllers/CordovaController"],
         			function(CordovaController){
         				if(!cordovaController){
         					cordovaController = new CordovaController();
         				}
         				
         				cordovaController.start();
         			});
			   }, 
               loadView:function(moveTo)
               {
               switch(moveTo)
               {
               case "featuredRoot" : 
               this.handleFeatured();
               break;
               default:
               break;
               }
               
               }
               });
       return controllers.HomeController;
       }
       );