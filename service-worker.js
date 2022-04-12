//https://gist.github.com/akirattii/2f55bb320f414becbc42bbe56313a28b
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		chrome.action.setBadgeText({ text: request.alertIcon });

		// Note: Returning true is required here!
		//  ref: http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
		sendResponse({ rs: "icon set" });
		return true;
	});
