/**
 * 
 */
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
        "dojo/_base/xhr",
        "dojo/topic",
        "dijit/registry",
        "dojo/_base/connect",
        "dojox/mobile/EdgeToEdgeList",
        "dojox/mobile/ListItem",
        "dojox/mobile/Rating"
],
function(has,declare,lang,array,dom,domClass,domConstruct,query,domStyle,domAttr,on,Deferred,xhr,topic,registry,connect,EdgeToEdgeList,ListItem,Rating){
	declare("controllers.SearchController", [], {
		started:false,
		movieSearchList:null,
		constructor : function() {		
		},
		start:function(args){
			if(!this.started)
			{
				lang.mixin(this,args);
				
				this.subscriptions();
				this.started = true;
			}
		},
		subscriptions : function() {
//			connect.connect(registry.byId("newClaimButton"),"onClick",this, this.newClaim);
//			connect.connect(registry.byId("createClaimButton"),"onClick",this, this.createNewClaim);	
//			connect.connect(dom.byId("claimInfo"),"onAfterTransitionIn",this,"clearDetail");
//			connect.connect(registry.byId("getLocationButton"),"onClick",this,"getCurrentLocation");
		},
		onSearch:function(obj){
			var invocationData = {
				adapter : "MoviesListJsonHtmlAdapter",
				procedure : "searchMovie",
				parameters : [{keyword:obj.value}]
			};
		
			var options =
			{
				onSuccess:lang.hitch(this,this.buildMoviesList),
				onFailure:lang.hitch(this,this.loadMoviesFail)
			};
		
			WL.Client.invokeProcedure(invocationData, options);
			WL.Logger.debug("About to invoke loadCustomerFromServer");
		},
		buildMoviesList:function(data){
			try{
				this.movieSearchList = eval(data.invocationResult.result);
				this.buildMovieSearchView();
			}catch(e){
				WL.Logger.error(e);			
			}
			finally{
				(has("hybrid"))?busy.hide():busy.stop();
			}
		},
		loadMoviesFail:function(error){
			WL.Logger.debug("Load Movies List fail");
			console.error(error);
		},
		buildMovieSearchView:function(){
			if(registry.byId("searchList")) {
				registry.byId("searchList").destroyDescendants();
			}
			var searchListDiv = registry.byId("searchList");
			
			array.forEach(this.movieSearchList, lang.hitch(this, function(movie, i) {
				var listitem = new ListItem({
					label : movie.movName
				});
				listitem.noArrow = true;
				listitem.domNode.id = movie.movId;
				listitem.icon = movie.poster;
				listitem.variableHeight = true;
				listitem.rightText = movie.year;
				
				listitem.addChild(new Rating({
									image : "images/star.png",
									numStars : 5,
									value : movie.rating
									})
								);
				
				searchListDiv.addChild(listitem);
			}));
		}
	});
	return controllers.SearchController;
});