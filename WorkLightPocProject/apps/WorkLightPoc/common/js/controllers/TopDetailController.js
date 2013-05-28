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
        "dojox/mobile/ListItem",
        "dojox/mobile/Rating", 
        "dojo/data/ItemFileWriteStore"
],
function(has,declare,lang,array,dom,domClass,domConstruct,query,domStyle,domAttr,on,Deferred,xhr,topic,registry,connect,ListItem,Rating){
	declare("controllers.TopDetailController", [], {
		started : false,
		category:null,
		movieList:null,
		categoryName: '',
		constructor : function() {		
		},
		start:function(args){
			if(!this.started){
				lang.mixin(this, args);
			}
		},
		subscriptions : function() {
			try {
				topic.subscribe("topSelect", lang.hitch(this, this.topSelected));
			} catch (e) {
				console.error(e);
			}
		},
		topSelected:function(top){
			WL.Logger.debug("Top selected: " + top);
			this.category= top;
			var view = dom.byId("moviesView_top");
			if (has("hybrid")) {
				busy.show();
			} else {
				dom.byId(view).appendChild(busy.domNode);
				busy.start();
			}

			this.displayTop(top);
		},
		displayTop:function(top){
			try{
				var invocationData = {
      				adapter : "MoviesListJsonHtmlAdapter",
      				procedure : "getCategorySortRating",
      				parameters : [top]
      			};
      		
      			var options =
      			{
      				onSuccess:lang.hitch(this,this.topDetailList),
      				onFailure:lang.hitch(this,this.topDetailFail)
      			};
      			
      			movieList = null;
      			registry.byId("moviesList_top").destroyDescendants();
      			WL.Client.invokeProcedure(invocationData, options);
      			WL.Logger.debug("About to invoke loadCustomerFromServer");
			}catch(e){
				WL.Logger.error(e);			
			}finally{
				(has("hybrid"))?busy.hide():busy.stop();
			}
		},
		topDetailList:function(data){
			try{
				this.movieList = eval(data.invocationResult.result);
				this.buildMoviesView();
			}catch(e){
				WL.Logger.error(e);			
			}
			finally{
				(has("hybrid"))?busy.hide():busy.stop();
			}
		},
		topDetailFail:function(error){
		WL.Logger.debug("Categories Not Available");
		console.error(error);
		(has("hybrid"))?busy.hide():busy.stop();
		},
		buildMoviesView:function(){
			try {
				if (registry.byId("moviesList_top")) {
					registry.byId("moviesList_top").destroyDescendants();
				}
				var movieListView = registry.byId("moviesList_top");

				array.forEach(this.movieList, lang.hitch(this, function(movie, i) {
					console.log("Top " + i + ": " + movie.movId);
					
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
					
					movieListView.addChild(listitem);
					this.categoryName = movie.cateName;
				}));

				registry.byId("topTitle").set("label",this.categoryName);
				var pd = registry.byId("topView");
				pd.performTransition("moviesView_top", 1, "slide");
				
			} catch (e) {
				WL.Logger.debug("Movies View Not Available " + e);
			} finally {
				(has("hybrid")) ? busy.hide() : busy.stop();
			}
		}
	});
	return controllers.TopDetailController;
});