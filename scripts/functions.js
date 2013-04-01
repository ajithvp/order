/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).on('pageshow', '#saleOrderSelectCustomer', function() {
    //onPageShow();
});
$(document).on('pageshow', '#saleOrderEntry', function() {
    //onPageShow();
});


$(document).on('pageinit', '#saleOrderSelectCustomer', function() {
    onResize();
    $(window).bind('resize', onResize);
    
    $(".ui-collapsible").bind('click', collapse);
    $(".home").bind("click",{page:"saleOrderSelectCustomer"},navigate);
    $(".customer").bind("click",{page:"saleOrderEntry"},navigate);
    $(".addproduct").bind("click",{page:"enterProducts",transition:"pop"},navigate);
    $(".item").bind("click",{page:"enterProducts",transition:"pop"},navigate);
    $(".closebutton").bind("click",{page:"saleOrderSelectCustomer"},navigate);
    $("#btnFinish").bind("click",{page:"saleOrderEntry"},navigate);
    $("#btnSave").bind("click",{page:"savedOrder"},navigate);
    $("#btnNextOrder").bind("click",{page:"saleOrderSelectCustomer"},navigate);
    $(".orders").bind("click",{page:"saleOrders"},navigate);
    $("#btnExit").bind("click",function(e){
    	e.preventDefault();
        navigator.app.exitApp();
    });
});

function onResize(){
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

function navigate(params){
	
	var transition = (params.data.transition==undefined) ? "slide" : params.data.transition;
	var hash = (params.data.hash==undefined) ? false : params.data.hash;
	var reverse = (params.data.reverse==undefined) ? false : params.data.reverse;
	
	$.mobile.changePage( "#"+params.data.page, {
		transition: transition,
        changeHash: hash,
        reverse:reverse
    });
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
