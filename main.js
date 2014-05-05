chrome.app.runtime.onLaunched.addListener(function(){
	var screenWidth = screen.availWidth,
	 screenHeight = screen.availHeight;

	chrome.app.window.create('index.html',{
		"bounds": {
			"width": 3*screenWidth/4,
			"height": 3*screenHeight/4
		}
	});
});