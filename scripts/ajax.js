var app = {
	initialize : function (){
		var self = this;
		if(!Store.isSet("appData." + Store.get("user").Userid)){
			this.getAppData();
		}
		else{
		//	var customers = Store.get("customers." + Store.get("user").Userid);
        	this.changePage();
		}
	},
	fetch : function (model){
		$.getJSON(url+model, function(data) {
			Store.set(model+"." + Store.get("user").Userid, data,0);
		});
	},
	getAppData : function(){
		$.mobile.loadingMessage = "Customers";
		$.mobile.showPageLoadingMsg();
		var userid = Store.get("user").Userid;
		$.getJSON(url+"customers",{ "userid" : userid }, function(data) {
			$.each(data,function(i,record){
				record.order = 0;
			});
			Store.set("customers." + Store.get("user").Userid, data,0);
		}).done(function(){
			$.mobile.loadingMessage = "Products";
			$.mobile.showPageLoadingMsg();
			$.getJSON(url+"products", function(data) {
				Store.set("products." + Store.get("user").Userid, data,0);
			}).done(function(){
				var products = Store.get("products." + Store.get("user").Userid);
				var category = getDistinct(products,'pmCategory');
				Store.set("category." + Store.get("user").Userid, category,0);
				$.mobile.loadingMessage = "Loading..";
				$.mobile.showPageLoadingMsg();
				app.changePage();
				Store.set("appData." + Store.get("user").Userid,"1",0);
			});
		})
	},
	changePage : function(){
		$.mobile.changePage( "#saleOrderSelectCustomer", {
            transition: "slide",
            reverse: false,
            changeHash: true
        });
        var customers = Store.get("customers." + Store.get("user").Userid);
        app.loadPage(customers);
        return false;
	},
	loadPage : function(customers){		
        customers = sortByKey(customers, 'order');
        var node;
        var store;
        var storename;
        var location;
        $('#ui-results').children(".added").remove();  
        $.each(customers,function(i,record){
        	if(i >= 10){
        		return false;
        	}
        	store = (record.smStoreName).split("-");
        	storename = record.smStoreName;
        	location = record.smStoreName;
        	if(typeof store[0] != "undefined"){
        		storename = $.trim(store[0]);
        	}
        	if(typeof store[1] != "undefined"){
        		location = $.trim(store[1]);
        	}
        	node = $(".template",$("#ui-results")).clone().removeClass("template");
        	$(".storeName",node).html(storename);
        	$(".storeCode",node).html(record.smStoreCode);
        	
        	$(".location",node).html(location);
        	$(".storeId",node).val(record.smId);
        	$(node).addClass("added");
        	$(node).appendTo("#ui-results");
        	$("#ui-results").show();
        });
        $(".customer").unbind('tap', orders.selectCustomer);
    	$(".customer").bind("tap", {page: "#saleOrderEntry"}, orders.selectCustomer);
       	$.mobile.hidePageLoadingMsg();
    	$("#txtUserName").val("");
    	$("#txtPassword").val("");
    	return false;
	},
	postData : function(data,param,callback){
		var temp = [];
		if(Store.isSet(param + "." + Store.get("user").Userid)){
			temp = Store.get(param + "." + Store.get("user").Userid);
			Store.clear(param + "." + Store.get("user").Userid);
		}
		$.ajax({
    		type: "POST",
    		url: url + param,
    		data: data,
        	cache: false,
        	dataType: "html",
        	success: function(result){
        		data['savedStatus'] = true;
        		data['referenceNo'] = result;
        		data['serialNo'] = temp.length;
        		temp.push(data);
 	 			Store.set(param + "." + Store.get("user").Userid,temp,0);
        		callback(result);
        	},
        	error: function(){
        		data['savedStatus'] = false;
        		data['serialNo'] = temp.length;
        		temp.push(data);
 	 			Store.set(param + "." + Store.get("user").Userid,temp,0);
        		callback(0);
        	}
  		});
	}
}
function showNotice(param){
	if(param != 0){
		$("#savedOrder").find(".result").html("Successfully Saved");
		$("#savedOrder").find(".reference").html("Order no. is " + param);
	}else{
		$("#savedOrder").find(".result").html("Saved Locally");
		$("#savedOrder").find(".reference").html("");
	}
	$.mobile.changePage( "#savedOrder", {
    	transition: "slide",
        reverse: false,
        changeHash: true
    });
}
var orders = {
	pendingOrders : [],
	products : [],
	savedOrders : [],
	viewOrder : function(){
		editMode = false;
		var storeId = $(this).find('input.storeId').val();
		var serialNo = $(this).find('input.serialNo').val();
		var storeName = $(this).find('span.storeName').html();
		var location = $(this).find('span.location').html();
		var storeCode = $(this).find('span.storeCode').html();
		$("#saleOrderEntry").find('.storeId').val(storeId);
		$("#saleOrderEntry").find('.storeName').html(storeName);
		$("#saleOrderEntry").find('.location').html(location);
		$("#saleOrderEntry").find('.storeCode').html(storeCode);
		
		var temp = getObject(Store.get("order." + Store.get("user").Userid),"serialNo",serialNo);
		orders.savedOrders = Store.get("order." + Store.get("user").Userid)[temp];
		$.mobile.changePage( "#saleOrderEntry", {
            transition: "slide",
            reverse: true,
            changeHash: true
        });
        return false;
		
	},
	selectCustomer : function(){
		editMode = true;
		var storeId = $(this).find('input.storeId').val();
		var storeName = $(this).find('strong.storeName').html();
		var location = $(this).find('span.location').html();
		var storeCode = $(this).find('span.storeCode').html();
		
		var order = {  'storeId' : storeId,
						'storeName' : storeName,
						'location' : location,
						'storeCode' : storeCode,
						'items' : []
					}
		var selectedIndex = getObject(orders.pendingOrders,'storeId',storeId);
		if(!selectedIndex){
			orders.pendingOrders.push(order);
			selectedIndex = orders.pendingOrders.length - 1;
		}
		for(i in orders.pendingOrders){
			orders.pendingOrders[i]['selectedOrder'] = false;
			if(i == selectedIndex){
				orders.pendingOrders[i]['selectedOrder'] = true;
			}
		}
		
		$("#saleOrderEntry").find('.storeId').val(storeId);
		$("#saleOrderEntry").find('.storeName').html(storeName);
		$("#saleOrderEntry").find('.location').html(location);
		$("#saleOrderEntry").find('.storeCode').html(storeCode);
		
		$.mobile.changePage( "#saleOrderEntry", {
            transition: "slide",
            reverse: true,
            changeHash: true
        });
        return false;
	},
	addProduct : function(){
		if(typeof $(this).find(".productId").val() !== "undefined"){
			var selectedIndex = getObject(orders.pendingOrders,'selectedOrder',true);
			var selectedItem = getObject(orders.pendingOrders[selectedIndex].items,'productId',$(this).find(".productId").val()); 
			var item = orders.pendingOrders[selectedIndex].items[selectedItem];
			$.mobile.changePage( "#enterProducts", {
            	transition: "slide",
            	reverse: true,
            	changeHash: true
        	});
			$("#enterProducts").find("#category").val(item.category).change();
			$("#enterProducts").find("#productId").val(item.productId);
			$("#enterProducts").find("#product").val(item.productName);
			$("#enterProducts").find("#quantity").val(item.quantity);
			$("#enterProducts").find("#offerquantity").val(item.offerquantity);
		}else{
			$.mobile.changePage( "#enterProducts", {
            	transition: "slide",
            	reverse: true,
            	changeHash: true
        	});
        }
        return false;
	},
	validateItem : function(){
		if($("#category option:selected").text() == 'Category'){
			throw "Invalid category";
			return false;
		}
		if($.trim($("#product").val()) == ''){
			throw "Invalid product";
			return false;
		}
		if($("#productId").val() == '' && $.trim($("#product").val()) == ''){
			throw "Product not selected";
			return false;
		}
		if($.trim($("#quantity").val()) == '' || isNaN($.trim($("#quantity").val()))){
			$("#quantity").val('');
			throw "Product not selected";
			return false;
		}
		if(isNaN($.trim($("#offerquantity").val()))){
			$("#offerquantity").val('');
			throw "Invalid offer quantity";
			return false;
		}
	},
	addItem : function(){
		var selectedIndex = getObject(orders.pendingOrders,'selectedOrder',true);
		var selectedItem = getObject(orders.pendingOrders[selectedIndex].items,'productId',$("#productId").val()); 
		if(selectedItem){
			orders.pendingOrders[selectedIndex].items.splice(selectedItem,1);
		}
		try{
			orders.validateItem();
			var item = { 'productId' : $("#productId").val(),
					 'productName' : $("#product").val(),
					 'category' : $("#category option:selected").text(),
					 'quantity' : $("#quantity").val(),
					 'offerquantity' : $("#offerquantity").val()		
					};
			orders.pendingOrders[selectedIndex].items.push(item);
			$("#productId").val('');
			$("#product").val('');
			$("#category").val('Category').change();
			$("#quantity").val('');
			$("#offerquantity").val('');
		}catch(e){
			alert(e);
			throw e;
		}
		
		return false;
	},
	finish : function(){
		try{
			orders.addItem();
			$.mobile.changePage( "#saleOrderEntry", {
            	transition: "slide",
            	reverse: false,
            	changeHash: true
        	});
		}
		catch(e){
			return false;
		}
        return false;
	},
	saveOrder : function(){
		var selectedIndex = getObject(orders.pendingOrders,'selectedOrder',true);
		if(orders.pendingOrders[selectedIndex].items.length == 0){
			alert("No item to save");
			return false;
		}
		var selectedOrder = orders.pendingOrders[selectedIndex];
		selectedOrder["date"] = Date.now();
		delete selectedOrder["selectedOrder"];
		app.postData(selectedOrder,"order",showNotice);
		orders.pendingOrders.splice(selectedIndex,1);
		return false;
	},
	selectCategory : function(){
		var categorySelected = $(this).find("option:selected").text();
		if(categorySelected == "Category"){
			orders.products = getObjects(Store.get("products." + Store.get("user").Userid),"pmCategory","");
		}
		else{
			orders.products = getObjects(Store.get("products." + Store.get("user").Userid),"pmCategory",categorySelected,"exact");
		}
		return false;
	},
	searchProduct : function(){
	
		if($.trim($(this).val()).length == 0){
			return false;
		}
		var results = getObjects(orders.products,"pmProductName",$.trim($(this).val()));
		var node;
		$('#ui-results-products').children(".added").remove();
		$.each(results,function(i,record){
        	if(i >= 10){
        		return false;
        	}
        	node = $(".template:first",$("#ui-results-products")).clone().removeClass("template");
        	$(".productName",node).html(record.pmProductName);
        	$(".productCode",node).html(record.pmProductCode);
        	$(".productId",node).val(record.pmProductId);
        	$(node).addClass("added");
        	$(node).appendTo("#ui-results-products");
        });
        $(".products").unbind('tap', orders.selectProduct).bind('tap', orders.selectProduct);
        
        return false;
	},
	selectProduct : function(){
		var productId = $(this).find('input.productId').val();
		var productName = $(this).find('strong.productName').html();
		$("#product").val(productName);
		$("#productId").val(productId);
		$('#ui-results-products').children(".added").remove();
		$(this).blur();
		return false;
	}
	
}
//orders.pendingOrders = [];

function onSuccess(data){
    if(data.Name != undefined){
    	Store.set("user",data,stayloggedin);
    	app.initialize();      
    }
    else{
    	$.mobile.hidePageLoadingMsg();
        navigator.notification.alert("Incorrect Login",callBack,'Error');
        $("#txtUserName").val("");
        $("#txtPassword").val("");
    }
}


function login() {	
	var username = $("#txtUserName").val().trim();
    var password = $("#txtPassword").val().trim();
   
    if(username == "" || password == ""){
		//navigator.notification.alert("Please Fill The Details Completely",callBack, 'Error');
    	return false;
    }
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.loadingMessage = "Login";
    $.mobile.loadingMessageTheme = "c";
    $.mobile.showPageLoadingMsg();
    $.ajax({
    	type: "POST",
    	url: url + "do_login",
    	data: {
        	'username':username,
            'password':password
        },
        cache: true,
        dataType: "json",
        success: onSuccess,
        error: onerror
  	});
    return false;
}


function onerror(data){
	alert("failure");
    navigator.notification.alert("Error In Your Internet Connection",callBack,'Error');
    $.mobile.hidePageLoadingMsg();
    $("#txtUserName").val("");
    $("#txtPassword").val("");
}

function callBack(){
	alert("callback");
}
