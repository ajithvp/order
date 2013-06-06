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

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function getObjects(obj, key, val,matching) {
	if(typeof matching == "undefined"){
		matching = "similar";
	}
	if(typeof val == "string"){
		val = val.toLowerCase();
	}
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val,matching));
        } else{
        	if(i !== key) continue;
        	if(matching == "similar"){
        		if((obj[key].toLowerCase()).indexOf(val) !== -1) {
            		objects.push(obj);
        		}
        	}else{
        		if(typeof obj[key] == "string"){
        			if(obj[key].toLowerCase() === val ) {
            			objects.push(obj);
        			}
        		}
        	}
        }
    }
    return objects;
}
function getObject(obj, key, val){
	if(typeof val == "string"){
		val = val.toLowerCase();
	}
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
        	for(var j in obj[i]){
        		if(j !== key) continue;
        		if(typeof obj[i][key] == "string"){
					if(obj[i][key].toLowerCase() == val){
            			return i;	
            		}
				}else{
        			if(obj[i][key] == val){
            			return i;	
            		}
            	}
        	}
        }
    }
    return false;
}

function getDistinct(obj,key){

	var object = [];
	$.each(obj, function(index, value) {
    	if ($.inArray(value[key], object)==-1) {
    	    object.push(value[key]);
    	}
	});
	return object;
}
function removeElement(obj,key,val){
	$.each(obj, function(index, value) {
    	if (value[key] == val) {
    	    delete obj[index];
    	}
	});
	return obj;
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
