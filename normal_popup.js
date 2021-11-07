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
  reader.addEventListener("load", () => {
    try {
      const parsedFile = JSON.parse(reader.result);
      cleanError();

      const tabs = parsedFile["tabs"];
      if (tabs) {
        cleanError();

        // Check validity of URLs
        for (const tab of tabs) {
          const validityResult = isValidHttpUrl(tab);
          if (! validityResult.result ) {
            showError ( tab
                      + ": is not a valid HTTP URL | "
                      + validityResult.error);
            return;
          } else {
            // All good
          }
        }

        // Open tabs
        for (const tab of tabs) {
          chrome.tabs.create({
            url: tab
          });
        }
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

