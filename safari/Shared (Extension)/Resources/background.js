browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request: ", request);
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.id, { file: 'bitty.js' });
});
