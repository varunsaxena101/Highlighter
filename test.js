let searchButton  = document.getElementById('search');
let textArea = document.getElementById('searchTextArea');

searchButton.onclick = function() {
	var searchText = textArea.value;
	console.log(searchText)
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
			console.log(xhttp.responseText);
			var response = JSON.parse(xhttp.responseText);
			console.log(response.urlList);

			populateList(response.urlList);
		}
	};

	var params = "search=" + searchText;
	var targetURL = 'http://localhost:3000/urls?' + params; 
	xhttp.open("GET", targetURL);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
	
};

function populateList(list) {
	var ul = document.getElementById('urlList');
	for (var i = 0; i < list.length; i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute("href", list[i]);
		a.setAttribute("target", "_blank");
		a.innerHTML = list[i];
		li.appendChild(a);
		ul.appendChild(li);
	}
}