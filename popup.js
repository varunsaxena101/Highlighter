let saveButton = document.getElementById('save');
let getButton = document.getElementById('get');
let loginButton = document.getElementById('login');

saveButton.onclick = function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//chrome.tabs.executeScript(tabs[0].id, {code: "document.body.style.backgroundColor = 'yellow'"});
		//chrome.tabs.executeScript(tabs[0].id, {code: "alert('You have clicked the button')"});
		//
		//this is where you can do stuff with the current page when the button is clicked
		
		/*
		var url = tabs[0].url;
		chrome.storage.sync.set({'url': url}, function() {
			console.log("The following URL has been saved: " + url);
		});
		*/
	
		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       console.log(xhttp.responseText);
		    }
		};

		xhttp.open("GET", "localhost:3000/urls");
		xhttp.send();

	});
};

getButton.onclick = function() {
	var url = chrome.storage.sync.get(['url'], function(result) {
		console.log("You have gotten: " + result.url);
	});
};

loginButton.onclick = function() {
	window.open('login.html', '_blank');
};
