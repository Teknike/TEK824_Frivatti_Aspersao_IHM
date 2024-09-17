(function (TcHmi) {
	//Register to the global onInitialized event, the anonymous function will be called only one time and will check the parameter of the url and reloads the page depending on the parameter
	let destr = TcHmi.EventProvider.register("onInitialized", function () {
		// This event will be raised only once, so it is nice to cleanup
		destr();

		//Get the complete url from browser and splitting the url at "?" in an array, e.g. http://127.0.0.1:1010/?View=View1
		let paramArray = window.location.href.split('?');
		//Create temp variables for the path parameter
		let pathParam = "";

		//Search in paramArray of splitted url for 'View=', e.g. "View=View1"
		for (i = 0; i < paramArray.length; i++) {
			if (paramArray[i].indexOf('View=') === 0) {
				pathParam = paramArray[i].split('/').join('');
				break;
			}
		}
	    //https://192.168.100.128:1020/?View=IHMCamara
		//Setting of viewName depending on pathParam
		if (pathParam === "View=Desktop") {
			TcHmi.View.load('Desktop.view', function (data) {
				//Optional: Callback after the page is loaded
			});
		}
		else if (pathParam === "View=IHMCamara") {
			TcHmi.View.load('IHMCamara.view', function (data) {
				//Optional: Callback after the page is loaded
			});
		}
		else if (pathParam === "View=Mobile") {
		    TcHmi.View.load('Mobile.view', function (data) {
				//Optional: Callback after the page is loaded
			});
		}

		//Optional: direct mode, no fallback if view does not exist
		//let viewName = pathParam.substr(pathParam.indexOf("=") + 1);
		//TcHmi.View.load(viewName + '.view', function (data) {
		//Optional: Callback after the page is loaded
		//});		
	});
})(TcHmi);
