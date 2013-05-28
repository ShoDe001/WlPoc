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
        "dojo/_base/xhr"],
       function(has,declare,lang,xhr,json,Deferred,json,xhr)
       {
       

		       declare("model.Contents", [], {
			deferred : null,
			contends : null,
			loadFeaturedContendsFromServer : function() {
				try {
					var invocationData = {
						adapter : "MoviesListJsonHtmlAdapter",
						procedure : "getFeaturedItemData",
						parameters : []
					};
	
					var options = {
						onSuccess : lang.hitch(this, this.featuredLoaded),
						onFailure : lang.hitch(this, this.featuredError)
					};
	
					WL.Client.invokeProcedure(invocationData, options);
					WL.Logger.debug("About to invoke loadFeaturedContendsFromServer");
	
				} catch (e) {
					WL.Logger.debug("Failed to load featured contends information");
				}
				this.deferred = new Deferred();
				return this.deferred;
			},
			loadContends : function() {
				WL.Logger.debug("Invoke loadContends : " + this.contends);
				return (this.contends) ? this.contends : this.loadFeaturedContendsFromServer();
			},
			featuredLoaded : function(result) {
				WL.Logger.debug("Contends Loaded");
				WL.Logger.debug("Result: " + json.stringify(result));
	
				try {
					this.customer = result.invocationResult;
					this.deferred.callback(this.customer);
				} catch (e) {
					WL.Logger.error("Callback fire fail");
				}
			},
			featuredError : function(error) {
				WL.Logger.debug("Failed to load contends", error);
				this.deferred.errback(error);
			}
		});
		return model.Contents;
	});