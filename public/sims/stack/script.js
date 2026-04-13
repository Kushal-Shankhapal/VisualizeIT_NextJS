let stack = [];

const stackContainer = document.getElementById("stackContainer");
const stepText = document.getElementById("stepText");
const complexity = document.getElementById("complexity");
const codeDisplay = document.getElementById("codeDisplay");
const valueInput = document.getElementById("valueInput");

/* ================= RENDER ================= */

function renderStack(highlightTop = false) {

  stackContainer.innerHTML = "";

  if (stack.length > 0) {
    const topLabel = document.createElement("div");
    topLabel.className = "top-label";
    topLabel.textContent = "TOP ↓";
    stackContainer.appendChild(topLabel);
  }

  stack.forEach((val, index) => {

    const node = document.createElement("div");
    node.className = "stack-node";

    if (index === stack.length - 1 && highlightTop) {
      node.classList.add("top");
    }

    node.textContent = val;

    stackContainer.appendChild(node);
  });
}

/* ================= PUSH ================= */

function pushValue() {
  const val = parseInt(valueInput.value);
  if (isNaN(val)) return;

  stack.push(val);
  stepText.textContent = `Pushed ${val}`;
  complexity.textContent = "O(1)";
  renderStack(true);
}

/* ================= POP ================= */

function popValue() {
  if (stack.length === 0) {
    stepText.textContent = "Stack Underflow!";
    return;
  }

  const popped = stack.pop();
  stepText.textContent = `Popped ${popped}`;
  complexity.textContent = "O(1)";
  renderStack(true);
}

/* ================= PEEK ================= */

function peekValue() {
  if (stack.length === 0) {
    stepText.textContent = "Stack is Empty";
    return;
  }

  const top = stack[stack.length - 1];
  stepText.textContent = `Top element is ${top}`;
  complexity.textContent = "O(1)";
  renderStack(true);
}

/* ================= RESET ================= */

function resetStack() {
  stack = [];
  stepText.textContent = "Stack Reset";
  complexity.textContent = "—";
  renderStack();
}

/* ================= CODE PANEL ================= */

const codes = {
c: `int stack[MAX];
int top = -1;

void push(int x){
  stack[++top] = x;
}

int pop(){
  return stack[top--];
}`,

cpp: `stack<int> s;
s.push(x);
s.pop();
s.top();`,

java: `Stack<Integer> s = new Stack<>();
s.push(x);
s.pop();
s.peek();`,

python: `stack = []
stack.append(x)
stack.pop()
stack[-1]`,

javascript: `let stack = [];
stack.push(x);
stack.pop();
stack[stack.length - 1];`
};

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  codeDisplay.textContent = codes[lang];
}

changeLanguage();
renderStack();
