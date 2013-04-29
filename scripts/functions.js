/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).delegate('#saleOrderSelectCustomer', 'pageinit', function() {

}).delegate('#saleOrderSelectCustomer', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
}).delegate('#saleOrderEntry', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
}).delegate('#saleOrders', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
}).delegate('#login', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
}).delegate('#savedOrder', 'pageshow', function() {
    onResize();
    $(window).off('resize').on('resize', onResize);
    bindEvents();
});

document.addEventListener("backbutton", function(e) {
    if ($.mobile.activePage.is('#saleOrderSelectCustomer')) {
        e.preventDefault();
        navigator.app.exitApp();
    } else {
        navigator.app.backHistory();
    }
}, false);

document.addEventListener('deviceready', function(e) {
}, false);


function bindEvents() {

    $(".ui-collapsible").off('tap', collapse).on('tap', collapse);

    $(".logout").unbind("click", navigate);
    $(".logout").bind("tap", {page: "login.html"}, navigate);

    $(".home").unbind("tap");
    $(".home").bind("tap", {page: "index.html"}, navigate);

    $(".customer").unbind('tap', navigate);
    $(".customer").bind("tap", {page: "saleorderentry.html"}, navigate);

    //$(".addproduct").unbind('tap', navigate);
    $(".addproduct").bind("tap", function() {
        alert("dd");
        try {
            alert("d");
            $("enterproducts.html").popup('open');
        } catch (e) {
            alert(e);
        }
    });

    $(".item").unbind('tap', navigate);
    $(".item").bind("tap", {page: "#enterProducts", transition: "pop"}, navigate);

    $(".closebutton").unbind('tap', navigate);
    $(".closebutton").bind("tap", {page: "index.html"}, navigate);

    $("#btnFinish").unbind('tap', navigate);
    $("#btnFinish").bind("tap", {page: "saleorderentry.html"}, navigate);

    $("#btnSave").unbind('tap', navigate);
    $("#btnSave").bind("tap", {page: "savedorder.html"}, navigate);

    $("#btnNextOrder").unbind('tap', navigate);
    $("#btnNextOrder").bind("tap", {page: "index.html"}, navigate);

    $(".orders").unbind('tap', navigate);
    $(".orders").bind("tap", {page: "saleorders.html"}, navigate);


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
    var hash = (event.data.hash === undefined) ? false : event.data.hash;
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