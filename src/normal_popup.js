// let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Top level file input form object;
const fileSelector = document.getElementById("fileSelector");
const shareButton = document.getElementById("shareButton");
const groupSwitch = document.getElementById("groupSwitch");
const groupInput = document.getElementById("groupInput");


fileSelector.addEventListener("change", (event) => {
  // Get the file
  const [file] = event.target.files;
  const reader = new FileReader();

  // Event Listener for file load
  reader.addEventListener("load", async () => {
    try {
      const parsedFile = JSON.parse(reader.result);
      cleanError();

      const groups = parsedFile["groups"];
      if (groups) {
        cleanError();

        // Check validity of URLs for all groups
        for (const group of groups) {
          const tabs = group.tabs;
          for (const tab of tabs) {
            const validityResult = isValidHttpUrl(tab);
            if (! validityResult.result ) {
              showError ( tab
                        + ": is not a valid HTTP URL | "
                        + validityResult.error);
              return;
            } else {
              // All good
              cleanError();
            }
          }
        }

        const promises = [];

        // Open tabs
        for (const group of groups) {
          const tabs = group.tabs;
          const tabsRes = [];

          // Opening tabs and collecting all ids
          for (const tab of tabs) {
            const createdTab =
              await chrome.tabs.create({
                      url: tab
                    });
            tabsRes.push(createdTab.id);
          }

          // Create collapsed group
          //
          // We first get the last focused window which is not a popup;
          // then create an anonymous group; then update the groups properties,
          // i.e title.
          const p = chrome.windows.getLastFocused({
            windowTypes: ['normal']
          }).then(async lastFocusedWindow => {
            await chrome.tabs.group({
              tabIds: tabsRes,
              createProperties: {
                windowId: lastFocusedWindow.id
              }}).then(async id => {
                await chrome.tabGroups.update(
                  id,
                  { title: group.name,
                    collapsed: false
                  });
              });
          });

          promises.push(p);
        }

        // Wait creating of all group tabs
        await Promise.all(promises);

        window.close();
      } else {
        // error handling
        showError("Please input a correctly formatted file");
      }
    }
    catch (error) {
      // error handling
      showError( error );
    }
  });

  if (file) {
    // File load.
    // This will trigger the 'load' event.
    reader.readAsText(file);
  } else {
    showError("Load a file please!");
  }

});

shareButton.addEventListener("click", async (event) => {
  const filename = "tabShare.json";

  //TODO: Fix query. If multiple windows opened this will return tabs from all
  //sessions.
  const selectedTabs = await chrome.tabs.query({
    currentWindow: false,
    highlighted: true
  });
  const result = { groups: [] };
  const group = { name: "", tabs: [] };

  // Check for group
  if (groupSwitch.checked && groupInput.value) {
    group.name = groupInput.value;
  }

  for (const tab of selectedTabs) {
    group.tabs.push(tab.url);
  }

  result.groups.push(group);

  const blob = new Blob([JSON.stringify(result)], {type : 'application/json'});
  const blobURL = window.URL.createObjectURL(blob);

  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
});

groupSwitch.addEventListener("change", (event) => {
  if (groupSwitch.checked) {
    groupInput.disabled = false;
  } else {
    groupInput.value = "";
    groupInput.disabled = true;
  }
})

// -------- Auxiliary function --------

/*
 * Cleans the errors in HTML
 *
 */
function cleanError () {
  const error = document.getElementById("cname");
  fileSelector.classList.remove("err");
  error.innerHTML = "";
}

/*
 * Shows the errors in HTML
 *
 */
function showError (errorMsg = "") {
  const error = document.getElementById("cname");
  fileSelector.classList.add("err");
  error.innerHTML = errorMsg;
}

/*
 * Checks if a given String is a valid HTTP URL
 *
 * Returns a custom object:
 * {
 *    result: Boolean,
 *    error: String
 * }
 */
function isValidHttpUrl(input) {
  try {
    const url = new URL(input);
    return { result: url.protocol === "http:" || url.protocol === "https:"
           , error: ""
           };

  } catch (error) {
    return { result: false
           , error: error
           };
  }

}

