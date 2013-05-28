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
        "dojox/mobile/ScrollableView",
        "dojox/mobile/ListItem",
        "dojox/mobile/RoundRect",
        "dojox/mobile/Heading"
],
function(has,declare,lang,array,dom,domClass,domConstruct,query,domStyle,domAttr,on,Deferred,xhr,topic,registry,connect,EdgeToEdgeList,ScrollableView,ListItem){
	declare("controllers.CordovaController", [], {
		started:false,
		latitude:null,
		longitude:null,
		database:null,
		pictureSource:null,
		destinationType:null,
		imageView:null,
		itemIndex:1,
		imageURI:null,
		constructor : function() {		
		},
		start:function(args){
			if(!this.started)
			{
				lang.mixin(this,args);
				
				this.subscriptions();
				this.initDb();
				this.started = true;
			}
		},
		subscriptions : function() {
			connect.connect(registry.byId("geoLocationButton"),"onClick",this,"onGeolacation");
			this.latitude = registry.byId("latitude");
			this.longitude = registry.byId("longitude");
			
			connect.connect(registry.byId("cameraButton"),"onClick",this,"openCamera");
	        //this.pictureSource=navigator.camera.PictureSourceType;
	        //this.destinationType=navigator.camera.DestinationType;
			this.imageView = registry.byId("captureImageView");
		},
		onGeolacation:function(){
			WL.Logger.debug("Get Geolocation");
			navigator.geolocation.getCurrentPosition(lang.hitch(this,
					this.onGeoSuccess),
					lang.hitch(this, this.onGeoError),
					{enableHighAccuracy: true});
		},
		onGeoSuccess:function(position){
			WL.Logger.debug("geolocation is la:"+position.coords.latitude+" and lo:"+position.coords.longitude);
			this.latitude.set('value', position.coords.latitude);
			this.longitude.set('value', position.coords.longitude);
			
		},
		onGeoError:function(e){
			if(e){
				WL.Logger.debug("Error retriveing geoLocation "+ e);
			}
		},
		openCamera:function(){
			navigator.camera.getPicture(lang.hitch(this,this.onCaptureSuccess), 
					lang.hitch(this,this.onCaptureFail),
					{ quality: 50,destinationType: navigator.camera.DestinationType.FILE_URI });
		},
		onCaptureSuccess:function(imageURI){
			WL.Logger.debug("image store @"+imageURI);
			this.imageURI = imageURI;
			this.insertImageStore();
		},
		onCaptureFail:function(message){
			WL.Logger.debug("Error capture image "+ message);
		},
		addImageListItem:function(item){
			WL.Logger.debug("add Item "+item.id+" is "+ item.data);
			var subItem = domConstruct.create("div", {
				innerHTML : "<img src='"+item.data+"' height='120px'>"
			});
			var mapInit = {};
			mapInit["class"] = "mblVariableHeight";
			mapInit.noArrow = true;
			var mapItem = new dojox.mobile.ListItem(mapInit, subItem);
			mapItem.startup();
			mapItem.domNode.style.display="inline-block";
			connect.connect(mapItem.domNode, "onclick", this, this.openImage);

			this.imageView.addChild(mapItem);
		},
		initDb:function(){
			try{
				this.database = window.openDatabase("moviePocCordovaApiTest", "1.0", "Movie POC", 1000000);
				this.database.transaction(lang.hitch(this,this.createTable),
											lang.hitch(this,this.errorCB) ,
											lang.hitch(this,this.successCB));
			}catch(e){
				WL.Logger.debug("Error initailizing database "+ e);
			}
		},
		createTable:function(transaction){
			transaction.executeSql('CREATE TABLE IF NOT EXISTS IMAGESTORE (id unique, data)');
//			transaction.executeSql('INSERT INTO IMAGESTORE (id, data) VALUES (1, "First row")');
//			transaction.executeSql('INSERT INTO IMAGESTORE (id, data) VALUES (2, "Second row")');
		},
		errorCB:function(transaction,error){
			if(error){
				WL.Logger.debug("Error process SQL: "+ error);
			}
			this.imageURI=null;
		},
		successCB:function(){
			WL.Logger.debug(" Create table IMAGESTORE success.");
			this.querySavedImages();
		},
		insertImageStore:function(){
			if(this.imageURI!=null){
			this.database.transaction(lang.hitch(this,this.insertImage),
					lang.hitch(this,this.errorCB) ,
					lang.hitch(this,this.successInsertImage));
			}
		},
		insertImage:function(transaction){
			var sqlString = 'INSERT INTO IMAGESTORE (id, data) VALUES ('+(++this.itemIndex)+', "'+this.imageURI+'")';
			WL.Logger.debug("Insert Sql:"+sqlString);
			transaction.executeSql(sqlString);
		},
		successInsertImage:function(){
			WL.Logger.debug(" insert image success. ");
			var item = {
			     "id":this.itemIndex,
			     "data":this.imageURI
			};
			this.addImageListItem(item);
			this.imageURI = null;
		},
		querySavedImages:function(){
			if(this.database){
				this.database.transaction(lang.hitch(this,this.queryImages),
						lang.hitch(this,this.errorCB));
			}
		},
		queryImages:function(transaction){
			transaction.executeSql('SELECT * FROM IMAGESTORE', [], lang.hitch(this,this.queryImagesSuccess), lang.hitch(this,this.errorCB));
		},
		queryImagesSuccess:function(transaction, results){
			WL.Logger.debug("Returned rows = " + results.rows.length);
			for(var i = 0 ;i<results.rows.length;i++){
				if(this.itemIndex<results.rows.item(i).id)this.itemIndex=results.rows.item(i).id;
				this.addImageListItem(results.rows.item(i));
			}
			
		},
		openImage : function() {
//			//var coords = position.coords;                         
//			var url = "http://maps.google.com/maps/api/staticmap?center=" + this.claim.GEOLAT + "," + this.claim.GEOLONG + "&zoom=12&size=320x480&maptype=roadmap&key={youkey}&sensor=true";
//			if ((has("hybrid"))) {
//				var nativeParam = {
//					latitude : this.claim.GEOLAT,
//					longitude : this.claim.GEOLONG
//				};
//				if (WL.Client.getEnvironment() == "iphone") {
//					//Show map from native Page
//					WL.NativePage.show('InsuranceMap', function(data) {
//						alert("Native Message: " + data.msg)
//					}, nativeParam);
//
//				}
//				if (WL.Client.getEnvironment() == "android") {
//					WL.NativePage.show('com.Insurance.InsuranceMap', function(data) {
//						alert("Native Message: " + data.msg)
//					}, nativeParam);
//				}
//			} else {
//				window.open(url);
//			}
		}
	});
	return controllers.CordovaController;
});