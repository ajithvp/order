
var url;

$(document).delegate('#saleOrderSelectCustomer', 'pageinit', function() {
	url = "http://www.getmyorder.in/index.php/ajax/";
	//url = "http://localhost/projects/GetMyOrder/ajax.php?"; 
	return false;
});


var app = {
	initialize : function (){
		var self = this;
		if(!Store.isSet("appData." + Store.get("user").Userid)){
			this.getAppData();
		}
		else{
			this.loadPage();
		}
	},
	fetch : function (model){
		alert(url+model);
		$.getJSON(url+model, function(data) {
			Store.set(model+"." + Store.get("user").Userid, data,0);
		});
	},
	getAppData : function(){
		$.getJSON(url+"customers", function(data) {
			Store.set("customers." + Store.get("user").Userid, data,0);
		}).done(function(){
			$.getJSON(url+"products", function(data) {
				Store.set("products." + Store.get("user").Userid, data,0);
			}).done(function(){
				app.loadPage();
				Store.set("appData." + Store.get("user").Userid,"1",0);
			});
		})
	},
	loadPage : function(){
		$.mobile.changePage( "#saleOrderSelectCustomer", {
            transition: "slide",
            reverse: false,
            changeHash: false
        });
       	$.mobile.hidePageLoadingMsg();
    	$("#txtUserName").val("");
    	$("#txtPassword").val("");
	},
}

function onSuccess(data){
    if(data.Name != undefined){
    	Store.set("user",data,0);
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