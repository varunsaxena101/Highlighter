let saveButton = document.getElementById('save');
let getButton = document.getElementById('get');

saveButton.onclick = function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//chrome.tabs.executeScript(tabs[0].id, {code: "document.body.style.backgroundColor = 'yellow'"});
		//chrome.tabs.executeScript(tabs[0].id, {code: "alert('You have clicked the button')"});
		//
		//this is where you can do stuff with the current page when the button is clicked
		
		var url = tabs[0].url;
		chrome.storage.sync.set({'url': url}, function() {
			console.log("The following URL has been saved: " + url);
		});

	});
};

getButton.onclick = function() {
	var url = chrome.storage.sync.get(['url'], function(result) {
		console.log("You have gotten: " + result.url);
	});
};
