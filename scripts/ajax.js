
var url;

$(document).delegate('#saleOrderSelectCustomer', 'pageinit', function() {
	url = "http://www.getmyorder.in/index.php/ajax/";
	//url = "http://localhost/projects/GetMyOrder/ajax.php?"; 
	return false;
});


var app = {
	initialize : function (){
		if(!Store.isSet("customerData")){
			
		}
	},
	

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



function onSuccess(data){
    if(data.Name != undefined){
    	Store.set("user",data,0);
    	$.when(app.initialize()).then(function(){
    		$.mobile.changePage( "#saleOrderSelectCustomer", {
            	transition: "slide",
            	reverse: false,
            	changeHash: false
        	});
    	});
    	
        
    }
    else{
        navigator.notification.alert("Incorrect Login",callBack,'Error');
        $("#txtUserName").val("");
        $("#txtPassword").val("");
    }
    $.mobile.hidePageLoadingMsg();
    $("#txtUserName").val("");
    $("#txtPassword").val("");
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
