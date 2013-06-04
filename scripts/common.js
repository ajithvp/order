/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var url;
var stayloggedin = 0;
var editMode = true;
$(document).on('pagebeforeshow', '#saleOrderSelectCustomer',  function(){
	url = "http://www.getmyorder.in/index.php/ajax/";
	//url = "http://localhost/projects/getmyorder.in/index.php/ajax/";
	if(!Store.isSet("user")){
    	$.mobile.changePage("#login", {
    		transition: "slide",
    		changeHash: false,
    		reverse: false
    	});    
    	return false;
    }
}); 
$(document).delegate('#saleOrderSelectCustomer', 'pageinit', function() {
	url = "http://www.getmyorder.in/index.php/ajax/";
	//url = "http://localhost/projects/getmyorder.in/index.php/ajax/"; 
   	if(!Store.isSet("user")){
    	$.mobile.changePage("#login", {
    		transition: "slide",
    		changeHash: false,
    		reverse: false
    	});
    	return false;
    }
    onResize();
    $(window).off('resize').on('resize', onResize);
    app.initialize();
    bindEvents();
    return false;

}).delegate('#saleOrderSelectCustomer', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#saleOrderEntry', 'pageshow', function() {
	var selectedOrder;
	var quantity;
	if(editMode){
		var selectedIndex = getObject(orders.pendingOrders,'selectedOrder',true);
		selectedOrder = orders.pendingOrders[selectedIndex].items;
	}else{
		selectedOrder = orders.savedOrders.items;
	}
	
	$('#ui-items').children(".added").remove();  
	$.each(selectedOrder,function(i,record){
		node = $(".template",$("#ui-items")).clone().removeClass("template");
        $(".productName",node).html(record.productName);
        $(".category",node).html(record.category);
        if(record.offerquantity == 0 || record.offerquantity == ''){
        	quantity  = "Qty " + record.quantity;
        }
        else{
        	quantity  = "Qty " + record.quantity + "/" + record.offerquantity;
        }
        $(".quantity",node).html(quantity);
        $(".productId",node).val(record.productId);
        $(node).addClass("added");
        $(node).appendTo("#ui-items");
	});
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#saleOrders', 'pageshow', function() {
	alert("pageshow");
	var orders = Store.get("order." + Store.get("user").Userid);
	var totalOrders = 0;
	var todaysOrders = 0;
	var savedOrders = 0;
	var orderNo = 0;
	var today = Date.now();
	$('#ui-orders').children(".added").remove();
	alert("remove");
	if(orders){
		alert("orders");
		$.each(orders,function(i,record){
			alert("loop");
			totalOrders++;
			if(Math.abs((today-record.date)/(60*60*24*1000)).toFixed(0)==0){
				todaysOrders++;
			}
			if(record.savedStatus){
				savedOrders++;
				orderNo = record.referenceNo;
			}else{
				orderNo = "";
			}
			node = $(".template",$("#ui-orders")).clone().removeClass("template");
        	$(".orderno",node).html("Order No : " + orderNo);
        	$(".storeName",node).html(record.storeName);
        	$(".storeCode",node).html(record.storeCode);
        	$(".location",node).html(record.location);
        	$(".storeId",node).val(record.storeId);
        	$(".serialNo",node).val(record.serialNo);
        	$(node).addClass("added");
        	$(node).appendTo("#ui-orders");
        	alert("append");
		});
		$("#totalOrders").html("Total Orders : " + totalOrders);
		$("#todaysOrders").html("Todays Orders : " + todaysOrders);
	}
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#login', 'pageshow', function() {
	$("#btnLogin").unbind('tap',login).bind('tap',login);
	$("input[type='radio']").bind( "change", function(event) {
 		if($("on").attr("checked") == "checked"){
 			stayloggedin = 0;
 		}else{
 			stayloggedin = 1000;
 		}
 		
 	});
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#savedOrder', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#enterProducts', 'pagebeforeshow', function() {
	var category = Store.get("category." + Store.get("user").Userid);
	$("#category").html("");
	$("<option>Category</option>").appendTo("#category");
	$.each(category,function(i,data){
		$("<option>"+data+"</option>").appendTo("#category");
	});
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
});

document.addEventListener("backbutton", function(e) {
	alert("back button");
    if ($.mobile.activePage.is('#saleOrderSelectCustomer')) {
        e.preventDefault();
        navigator.app.exitApp();
    } else {
        navigator.app.backHistory();
    }
}, false);

document.addEventListener('deviceready', function(e) {
}, false);

