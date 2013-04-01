/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).on('pageshow', '#home', function() {
    $(window).bind('resize', function() {
        $("#searchResults").height($(window).height() - $("#searchResults").offset().top - $("#footer").height() - 17);
    });
});

$(document).on('pageinit', '#home', function() {

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

    var tolerance = 25;
    $(window).bind('resize', function() {
        if ((window.orientation === 0 || window.orientation === 180) &&
                ((window.innerHeight + tolerance) < portraitScreenHeight)) {
            $("[data-role=footer]").hide();
        }
        else if ((window.innerHeight + tolerance) < landscapeScreenHeight) {
            $("[data-role=footer]").hide();
        }
        else {
            $("[data-role=footer]").show();
        }
    });
    $(".ui-collapsible").bind('click', collapse);
});

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
