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
	
		var url = tabs[0].url;
		console.log(url);
		var xhttp = new XMLHttpRequest();
		var payload = { addrURL: url, 
		highlight: [] };
		console.log(payload);

		xhttp.onreadystatechange = function() {
			console.log('callback called');
			if (xhttp.readyState == XMLHttpRequest.DONE) {
				console.log(xhttp.responseText);
			}
		};

		xhttp.open('POST', 'http://localhost:3000/urls');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		//xhttp.send(new URLSearchParams.append('url', url));
		xhttp.send(JSON.stringify(payload));

	});
};

getButton.onclick = function() {
	/*
	var url = chrome.storage.sync.get(['url'], function(result) {
		console.log("You have gotten: " + result.url);
	});
	*/
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            //document.getElementById('status').value = xhttp.status;
            //document.getElementById('status').innerHTML = xhttp.status;
            //document.getElementById('response').innerHTML = xhttp.responseText;
        }
	  };
	  
      xhttp.open("GET", "/notes/5b0f58ef03ccbdba8fb34264");
      xhttp.setRequestHeader("Content-Type", "application\/x-www-form-urlencoded");
	  xhttp.send();

};

loginButton.onclick = function() {
	window.open('login.html', '_blank');
};
