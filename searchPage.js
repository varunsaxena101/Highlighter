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
			console.log(response);
			console.log(typeof response);
			populateList(response, searchText);
		}
	};

	var params = "search=" + searchText;
	var targetURL = 'http://localhost:3000/urls?' + params; 
	xhttp.open("GET", targetURL);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
	
};

function populateList(list, searchText) {
	var ul = document.getElementById('urlList');

	//clear the contents of the last search
	ul.innerHTML = "";

	for (var i = 0; i < list.length; i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		var p = document.createElement("p");
		a.setAttribute("href", list[i].addrURL);
		a.setAttribute("target", "_blank");
		a.innerHTML = list[i].title;
		p.innerHTML = highlightWords(list[i].highlight, searchText);
		li.appendChild(a);
		li.appendChild(p);
		ul.appendChild(li);
	}
}

function highlightWords(str, search) {
	var i = str.search(new RegExp(search, 'i'));
	if (i != -1) {
		str = str.substring(0, i) + "<span class='highlight'>" + str.substring(i, i + search.length) + "</span>" + str.substring(i + search.length);
	} else {
		var strArr = search.split(" ");
		for (var a = 0; a < strArr.length; a++) {
			var i = str.search(new RegExp(strArr[a], 'i'));
			if (i != -1) {
				str = str.substring(0, i) + "<span class='highlight'>" + str.substring(i, i + strArr[a].length) + "</span>" + str.substring(i + strArr[a].length);
			}
		}
	}
	
	return str;
}