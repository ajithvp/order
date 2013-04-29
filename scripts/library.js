/**
* @author: Ajith VP
* @email: ajith@ttransforme.com
* @mobile : 09747874509
* @version : 0.1
* 
*/

var Store = {
	initialize: function() {
        
    },
    getStore: function(name) {
    	return { name : this.appName + "." + name }
    },
    set: function(name,data,period) {
    	if(!this.isSet(name)) {
    		var storage = this.getStore(name);
    		var obj = {
    					data : data,
    					time : Math.floor(Date.now() / 1000),
    					period : period    			
    				}
    		window.localStorage[storage.name] = JSON.stringify(obj);
    	}
    },
    get: function(name) {
        if(this.isSet(name)) {
        	var storage = this.getStore(name);
        	var obj = JSON.parse(window.localStorage[storage.name]);
        	return obj.data;
        }
        return false;
    },
    clear: function(name) {
    	var storage = this.getStore(name);
    	localStorage.removeItem(storage.name);
    },
    clearAll: function() {
        var strLength = this.appName.length;
        var appName = this.appName;
    	Object.keys(localStorage) 
        	.forEach(function(key){ 
        	    if (key.substring(0,strLength) == appName) 
        	        localStorage.removeItem(key); 
        	}); 
    },
    isSet: function(name) {
    	var storage = this.getStore(name);
        var now = Math.floor(Date.now() / 1000);
        if(window.localStorage[storage.name] == undefined){
        	return false;
        }
        var obj = JSON.parse(window.localStorage[storage.name]);
        if((now - parseInt(obj.time) >  parseInt(obj.period)) && parseInt(obj.period) != 0){
        	this.clear(name);
        	return false;
        }
        return true;
    }    
};

Store.appName = "GetMyOrder";