function searchCustomer(){
	var customers = Store.get("customers." + Store.get("user").Userid);
	if($.trim($(this).val()).length == 0){
		return false;
	}
	customers = getObjects(customers,'smStoreName',$(this).val());
	app.loadPage(customers);
}


function bindEvents() {
	$("#searchCustomer").off('keyup',searchCustomer).on('keyup',searchCustomer);
	
    $(".ui-collapsible").off('tap', collapse).on('tap', collapse);

    $(".logout").unbind("tap", logout).bind("tap", logout);
    
    $("#btnCancel").unbind("tap").bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);    

    $(".home").unbind("tap").bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $(".closebutton").unbind('tap', navigate).bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $(".viewOrder").unbind("tap",orders.viewOrder).bind("tap",orders.viewOrder);
	if(editMode){
		$(".viewItem").unbind('tap',showViewPopUp);
		$(".addproduct").unbind('tap').bind("tap", {page: "#enterProducts"}, orders.addProduct);
		$(".editItem").unbind('tap',showEditPopUp).bind('tap',showEditPopUp);
	}else{
		$(".addproduct").unbind('tap');
		$(".editItem").unbind('tap',showEditPopUp);
		$(".viewItem").unbind('tap',showViewPopUp).bind('tap',showViewPopUp);
	}
	
    $("#btnFinish").unbind('tap', orders.finish).bind("tap", orders.finish);
    
    $("#btnAddNext").unbind('tap').bind("tap", orders.addItem);

    $("#btnSave").unbind('tap', orders.saveOrder).bind("tap", orders.saveOrder);

    $("#btnNextOrder").unbind('tap', navigate).bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $(".orders").unbind('tap', navigate).bind("tap", {page: "#saleOrders"}, navigate);
	
	$("#category").unbind('change',orders.selectCategory).bind('change',orders.selectCategory);
	
	$("#product").unbind('keyup',orders.searchProduct).bind('keyup',orders.searchProduct);

}
function logout(){
	Store.clear("user");
	$.mobile.changePage( "#login", {
    	transition: "slide",
        reverse: false,
        changeHash: false
    });
}

function showEditPopUp(){
	$('#editItem').find(".ui-first-child").html($(this).find(".productName").html());
	$('#editItem').find(".productId").html($(this).find(".productId").val());
	$('#editItem').popup("open");
}

function showViewPopUp(){
	$('#viewItem').find(".ui-first-child").html($(this).find(".productName").html());
	$('#viewItem').find(".productId").html($(this).find(".productId").val());
	$('#viewItem').popup("open");
}

function onResize() {
    var tolerance = 25;
    var portraitScreenHeight;
    var landscapeScreenHeight;

    if (window.orientation === 0 || window.orientation === 180) {
        potraitScreenHeight = $(window).height();
        landscapeScreenHeight = $(window).width();
    }
    else {
        portraitScreenHeight = $(window).width();
        landscapeScreenHeight = $(window).height();
    }
    if ((window.orientation === 0 || window.orientation === 180) && ((window.innerHeight + tolerance) < portraitScreenHeight)) {
        $("[data-role=footer]").hide();
    }
    else if ((window.innerHeight + tolerance) < landscapeScreenHeight) {
        $("[data-role=footer]").hide();
    }
    else {
        $("[data-role=footer]").show();
    }
    $("#searchResults").height($(window).height() - $("#searchResults").offset().top - $("#footer").height() - 17);
    $(".ui-link-inherit").width($(window).width() - 100);
}

function navigate(event) {
    $.mobile.showPageLoadingMsg();
    event.preventDefault();
    var transition = (event.data.transition === undefined) ? "slide" : event.data.transition;
    var hash = (event.data.hash === undefined) ? true : event.data.hash;
    var reverse = (event.data.reverse === undefined) ? true : event.data.reverse;
    $.mobile.changePage(event.data.page, {
        transition: transition,
        changeHash: hash,
        reverse: reverse
    });
    $.mobile.hidePageLoadingMsg();
    return false;
}

function collapse() {
    if ($(this).hasClass('ui-collapsible-collapsed')) {
        $(this).removeClass('ui-collapsible-collapsed');
        $(this).find("span.ui-icon").removeClass("ui-icon-plus");
        $(this).find("span.ui-icon").addClass("ui-icon-minus");
        $(this).children("div.ui-collapsible-content").removeClass("ui-collapsible-content-collapsed");
    } else {
        $(this).addClass('ui-collapsible-collapsed');
        $(this).find("span.ui-icon").removeClass("ui-icon-minus");
        $(this).find("span.ui-icon").addClass("ui-icon-plus");
        $(this).children("div.ui-collapsible-content").addClass("ui-collapsible-content-collapsed");
    }
}
