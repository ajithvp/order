/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var url;
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
	var selectedIndex = getObject(orders.pendingOrders,'selectedOrder',true);
	var selectedOrder = orders.pendingOrders[selectedIndex].items;
	$('#ui-items').children(".added").remove();  
	var quantity;
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
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
    return false;
}).delegate('#login', 'pageshow', function() {
	$("#btnLogin").unbind('tap',login);
	$("#btnLogin").bind('tap',login)
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
	alert(JSON.stringify(customers));
	if($.trim($(this).val()).length == 0){
		return false;
	}
	alert($(this).val());
	customers = getObjects(customers,'smStoreName',$(this).val());
	alert(JSON.stringify(customers));
	app.loadPage(customers);
}


function bindEvents() {
	$("#searchCustomer").off('keyup',searchCustomer).on('keyup',searchCustomer);
	
    $(".ui-collapsible").off('tap', collapse).on('tap', collapse);

    $(".logout").unbind("click", navigate);
    $(".logout").bind("tap", {page: "#login",hash:false,reverse:false}, navigate);

    $(".home").unbind("tap");
    $(".home").bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $(".addproduct").unbind('tap');
    $(".addproduct").bind("tap", {page: "#enterProducts"}, orders.addProduct);

    $(".item").unbind('tap', navigate);
    $(".item").bind("tap", {page: "#enterProducts", transition: "pop"}, orders.addProduct);

    $(".closebutton").unbind('tap', navigate);
    $(".closebutton").bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $("#btnFinish").unbind('tap', orders.finish);
    $("#btnFinish").bind("tap", orders.finish);
    
    $("#btnAddNext").unbind('tap');
    $("#btnAddNext").bind("tap", orders.addItem);

    $("#btnSave").unbind('tap', navigate);
    $("#btnSave").bind("tap", {page: "#savedOrder"}, navigate);

    $("#btnNextOrder").unbind('tap', navigate);
    $("#btnNextOrder").bind("tap", {page: "#saleOrderSelectCustomer"}, navigate);

    $(".orders").unbind('tap', navigate);
    $(".orders").bind("tap", {page: "#saleOrders"}, navigate);
	
	$("#category").unbind('change',orders.selectCategory).bind('change',orders.selectCategory);
	
	$("#product").unbind('keyup',orders.searchProduct).bind('keyup',orders.searchProduct);

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
