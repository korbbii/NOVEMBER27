const modal = document.getElementById("add-bundle-modal");
// Get the button that opens the modal
const addButton = document.querySelector(".add-bundle-btn");
// Get the close button element
const closeBtn = document.querySelector(".close-btn");
// Get the cancel button in the form
const cancelBtn = document.querySelector(".cancel-btn");
// Get the form element
const addBundleForm = document.getElementById("add-bundle-form");
// Get the input field for the new block
const sectionBlockInput = document.getElementById("Section-block");
// Get the block table body where new rows will be added
const blockTableBody = document.getElementById("block-table-body");

// Show the modal when the Add Bundle button is clicked
addButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Hide the modal when the close button or cancel button is clicked
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Optionally, close the modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Handle form submission
addBundleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Get the block name from the input
  const blockName = sectionBlockInput.value.trim();

  if (blockName) {
    // Create a new row
    const newRow = document.createElement("tr");

    // Create cells for the block name and actions
    const blockCell = document.createElement("td");
    blockCell.textContent = blockName;

    const actionCell = document.createElement("td");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "bx bx-trash";
    deleteIcon.addEventListener("click", () => {
      newRow.remove(); // Remove the row when delete icon is clicked
    });
    actionCell.appendChild(deleteIcon);

    // Append cells to the row
    newRow.appendChild(blockCell);
    newRow.appendChild(actionCell);

    // Append the row to the table
    blockTableBody.appendChild(newRow);

    // Clear the input and hide the modal
    sectionBlockInput.value = "";
    modal.classList.add("hidden");
  }
});

