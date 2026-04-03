// Background service worker for DISCERN extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('DISCERN extension installed')
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could implement auto-analysis here if desired
    console.log('Page loaded:', tab.url)
  }
})

// Handle extension icon click (opens popup automatically via manifest)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked')
})
