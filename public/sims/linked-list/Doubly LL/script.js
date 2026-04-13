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

  const nullStart = document.createElement("div");
  nullStart.className = "null-node";
  nullStart.innerHTML = "NULL";
  listContainer.appendChild(nullStart);

  const startArrow = document.createElement("div");
  startArrow.className = "arrow";
  startArrow.innerHTML = "⇄";
  listContainer.appendChild(startArrow);

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
      arrow.innerHTML = "⇄";
      listContainer.appendChild(arrow);
    }
  });

  const endArrow = document.createElement("div");
  endArrow.className = "arrow";
  endArrow.innerHTML = "⇄";
  listContainer.appendChild(endArrow);

  const nullEnd = document.createElement("div");
  nullEnd.className = "null-node";
  nullEnd.innerHTML = "NULL";
  listContainer.appendChild(nullEnd);
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
  complexity.textContent = "O(1)";
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

/* ===================== FORWARD TRAVERSAL ===================== */

function startForwardTraversal() {
  if (linkedList.length === 0) return;
  pointerIndex = 0;
  complexity.textContent = "O(n)";
  forwardStep();
}

function forwardStep() {
  if (pointerIndex >= linkedList.length) {
    stepText.textContent = "Forward Traversal Completed";
    renderList();
    return;
  }

  stepText.textContent = `Forward Visiting ${pointerIndex}`;
  renderList(pointerIndex, pointerIndex);
  pointerIndex++;
  setTimeout(forwardStep, 800);
}

/* ===================== BACKWARD TRAVERSAL ===================== */

function startBackwardTraversal() {
  if (linkedList.length === 0) return;
  pointerIndex = linkedList.length - 1;
  complexity.textContent = "O(n)";
  backwardStep();
}

function backwardStep() {
  if (pointerIndex < 0) {
    stepText.textContent = "Backward Traversal Completed";
    renderList();
    return;
  }

  stepText.textContent = `Backward Visiting ${pointerIndex}`;
  renderList(pointerIndex, pointerIndex);
  pointerIndex--;
  setTimeout(backwardStep, 800);
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
    stepText.textContent = "Value not found";
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
  struct Node* prev;
  struct Node* next;
};`,

cpp: `class Node {
public:
  int data;
  Node* prev;
  Node* next;
};`,

java: `class Node {
  int data;
  Node prev;
  Node next;
}`,

python: `class Node:
  def __init__(self, data):
    self.data = data
    self.prev = None
    self.next = None`
};

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  codeDisplay.textContent = codes[lang];
}

changeLanguage();
renderList();
