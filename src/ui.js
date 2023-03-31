// UI initialization function
export function initUI() {
  const groupTabsCheck = document.getElementById("groupTabsCheck");
  const shareGroupName = document.getElementById("shareGroupName");
  const preserveGroupsCheck = document.getElementById("preserveGroupsCheck");

  // Enable/disable text input based on checkbox state
  groupTabsCheck.addEventListener("change", () => {
    shareGroupName.disabled = !groupTabsCheck.checked;
    if (groupTabsCheck.checked) {
      preserveGroupsCheck.checked = false;
    }
  });

  preserveGroupsCheck.addEventListener("change", () => {
    if (preserveGroupsCheck.checked) {
      groupTabsCheck.checked = false;
      const e = new Event("change");
      groupTabsCheck.dispatchEvent(e);
    }
  });
}

export function displayError(message) {
  const errorElement = document.getElementById("errorContainer");

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

export function hideError() {
  const errorElement = document.getElementById("errorContainer");

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}
