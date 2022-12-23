// chrome.runtime.onInstalled.addListener(function() {
// });

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    files: ['./open_in_bitty.js'],
    target: {tabId:tab.id, allFrames:false}
  })
});
