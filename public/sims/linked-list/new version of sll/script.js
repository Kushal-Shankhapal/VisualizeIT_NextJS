// let linkedList = [];
// let traversalIndex = 0;
// let searchIndex = 0;
// let searchingValue = null;

// const listContainer = document.getElementById("listContainer");
// const stepText = document.getElementById("stepText");
// const complexity = document.getElementById("complexity");
// const codeDisplay = document.getElementById("codeDisplay");
// const valueInput = document.getElementById("valueInput");

// /* ===================== RENDER ===================== */

// function renderList(highlight = -1, showPointer = -1) {
//   listContainer.innerHTML = "";

//   linkedList.forEach((val, i) => {

//     const wrapper = document.createElement("div");
//     wrapper.className = "node-wrapper";

//     const node = document.createElement("div");
//     node.className = "node";
//     if (i === highlight) node.classList.add("highlight");

//     node.innerHTML = `
//       <div>${val}</div>
//       <div class="index">i:${i}</div>
//     `;

//     wrapper.appendChild(node);

//     if (i === showPointer) {
//       const pointer = document.createElement("div");
//       pointer.className = "pointer";
//       wrapper.appendChild(pointer);
//     }

//     listContainer.appendChild(wrapper);

//     if (i < linkedList.length - 1) {
//       const arrow = document.createElement("div");
//       arrow.className = "arrow";
//       arrow.innerHTML = "➜";
//       listContainer.appendChild(arrow);
//     }
//   });

//   if (linkedList.length > 0) {
//     const nullNode = document.createElement("div");
//     nullNode.className = "null-node";
//     nullNode.innerHTML = "NULL";
//     listContainer.appendChild(nullNode);
//   }
// }

// /* ===================== INSERT ===================== */

// function insertStart() {
//   const val = parseInt(valueInput.value);
//   if (isNaN(val)) return;

//   linkedList.unshift(val);
//   stepText.textContent = "Inserted at beginning";
//   complexity.textContent = "O(1)";
//   renderList();
// }

// function insertEnd() {
//   const val = parseInt(valueInput.value);
//   if (isNaN(val)) return;

//   linkedList.push(val);
//   stepText.textContent = "Inserted at end";
//   complexity.textContent = "O(n)";
//   renderList();
// }

// /* ===================== DELETE ===================== */

// function deleteValue() {
//   const val = parseInt(valueInput.value);
//   const index = linkedList.indexOf(val);

//   if (index === -1) {
//     stepText.textContent = "Value not found";
//     return;
//   }

//   linkedList.splice(index, 1);
//   stepText.textContent = `Deleted value at index ${index}`;
//   complexity.textContent = "O(n)";
//   renderList();
// }

// /* ===================== TRAVERSAL ===================== */

// function startTraversal() {
//   if (linkedList.length === 0) return;

//   traversalIndex = 0;
//   complexity.textContent = "O(n)";
//   traverseStep();
// }

// function traverseStep() {
//   if (traversalIndex >= linkedList.length) {
//     stepText.textContent = "Traversal Completed";
//     renderList();
//     return;
//   }

//   stepText.textContent = `Visiting node at index ${traversalIndex}`;
//   renderList(traversalIndex, traversalIndex);

//   traversalIndex++;
//   setTimeout(traverseStep, 900);
// }

// /* ===================== SEARCH ===================== */

// function searchValue() {
//   const val = parseInt(valueInput.value);
//   if (isNaN(val)) return;

//   if (linkedList.length === 0) return;

//   searchingValue = val;
//   searchIndex = 0;
//   complexity.textContent = "O(n)";
//   searchStep();
// }

// function searchStep() {
//   if (searchIndex >= linkedList.length) {
//     stepText.textContent = "Value Not Found";
//     renderList();
//     return;
//   }

//   stepText.textContent = `Checking index ${searchIndex}`;

//   if (linkedList[searchIndex] === searchingValue) {
//     stepText.textContent = `Value Found at index ${searchIndex}`;
//     renderList(searchIndex, searchIndex);
//     return;
//   }

//   renderList(-1, searchIndex);

//   searchIndex++;
//   setTimeout(searchStep, 900);
// }

// /* ===================== RESET ===================== */

// function resetList() {
//   linkedList = [];
//   stepText.textContent = "List Reset";
//   complexity.textContent = "—";
//   renderList();
// }

// /* ===================== CODE PANEL ===================== */

// const codes = {
// c: `struct Node {
//   int data;
//   struct Node* next;
// };`,

// cpp: `class Node {
// public:
//   int data;
//   Node* next;
// };`,

// java: `class Node {
//   int data;
//   Node next;
// }`,

// python: `class Node:
//   def __init__(self, data):
//     self.data = data
//     self.next = None`
// };

// function changeLanguage() {
//   const lang = document.getElementById("languageSelect").value;
//   codeDisplay.textContent = codes[lang];
// }

// changeLanguage();
// renderList();
let linkedList = [];
let traversalIndex = 0;
let searchIndex = 0;
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

  if (linkedList.length > 0) {
    const nullNode = document.createElement("div");
    nullNode.className = "null-node";
    nullNode.innerHTML = "NULL";
    listContainer.appendChild(nullNode);
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
  traversalIndex = 0;
  complexity.textContent = "O(n)";
  traverseStep();
}

function traverseStep() {
  if (traversalIndex >= linkedList.length) {
    stepText.textContent = "Traversal Completed";
    renderList();
    return;
  }

  stepText.textContent = `Visiting node ${traversalIndex}`;
  renderList(traversalIndex, traversalIndex);

  traversalIndex++;
  setTimeout(traverseStep, 800);
}

/* ===================== SEARCH ===================== */

function startSearch() {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) return;

  searchTarget = val;
  searchIndex = 0;
  complexity.textContent = "O(n)";
  searchStep();
}

function searchStep() {
  if (searchIndex >= linkedList.length) {
    stepText.textContent = "Value not found";
    renderList();
    return;
  }

  renderList(searchIndex, searchIndex);

  if (linkedList[searchIndex] === searchTarget) {
    stepText.textContent = `Found at index ${searchIndex}`;
    renderList(-1, -1, searchIndex);
    return;
  }

  stepText.textContent = `Checking index ${searchIndex}`;
  searchIndex++;
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
};`,

cpp: `class Node {
public:
  int data;
  Node* next;
};`,

java: `class Node {
  int data;
  Node next;
}`,

python: `class Node:
  def __init__(self, data):
    self.data = data
    self.next = None`
};

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  codeDisplay.textContent = codes[lang];
}

changeLanguage();
renderList();
