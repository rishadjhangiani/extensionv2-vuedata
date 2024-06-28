chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injectSidebar.js']
    });
  } catch (error) {
    console.error(`failed to execute: ${error}`);
  }
});
