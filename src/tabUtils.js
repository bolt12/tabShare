import {Html5Qrcode} from "html5-qrcode"

// Get highlighted tabs
export async function getHighlightedTabs() {
  return new Promise((resolve) => {
    chrome.windows.getLastFocused({ windowTypes: ['normal', 'panel', 'app'] }, async (window) => {
      const highlightedTabs = await chrome.tabs.query({ windowId: window.id, highlighted: true });
      resolve(highlightedTabs);
    });
  });
}

// Generate tab group object
export async function generateTabGroupObject(tabs) {
  const groupTabs = document.getElementById("groupTabsCheck").checked;
  const groupName = document.getElementById("shareGroupName").value;
  const preserveGroups = document.getElementById("preserveGroupsCheck").checked;

  let tabGroupObject = { groups: [] };

  if (groupTabs) {
    tabGroupObject.groups.push({ name: groupName || "Untitled Group", tabs: tabs.map(tab => tab.url) });
  } else if (preserveGroups) {
    const groupMap = {};

    for (const tab of tabs) {
      if (tab.groupId === -1) {
        tabGroupObject.groups.push({ name: "NO_GROUP", tabs: [tab.url] });
      } else {
        if (!groupMap[tab.groupId]) {
          const group = await chrome.tabGroups.get(tab.groupId);
          groupMap[tab.groupId] = { name: group.title, tabs: [] };
        }
        groupMap[tab.groupId].tabs.push(tab.url);
      }
    }

    tabGroupObject.groups.push(...Object.values(groupMap));
  } else {
    tabGroupObject.groups.push({ name: "NO_GROUP", tabs: tabs.map(tab => tab.url) });
  }

  return new Promise((resolve) => resolve(tabGroupObject));
}

// Save the tab group object as JSON
export function saveAsJSON(tabGroupObject) {
  const filename = "tabShare.json";
  const blob = new Blob([JSON.stringify(tabGroupObject)], { type: "application/json" });
  const blobURL = window.URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename);

  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }

  document.body.appendChild(tempLink);
  tempLink.click();

  setTimeout(() => {
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}

// Generate a QR Code for the tab group object
export function generateQRCode(tabGroupObject) {
  const qrCodeContainer = document.getElementById("qrCodeContainer");
  const qrCodeElement = document.getElementById("qrCodeCanvas");
  const qrCodeDownload = document.getElementById("downloadQRCode");

  const text = JSON.stringify(tabGroupObject);

  const qr = new QRious({
    element: qrCodeElement,
    value: text,
    size: 200
  });

  qrCodeDownload.addEventListener("click", () => {
      const tempLink = document.createElement("a");
      tempLink.href = qrCodeElement.toDataURL("image/jpg");
      tempLink.download = "qrcode.jpg";
      tempLink.click();
    });

  qrCodeContainer.style.display = "flex";
  qrCodeContainer.classList.remove("hidden");
}

export async function loadTabsFromTabGroupObject(tabGroupObject) {
  const groups = tabGroupObject.groups;
  const promises = [];

  for (const group of groups) {
    const tabs = group.tabs;
    const tabsRes = [];

    for (const tab of tabs) {
      const validityResult = isValidHttpUrl(tab);
      if (!validityResult.result) {
        displayError(`${tab}: is not a valid HTTP URL | ${validityResult.error}`);
        return;
      } else {
        const createdTab = await chrome.tabs.create({ url: tab });
        tabsRes.push(createdTab.id);
      }
    }

    if (group.name !== "NO_GROUP") {
      const p = chrome.windows.getLastFocused({ windowTypes: ["normal"] }).then(async (lastFocusedWindow) => {
        await chrome.tabs.group({
          tabIds: tabsRes,
          createProperties: { windowId: lastFocusedWindow.id },
        }).then(async (id) => {
          await chrome.tabGroups.update(id, { title: group.name, collapsed: true });
        });
      });

      promises.push(p);
    }
  }

  await Promise.all(promises);
}

export async function scanQRCode() {
  // Fetch video element
  const video = document.getElementById('video');
  video.classList.remove("hidden");

  // Create a new instance of Html5Qrcode
  const html5QrcodeScanner = new Html5QrcodeScanner("video", { fps: 10, qrbox: 250 });

  html5QrcodeScanner.render(async (decodedText) => {
    try {
      // Parse the scanned content as JSON
      const tabGroupObject = JSON.parse(decodedText);

      // Load the tabs from the parsed content
      await loadTabsFromTabGroupObject(tabGroupObject);
      window.close()
    } catch (error) {
      displayError(`Error parsing QR code content: ${error}`);
    }
  });
}

function displayError(message) {
  const errorElement = document.getElementById("errorContainer");

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function hideError() {
  const errorElement = document.getElementById("errorContainer");

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return { result: false, error: "Invalid URL" };
  }

  return url.protocol === "http:" || url.protocol === "https:"
    ? { result: true }
    : { result: false, error: "Invalid protocol" };
}
