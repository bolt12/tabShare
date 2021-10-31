// let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// Top level file input form object;
let fileSelector = document.getElementById("fileSelector");

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

