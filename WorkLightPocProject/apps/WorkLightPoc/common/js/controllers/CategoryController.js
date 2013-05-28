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
        "dojox/mobile/ListItem"
],
function(has,declare,lang,array,dom,domClass,domConstruct,query,domStyle,domAttr,on,Deferred,xhr,topic,registry,connect,EdgeToEdgeList,ListItem){
	declare("controllers.CategoryController", [], {
		started:false,
		categoryDetailController:null,
		categoriesList:null,
		constructor : function() {		
		},
		start:function(args){
			if(!this.started)
			{
				lang.mixin(this,args);
				
				this.categoryDetailController.subscriptions();
				this.subscriptions();
				Deferred.when((this.categoriesList = movieStore.getCategory()), lang.hitch(this, this.buildCategoriesList));
				if(!(this.categoriesList instanceof dojo.Deferred)){
					this.buildCategoriesView();
				}
				this.started = true;
			}
			this.buildCategoriesView();
		},
		subscriptions : function() {
//			connect.connect(registry.byId("newClaimButton"),"onClick",this, this.newClaim);
//			connect.connect(registry.byId("createClaimButton"),"onClick",this, this.createNewClaim);	
//			connect.connect(dom.byId("claimInfo"),"onAfterTransitionIn",this,"clearDetail");
//			connect.connect(registry.byId("getLocationButton"),"onClick",this,"getCurrentLocation");
		},
		buildCategoriesList:function(data){
			try{
				this.categoriesList = data;
				this.buildCategoriesView();
			}catch(e){
				WL.Logger.error(e);			
			}
			finally{
				(has("hybrid"))?busy.hide():busy.stop();
			}
		},
		buildCategoriesView:function(){
			if(registry.byId("categoryList")) {
				registry.byId("categoryList").destroyDescendants();
			}
			var categoryListDiv = registry.byId("categoryList");
			
			array.forEach(this.categoriesList.categories, lang.hitch(this, function(category, i) {
				console.log("Category " + i + ": " + category);
				 var listitem = new ListItem({
					 label : category.name
				 });
				 listitem.noArrow=false;
				 listitem.rightIcon="mblDomButtonArrow";
				 listitem.domNode.id = category.id;
				 domAttr.set(listitem.domNode,"index",i);
				 on(listitem.domNode,"click",lang.hitch(this, this.categorySelected));	
				 
				 categoryListDiv.addChild(listitem);		
				 
			}));
		},
		categorySelected:function(evt){
			var selectedIndex = domAttr.get(evt.currentTarget,"index");
			var selected = this.categoriesList.categories[selectedIndex];
			domClass.add(evt.currentTarget, "mblListItemTextBoxSelected");
			var rEvt = evt.currentTarget;
			setTimeout(function(){
				domClass.remove(rEvt, "mblListItemTextBoxSelected");
			}, 1000);
			
			topic.publish("categorySelect",selected);
		}
	});
	return controllers.CategoryController;
});