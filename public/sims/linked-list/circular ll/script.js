let linkedList = [];
let pointerIndex = 0;
let searchTarget = null;

const listContainer = document.getElementById("listContainer");
const stepText = document.getElementById("stepText");
const complexity = document.getElementById("complexity");
const codeDisplay = document.getElementById("codeDisplay");
const valueInput = document.getElementById("valueInput");

/* ===================== RENDER ===================== */

function renderList(highlight = -1, pointer = -1, found = -1) {
  listContainer.innerHTML = "";

  linkedList.forEach((val, i) => {

    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const node = document.createElement("div");
    node.className = "node";

    if (i === highlight) node.classList.add("highlight");
    if (i === found) node.classList.add("found");

    node.innerHTML = `
      <div>${val}</div>
      <div class="index">i:${i}</div>
    `;

    wrapper.appendChild(node);

    if (i === pointer) {
      const p = document.createElement("div");
      p.className = "pointer";
      wrapper.appendChild(p);
    }

    listContainer.appendChild(wrapper);

    if (i < linkedList.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      arrow.innerHTML = "➜";
      listContainer.appendChild(arrow);
    }
  });

  if (linkedList.length > 1) {
    const circularArrow = document.createElement("div");
    circularArrow.className = "circular-arrow";
    circularArrow.innerHTML = "↺ (back to head)";
    listContainer.appendChild(circularArrow);
  }
}

/* ===================== INSERT ===================== */

function insertStart() {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) return;
  linkedList.unshift(val);
  stepText.textContent = "Inserted at beginning";
  complexity.textContent = "O(1)";
  renderList();
}

function insertEnd() {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) return;
  linkedList.push(val);
  stepText.textContent = "Inserted at end";
  complexity.textContent = "O(n)";
  renderList();
}

/* ===================== DELETE ===================== */

function deleteValue() {
  const val = parseInt(valueInput.value);
  const index = linkedList.indexOf(val);

  if (index === -1) {
    stepText.textContent = "Value not found";
    return;
  }

  linkedList.splice(index, 1);
  stepText.textContent = "Deleted value";
  complexity.textContent = "O(n)";
  renderList();
}

/* ===================== TRAVERSAL ===================== */

function startTraversal() {
  if (linkedList.length === 0) return;
  pointerIndex = 0;
  complexity.textContent = "O(n)";
  traverseStep();
}

function traverseStep() {
  if (pointerIndex >= linkedList.length) {
    stepText.textContent = "Completed one full circular loop";
    renderList();
    return;
  }

  stepText.textContent = `Visiting node ${pointerIndex}`;
  renderList(pointerIndex, pointerIndex);

  pointerIndex++;
  setTimeout(traverseStep, 800);
}

/* ===================== SEARCH ===================== */

function startSearch() {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) return;

  searchTarget = val;
  pointerIndex = 0;
  complexity.textContent = "O(n)";
  searchStep();
}

function searchStep() {
  if (pointerIndex >= linkedList.length) {
    stepText.textContent = "Value not found after full loop";
    renderList();
    return;
  }

  renderList(pointerIndex, pointerIndex);

  if (linkedList[pointerIndex] === searchTarget) {
    stepText.textContent = `Found at index ${pointerIndex}`;
    renderList(-1, -1, pointerIndex);
    return;
  }

  stepText.textContent = `Checking index ${pointerIndex}`;
  pointerIndex++;
  setTimeout(searchStep, 800);
}

/* ===================== RESET ===================== */

function resetList() {
  linkedList = [];
  stepText.textContent = "List Reset";
  complexity.textContent = "—";
  renderList();
}

/* ===================== CODE PANEL ===================== */

const codes = {
c: `struct Node {
  int data;
  struct Node* next;
}; // last node points to head`,

cpp: `class Node {
public:
  int data;
  Node* next;
}; // last->next = head;`,

java: `class Node {
  int data;
  Node next;
} // tail.next = head;`,

python: `class Node:
  def __init__(self, data):
    self.data = data
    self.next = None
# tail.next = head`
};

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  codeDisplay.textContent = codes[lang];
}

changeLanguage();
renderList();
