// jquery and device loads
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}
// device APIs are available
function onDeviceReady() {
	// Now safe to use device APIs
}

// check if app put in background
document.addEventListener("pause", onPause, false);

function onPause() {
	// Handle the pause event
}

// check if app retrieved from background
document.addEventListener("resume", onResume, false);

function onResume() {
	// Handle the resume event
}
