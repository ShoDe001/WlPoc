/**
 * 
 */
define(["dojo/has",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/_base/json",
        "dojo/_base/Deferred",
        "dojo/json",
        "dojo/_base/xhr",
        "dojo/data/ItemFileWriteStore"],
       function(has,declare,lang,xhr,json,Deferred,json,xhr)
       {
		    declare("store.MovieStore", [], {
			deferred : null,
			categories : null,
			logDate : null,
			getCategory :function(){
				var callDate = new Date();
				if(this.logDate!=null&&this.logDate>callDate){
					return this.categories;
				}else{
					callDate.setHours(callDate.getHours()+1);
					this.logDate = callDate;
					return this.loadCategory();
				}
				
			},
			loadCategory : function() {
				try {
					var invocationData = {
	      				adapter : "MoviesListJsonHtmlAdapter",
	    				procedure : "getCategoryData",
	    				parameters : []
					};
	
					var options = {
						onSuccess : lang.hitch(this, this.categoryLoaded),
						onFailure : lang.hitch(this, this.categoryLoadFail)
					};
	
					WL.Client.invokeProcedure(invocationData, options);
					WL.Logger.debug("About to invoke loadFeaturedContendsFromServer");
	
				} catch (e) {
					WL.Logger.debug("Failed to load featured categories information");
				}
				this.deferred = new Deferred();
				return this.deferred;
			},
			categoryLoaded : function(result) {
				WL.Logger.debug("Contends Loaded");
				WL.Logger.debug("Result: " + json.stringify(result));
	
				try {
					this.categories = result.invocationResult;
					this.deferred.callback(this.categories);
				} catch (e) {
					WL.Logger.error("Callback fire fail");
				}
			},
			categoryLoadFail : function(error) {
				WL.Logger.debug("Failed to load category", error);
				this.deferred.errback(error);
			}
		});
		return store.MovieStore;
	});