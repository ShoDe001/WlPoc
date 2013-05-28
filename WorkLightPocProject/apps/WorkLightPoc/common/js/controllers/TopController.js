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
	declare("controllers.TopController", [], {
		started:false,
		topDetailController:null,
		categoriesList:null,
		constructor : function() {		
		},
		start:function(args){
			if(!this.started)
			{
				lang.mixin(this,args);
				
				this.topDetailController.subscriptions();
				this.subscriptions();
				this.started = true;
				Deferred.when((this.categoriesList = movieStore.getCategory()), lang.hitch(this, this.buildCategoriesList));
				if(!(this.categoriesList instanceof dojo.Deferred)){
					this.buildCategoriesView();
				}
			}else{
				this.buildCategoriesView();
			}
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
			if(registry.byId("topList")) {
				registry.byId("topList").destroyDescendants();
			}
			var topListDiv = registry.byId("topList");
			
			array.forEach(this.categoriesList.categories, lang.hitch(this, function(top, i) {
				console.log("Top " + i + ": " + top);
				 var listitem = new ListItem({
					 label : top.name
				 });
				 listitem.noArrow=false;
				 listitem.rightIcon="mblDomButtonArrow";
				 listitem.domNode.id = top.id;
				 domAttr.set(listitem.domNode,"index",i);
				 on(listitem.domNode,"click",lang.hitch(this, this.topSelected));	
				 
				 topListDiv.addChild(listitem);		
				 
			}));
		},
		topSelected:function(evt){
			var selectedIndex = domAttr.get(evt.currentTarget,"index");
			var selected = this.categoriesList.categories[selectedIndex];
			domClass.add(evt.currentTarget, "mblListItemTextBoxSelected");
			var rEvt = evt.currentTarget;
			setTimeout(function(){
				domClass.remove(rEvt, "mblListItemTextBoxSelected");
			}, 1000);
			
			topic.publish("topSelect",selected);
		}
	});
	return controllers.TopController;
});