
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
        "dijit/registry",
        "dojox/mobile/GridLayout",
        "dojox/mobile/Pane",
        ],
        function(has, declare, lang, array, dom, domClass, domConstruct, query, domStyle, domAttr, on, Deferred, topic, registry,GridLayout,Pane) {

	declare("controllers.FeaturedController", [], {
		featuredData : null,
		started : false,
		constructor : function() {
		},
		start : function(args) {

			if (!this.started) {
				lang.mixin(this, args);
				if (registry.byId("featuredList")) {
					registry.byId("featuredList").destroyDescendants();
					Deferred.when(contents.loadFeaturedContendsFromServer(), lang.hitch(this, this.getCustomerFeaturedList));
				}
				this.started = true;
			}
		},
		refreshList : function() {
			var featuredList = registry.byId("featuredList");
			featuredList.destroyDescendants();
			Deferred.when(contents.loadFeaturedContendsFromServer(), lang.hitch(this, this.getCustomerFeaturedList));
		},
		getCustomerFeaturedList : function(data) {
			try {

				console.log("getCustomerFeaturedList", data);
				this.featuredData = data;
				var featuredList = registry.byId("featuredList");
				console.log("Featured List: " + featuredList);
				array.forEach(this.featuredData.array, lang.hitch(this, function(featured, i) {
					console.log("Featured " + i + ": " + featured);
					 var pane = new Pane();
					 pane.domNode.style.background = "url("+featured.image+") no-repeat";
					 pane.domNode.style.width = (150*featured.dimension.col)+"px";
					 pane.domNode.style.height = (150*featured.dimension.row)+"px";
					 pane.domNode.id = featured.id;
					 featuredList.addChild(pane);
					 
				}));
				console.log("Featured List Done");
			} catch (e) {
				console.error(e);
			} finally {

			}
		},
		featuredListFailure : function(error) {
			window.alert("Policies Not Available");
			console.error(error);

		},
		featuredSelected : function(evt) {

			var q = query("div[index]", evt.currentTarget);
			var selectedIndex = domAttr.get(q[0], "index");
			var featuredSelected = this.featuredData[selectedIndex];
			domClass.add(evt.currentTarget, "mblListItemTextBoxSelected");
			var rEvt = evt.currentTarget;
			setTimeout(function() {
				domClass.remove(rEvt, "mblListItemTextBoxSelected");
			}, 1000);
			topic.publish("featuredSelected", featuredSelected);

		}

	});
	return controllers.FeaturedController;
});