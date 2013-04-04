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

document.addEventListener("backbutton", function (e) {
    if ($.mobile.activePage.is('#saleOrderSelectCustomer')) {
        e.preventDefault();
        navigator.app.exitApp();
    } else {
        navigator.app.backHistory()
    }
}, false);

document.addEventListener('deviceready', function (e) {}, false);


$(document).on('pageinit', '#saleOrderSelectCustomer', function() {
    onResize();
    $(window).bind('resize', onResize);    
    
    $(".ui-collapsible").off('click', collapse).on('click', collapse);        
    $(".home").off('tap', collapse).on("tap",{page:"saleOrderSelectCustomer"},navigate);
    $(".customer").off('click', collapse).on("click",{page:"saleOrderEntry"},navigate);    
    $(".addproduct").off('mousedown', collapse).on("mousedown",{page:"enterProducts",transition:"pop"},navigate);
    $(".item").off('click', collapse).on("click",{page:"enterProducts",transition:"pop"},navigate);
    $(".closebutton").off('click', collapse).on("click",{page:"saleOrderSelectCustomer"},navigate);
    $("#btnFinish").off('click', collapse).on("click",{page:"saleOrderEntry"},navigate);
    $("#btnSave").off('click', collapse).on("click",{page:"savedOrder"},navigate);
    $("#btnNextOrder").off('click', collapse).on("click",{page:"saleOrderSelectCustomer"},navigate);
    $(".orders").off('click', collapse).on("click",{page:"saleOrders"},navigate);
    
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

function navigate(event){
	 event.stopPropagation();
        event.preventDefault();
	var transition = (event.data.transition==undefined) ? "slide" : event.data.transition;
	var hash = (event.data.hash==undefined) ? false : event.data.hash;
	var reverse = (event.data.reverse==undefined) ? true : event.data.reverse;
	setTimeout(function (){

             //something you want delayed

         }, 5000);
		$.mobile.changePage( "#"+event.data.page, {
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
