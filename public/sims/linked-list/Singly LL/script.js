const listContainer = document.getElementById("listContainer");
const stepText = document.getElementById("stepText");
const valueInput = document.getElementById("valueInput");

const insertStartBtn = document.getElementById("insertStart");
const insertEndBtn = document.getElementById("insertEnd");
const deleteBtn = document.getElementById("deleteValue");
const searchBtn = document.getElementById("searchValue");
const resetBtn = document.getElementById("resetList");

let linkedList = [];

/* ============================= */
/* RENDER LINKED LIST VISUALLY  */
/* ============================= */

function renderList(highlightIndex = -1) {
  listContainer.innerHTML = "";

  linkedList.forEach((value, index) => {

    // Wrapper for node + label
    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    // Circular Node
    const node = document.createElement("div");
    node.className = "node";
    node.textContent = value;

    if (index === highlightIndex) {
      node.classList.add("highlight");
    }

    // Label (head/tail)
    const label = document.createElement("div");
    label.className = "node-label";

    if (index === 0) {
      label.textContent = `head/${index}`;
      label.classList.add("head-label-style");
    }

    if (index === linkedList.length - 1) {
      label.textContent = `tail/${index}`;
      label.classList.add("tail-label-style");
    }

    wrapper.appendChild(node);
    wrapper.appendChild(label);
    listContainer.appendChild(wrapper);

    // Add arrow except after last node
    if (index < linkedList.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.innerHTML = "➜";
      listContainer.appendChild(arrow);
    }
  });
}

/* ============================= */
/* INSERT AT START               */
/* ============================= */

insertStartBtn.onclick = () => {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) {
    stepText.textContent = "Please enter a valid number";
    return;
  }

  linkedList.unshift(val);
  stepText.textContent = `Inserted ${val} at beginning`;
  renderList();
};

/* ============================= */
/* INSERT AT END                 */
/* ============================= */

insertEndBtn.onclick = () => {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) {
    stepText.textContent = "Please enter a valid number";
    return;
  }

  linkedList.push(val);
  stepText.textContent = `Inserted ${val} at end`;
  renderList();
};

/* ============================= */
/* DELETE BY VALUE               */
/* ============================= */

deleteBtn.onclick = () => {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) {
    stepText.textContent = "Please enter a valid number";
    return;
  }

  const index = linkedList.indexOf(val);

  if (index === -1) {
    stepText.textContent = `Value ${val} not found`;
    return;
  }

  linkedList.splice(index, 1);
  stepText.textContent = `Deleted ${val} from position ${index}`;
  renderList();
};

/* ============================= */
/* SEARCH                        */
/* ============================= */

searchBtn.onclick = () => {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) {
    stepText.textContent = "Please enter a valid number";
    return;
  }

  const index = linkedList.indexOf(val);

  if (index === -1) {
    stepText.textContent = `Value ${val} not found`;
    renderList();
    return;
  }

  stepText.textContent = `Value ${val} found at position ${index}`;
  renderList(index);
};

/* ============================= */
/* RESET LIST                    */
/* ============================= */

resetBtn.onclick = () => {
  linkedList = [];
  stepText.textContent = "Linked List reset";
  renderList();
};

/* INITIAL RENDER */
renderList();
