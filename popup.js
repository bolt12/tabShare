// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.create({
    url: 'http://stackoverflow.com/'
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

let fileSelector = document.getElementById("fileSelector");

fileSelector.addEventListener("change", (event) => {
  const [file] = event.target.files;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // this will then display a text file
    console.log(reader.result);
  }, false);

  if (file) {
    reader.readAsText(file);
  }
});


// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
