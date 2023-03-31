// Import necessary modules
import AOS from 'aos';
import { initUI
       , showError
       , displayError
       , hideError
       } from './ui';
import { getHighlightedTabs
       , generateTabGroupObject
       , saveAsJSON
       , generateQRCode
       , loadTabsFromTabGroupObject
       , scanQRCode
       } from './tabUtils';

// Initialize AOS (Animate On Scroll library)
AOS.init();

// Initialize UI elements and event listeners
initUI();

// Add event listener for "Share Tabs as JSON" button
document.getElementById("shareTabsJSON").addEventListener("click", async () => {
  try {
    // Get highlighted tabs and generate tab group object
    const highlightedTabs = await getHighlightedTabs();
    const tabGroupObject = await generateTabGroupObject(highlightedTabs);

    // Save tab group object as JSON file
    saveAsJSON(tabGroupObject);

    // Hide any previously displayed error messages
    hideError();
  } catch (error) {
    // Display error message if something goes wrong
    displayError(`Error sharing tabs as JSON: ${error}`);
  }
});

// Add event listener for "Share Tabs as QR Code" button
document.getElementById("shareTabsQR").addEventListener("click", async () => {
  try {
    // Get highlighted tabs and generate tab group object
    const highlightedTabs = await getHighlightedTabs();
    const tabGroupObject = await generateTabGroupObject(highlightedTabs);

    // Generate QR code for the tab group object
    generateQRCode(tabGroupObject);

    // Hide any previously displayed error messages
    hideError();
  } catch (error) {
    // Display error message if something goes wrong
    displayError(`Error sharing tabs as QR Code: ${error}`);
  }
});

// Load Tabs with JSON file
document.getElementById('loadTabs').addEventListener("click", async () => {
  const fileSelector = document.getElementById("fileSelector");
  fileSelector.addEventListener("change", (event) => {
    const file = fileSelector.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsedFile = JSON.parse(reader.result);
        await loadTabsFromTabGroupObject(parsedFile);
        hideError();
        window.close();
      } catch (error) {
        displayError(`Error loading tabs from file: ${error}`);
      }
    };

    if (file) {
      // File load.
      // This will trigger the 'load' event.
      reader.readAsText(file);
      hideError();
    } else {
      displayError("Please select a file to load.");
    }
  });
  fileSelector.click();
});

// Load Tabs with QR Code
document.getElementById('scanQRCode').addEventListener('click', scanQRCode);
