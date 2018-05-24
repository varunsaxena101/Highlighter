document.addEventListener("mouseup", highlight);

function myAlert() {
	alert("This mouseup event listener works!");
}

function doSomething() {
	if (document.getSelection() != '') {
		document.body.style.background = 'yellow';
	} else {
		document.body.style.background = 'white';
	}
}

function highlight() {

	var selection = document.getSelection();
	if (selection.toString() !== "") {
		var range = selection.getRangeAt(0);
		var span = document.createElement("span");
		span.className = "highlight";
		span.style.background = 'yellow';
		span.innerHTML = range.toString();
		range.deleteContents();
		range.insertNode(span);
	}
}