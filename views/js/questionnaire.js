document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveButton");
  const cancelButton = document.getElementById("cancelButton");
  const criteriaSelect = document.getElementById("criteriaSelect");
  const questionInput = document.getElementById("questionInput");

  // To keep track of editing
  let editMode = false;
  let editQuestionId = null;

  saveButton.addEventListener("click", function () {
    const selectedCriteria = criteriaSelect.value;
    const questionText = questionInput.value;

    if (!selectedCriteria || !questionText) {
        alert("Please fill in both criteria and question.");
        return;
    }

    const url = editMode ? `/editQuestion/${editQuestionId}` : "/saveQuestion";
    const method = editMode ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            criteriaId: selectedCriteria,
            question: questionText,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(editMode ? "Question updated successfully." : "Question saved successfully.");
            questionInput.value = ""; // Clear the input
            criteriaSelect.value = "";

            // Append the new question to the DOM if saving
            if (!editMode) {
                const newQuestionHTML = `
                    <div class="question-row" data-question-id="${data.questionId}" data-criteria-id="${selectedCriteria}">
                        <div class="action-icons">
                            <span class="icon edit-icon" title="Edit">&#x270E;</span>
                            <span class="icon delete-icon" title="Delete">&#x1F5D1;</span>
                            <span class="icon drag-icon" title="Drag">&#x21C5;</span>
                        </div>
                        <p>${questionText}</p>
                        <div class="rating-options">
                            ${[5, 4, 3, 2, 1].map(score => `
                                <label>
                                    <input type="radio" name="question_${data.questionId}" value="${score}">
                                    ${score}
                                </label>
                            `).join('')}
                        </div>
                    </div>`;
                // Ensure the correct criteria section is targeted
                const criteriaSection = document.querySelector(`.criteria-section[data-criteria-id="${selectedCriteria}"]`);
                if (criteriaSection) {
                    criteriaSection.insertAdjacentHTML('beforeend', newQuestionHTML);
                } else {
                    console.error("Criteria section not found:", selectedCriteria);
                }
            }

            editMode = false; // Reset mode
            editQuestionId = null;
        } else {
            alert("Failed to save the question.");
        }
    })
    .catch(error => console.error("Error:", error));
});

  // Reset form
  cancelButton.addEventListener("click", function () {
      questionInput.value = "";
      criteriaSelect.value = "";
      editMode = false;
      editQuestionId = null;
  });

  // Edit and Delete icons
  const editIcons = document.querySelectorAll('.edit-icon');
  const deleteIcons = document.querySelectorAll('.delete-icon');

  editIcons.forEach(icon => {
      icon.addEventListener('click', function () {
          const questionRow = icon.closest('.question-row');
          const questionText = questionRow.querySelector('p').textContent;
          const questionId = questionRow.dataset.questionId;
          const criteriaId = questionRow.dataset.criteriaId;

          // Fill in the form with the question's current data
          questionInput.value = questionText;
          criteriaSelect.value = criteriaId;

          // Set edit mode and question ID
          editMode = true;
          editQuestionId = questionId;
      });
  });

  deleteIcons.forEach(icon => {
      icon.addEventListener('click', function () {
          if (!confirm("Are you sure you want to delete this question?")) return;

          const questionRow = icon.closest('.question-row');
          const questionId = questionRow.dataset.questionId;

          fetch(`/deleteQuestion/${questionId}`, {
              method: "DELETE",
          })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      alert("Question deleted successfully.");
                      questionRow.remove(); // Remove the question row from the DOM
                  } else {
                      alert("Failed to delete the question.");
                  }
              })
              .catch(error => console.error("Error:", error));
      });
  });
});
