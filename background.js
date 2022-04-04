chrome.runtime.onInstalled.addListener(() => {
  console.log('I hope this brings back fond moments of yesterday :)');
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  console.log(details.url);
  if (details.url == "https://www.airbnb.com/trips/v1") {
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: {tabId: details.tabId, allFrames: false},
        files: ['makeMap.js'],
      });
    }, 1000);
  }
});