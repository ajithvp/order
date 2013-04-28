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
    	return { name : this.appName + "." + name,
    			 time : this.appName + "." + name + ".time",
    			 period : this.appName + "." + name + ".period",
    			 json : this.appName + "." + name + ".isJson"
    			}
    },
    set: function(name,data,period) {
    	if(!this.isSet(name)) {
    		var storage = this.getStore(name);
    		if(this.getType(data)=="string"){
    			window.localStorage[storage.name] = data;
    			window.localStorage[storage.json] = false;
    		}
    		else if(this.getType(data)=="object"){
    	    	window.localStorage[storage.name] = JSON.stringify(data);
    	    	window.localStorage[storage.json] = true;
    		}
    		window.localStorage[storage.time] = Math.floor(Date.now() / 1000);
    		window.localStorage[storage.period] = period;
    	}
    },
    get: function(name) {
        if(this.isSet(name)) {
        	var storage = this.getStore(name);
        	return (window.localStorage[storage.json] == true) ? JSON.parse(window.localStorage[storage.name]) : window.localStorage[storage.name];
        }
        return false;
    },
    clear: function(name) {
    	var storage = this.getStore(name);
    	localStorage.removeItem(storage.name);
        localStorage.removeItem(storage.time);
        localStorage.removeItem(storage.period);
        localStorage.removeItem(storage.json);
    },
    clearAll: function() {
        var strLength = this.appName.length;
    	Object.keys(localStorage) 
        	.forEach(function(key){ 
        	    if (key.substring(0,strLength) == this.appName) {
        	        localStorage.removeItem(key); 
        	    } 
        	}); 
    },
    isSet: function(name) {
    	var storage = this.getStore(name);
        var now = Math.floor(Date.now() / 1000);
        if(window.localStorage[storage.name] == undefined){
        	return false;
        }
        if((now - parseInt(window.localStorage[storage.time]) >  parseInt(window.localStorage[storage.period])) && parseInt(window.localStorage[storage.period]) != 0){
        	this.clear(name);
        	return false;
        }
        return true;
    },
    getType: function(object){
    	if (object === null) {
        	return "null";
    	}
    	else if (object === undefined) {
        	return "undefined";
    	}
    	else if (object.constructor === "".constructor) {
        	return "string";
    	}
    	else if (object.constructor === [].constructor) {
    	    return "array";
    	}
    	else if (object.constructor === {}.constructor) {
    	    return "object";
    	}
    	else {
    	    return "don't know";
    	}
    }
    
};

Store.appName = "GetMyOrder";
