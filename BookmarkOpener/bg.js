chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === "openBookmarks" && request.query) {
    chrome.tabs.create({ url: `chrome://bookmarks/?q=${request.query}` });
  }
});