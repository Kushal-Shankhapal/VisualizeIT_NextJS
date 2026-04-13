// let size = 6;

// let queue = new Array(size).fill(null);
// let front = -1;
// let rear = -1;
// let currentLang = "pseudocode";
// let highlightedLine = null;
// let animationInProgress = false;

// // Speed control: maps slider value (1-5) to delay in ms
// const speedMap = {
//     1: 1200,  // 0.25×
//     2: 600,   // 0.5×
//     3: 300,   // 1× (default)
//     4: 150,   // 2×
//     5: 75     // 4×
// };
// const speedLabelMap = {
//     1: "0.25×",
//     2: "0.5×",
//     3: "1×",
//     4: "2×",
//     5: "4×"
// };
// let currentSpeed = 3;

// function updateSpeed(val) {
//     currentSpeed = parseInt(val);
//     document.getElementById("speedDisplay").innerText = speedLabelMap[currentSpeed];
//     const slider = document.getElementById("speedSlider");
//     slider.value = currentSpeed;
//     slider.style.background = `linear-gradient(to right, #00ff88 0%, #00ff88 ${(currentSpeed - 1) / 4 * 100}%, #333 ${(currentSpeed - 1) / 4 * 100}%, #333 100%)`;
//     document.querySelectorAll(".speed-btn").forEach((btn, idx) => {
//         btn.classList.toggle("active", idx + 1 === currentSpeed);
//     });
// }

// function setSpeed(val) {
//     updateSpeed(val);
// }

// const container = document.getElementById("queueContainer");
// const frontText = document.getElementById("frontIndex");
// const rearText = document.getElementById("rearIndex");
// const stepText = document.getElementById("stepText");
// const complexity = document.getElementById("complexity");
// const codePre = document.getElementById("codeDisplay");
// const codeEl = document.getElementById("codeText");

// function escapeHtml(raw) {
//     return raw
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/\"/g, "&quot;")
//         .replace(/'/g, "&#39;");
// }

// function updateCodeDisplay(lineToHighlight = null) {
//     highlightedLine = lineToHighlight;
//     const raw = codes[currentLang] || "";
//     const lines = raw.split("\n");

//     const html = lines
//         .map((line, index) => {
//             const escaped = escapeHtml(line);
//             if (lineToHighlight === index + 1) {
//                 return `<span class="highlight">${escaped}</span>`;
//             }
//             return escaped;
//         })
//         .join("\n");

//     codePre.className = `language-${currentLang}`;
//     codeEl.className = `language-${currentLang}`;
//     codeEl.innerHTML = html;

//     if (currentLang !== 'pseudocode') {
//         Prism.highlightElement(codeEl);
//     }
// }

// function tick() {
//     return new Promise((resolve) => setTimeout(resolve, speedMap[currentSpeed]));
// }

// async function highlightStep(line, message) {
//     if (message) stepText.innerText = message;
//     updateCodeDisplay(line);
//     await tick();
// }

// function renderQueue(anim = false, index = -1) {
//     container.innerHTML = "";

//     for (let i = 0; i < size; i++) {
//         const box = document.createElement("div");
//         box.className = "box";

//         if (queue[i] !== null) box.innerText = queue[i];

//         if (i === front) {
//             const f = document.createElement("div");
//             f.className = "pointer";
//             f.innerText = "F";
//             box.appendChild(f);
//         }

//         if (i === rear) {
//             const r = document.createElement("div");
//             r.className = "pointer";
//             r.innerText = "R";
//             box.appendChild(r);
//         }

//         if (anim && i === rear) box.classList.add("enqueuing");
//         if (index !== -1 && i === index) box.classList.add("dequeuing");

//         container.appendChild(box);
//     }

//     frontText.innerText = front;
//     rearText.innerText = rear;
// }

// async function enqueue() {
//     if (animationInProgress) return;
//     animationInProgress = true;

//     const val = document.getElementById("valueInput").value;

//     if (val === "") {
//         stepText.innerText = "Invalid input";
//         animationInProgress = false;
//         return;
//     }

//     await highlightStep(2, "Checking for overflow...");

//     if ((rear + 1) % size === front) {
//         await highlightStep(3, "Circular Queue Overflow!");
//         complexity.innerText = "O(1)";
//         animationInProgress = false;
//         return;
//     }

//     await highlightStep(5, "Checking if queue is empty...");

//     if (front === -1) {
//         await highlightStep(6, "Queue is empty, resetting front and rear...");
//         front = 0;
//         rear = 0;
//     } else {
//         await highlightStep(8, "Advancing rear pointer...");
//         rear = (rear + 1) % size;
//     }

//     await highlightStep(9, `Inserting ${val} at rear index ${rear}...`);
//     queue[rear] = val;

//     stepText.innerText = "Inserted " + val + " at index " + rear;
//     complexity.innerText = "O(1)";

//     renderQueue(true);
//     animationInProgress = false;
// }

// async function dequeue() {
//     if (animationInProgress) return;
//     animationInProgress = true;

//     await highlightStep(12, "Checking for underflow...");

//     if (front === -1) {
//         await highlightStep(13, "Circular Queue Underflow!");
//         complexity.innerText = "O(1)";
//         animationInProgress = false;
//         return;
//     }

//     await highlightStep(14, "Removing the front element...");
//     const removed = queue[front];
//     const removedIndex = front;
//     queue[front] = null;

//     await highlightStep(15, "Updating front pointer...");
//     if (front === rear) {
//         await highlightStep(16, "Queue is now empty, resetting pointers...");
//         front = -1;
//         rear = -1;
//     } else {
//         await highlightStep(18, "Moving front pointer forward...");
//         front = (front + 1) % size;
//     }

//     stepText.innerText = "Removed " + removed;
//     complexity.innerText = "O(1)";

//     renderQueue(false, removedIndex);
//     animationInProgress = false;
// }

// function peek() {
//     if (front === -1) {
//         stepText.innerText = "Queue Empty";
//         return;
//     }
//     stepText.innerText = "Front Element: " + queue[front];
//     complexity.innerText = "O(1)";
// }

// function isEmpty() {
//     if (front === -1)
//         stepText.innerText = "Queue is Empty";
//     else
//         stepText.innerText = "Queue is not Empty";
//     complexity.innerText = "O(1)";
// }

// function isFull() {
//     if ((rear + 1) % size === front)
//         stepText.innerText = "Queue is Full";
//     else
//         stepText.innerText = "Queue is not Full";
//     complexity.innerText = "O(1)";
// }

// function resetQueue() {
//     queue = new Array(size).fill(null);
//     front = -1;
//     rear = -1;
//     stepText.innerText = "Queue Reset";
//     complexity.innerText = "—";
//     renderQueue();
// }

// function resizeQueue() {
//     const newSize = parseInt(document.getElementById("sizeInput").value);
//     if (newSize < 1 || newSize > 20) {
//         stepText.innerText = "Invalid size (1-20)";
//         return;
//     }
//     size = newSize;
//     queue = new Array(size).fill(null);
//     front = -1;
//     rear = -1;
//     renderQueue();
// }

// const codes = {
//     pseudocode: `ENQUEUE(x)
// if (rear + 1) % size == front
//     Overflow
// else
//     if front == -1
//         front = rear = 0
//     else
//         rear = (rear + 1) % size
//     queue[rear] = x

// DEQUEUE()
// if front == -1
//     Underflow
// value = queue[front]
// if front == rear
//     front = rear = -1
// else
//     front = (front + 1) % size
// return value`,

//     javascript: `function enqueue(x) {
//     if ((rear + 1) % size === front) {
//         console.log("Overflow");
//         return;
//     }

//     if (front === -1) {
//         front = 0;
//         rear = 0;
//     } else {
//         rear = (rear + 1) % size;
//     }

//     queue[rear] = x;
// }

// function dequeue() {
//     if (front === -1) {
//         console.log("Underflow");
//         return null;
//     }

//     const value = queue[front];

//     if (front === rear) {
//         front = -1;
//         rear = -1;
//     } else {
//         front = (front + 1) % size;
//     }

//     return value;
// }`,

//     c: `#include <stdio.h>

// void enqueue(int x) {
//     if ((rear + 1) % size == front) {
//         printf("Overflow\\n");
//         return;
//     }

//     if (front == -1) {
//         front = rear = 0;
//     } else {
//         rear = (rear + 1) % size;
//     }

//     queue[rear] = x;
// }

// int dequeue() {
//     if (front == -1) {
//         printf("Underflow\\n");
//         return -1;
//     }

//     int value = queue[front];

//     if (front == rear) {
//         front = rear = -1;
//     } else {
//         front = (front + 1) % size;
//     }

//     return value;
// }`,

//     cpp: `#include <iostream>
// using namespace std;

// void enqueue(int x) {
//     if ((rear + 1) % size == front) {
//         cout << "Overflow" << endl;
//         return;
//     }

//     if (front == -1) {
//         front = rear = 0;
//     } else {
//         rear = (rear + 1) % size;
//     }

//     queue[rear] = x;
// }

// int dequeue() {
//     if (front == -1) {
//         cout << "Underflow" << endl;
//         return -1;
//     }

//     int value = queue[front];

//     if (front == rear) {
//         front = rear = -1;
//     } else {
//         front = (front + 1) % size;
//     }

//     return value;
// }`,

//     java: `public class CircularQueue {
//     private int[] queue;
//     private int front = -1;
//     private int rear = -1;
//     private int size;

//     public CircularQueue(int size) {
//         this.size = size;
//         this.queue = new int[size];
//     }

//     public void enqueue(int x) {
//         if ((rear + 1) % size == front) {
//             System.out.println("Overflow");
//             return;
//         }

//         if (front == -1) {
//             front = rear = 0;
//         } else {
//             rear = (rear + 1) % size;
//         }

//         queue[rear] = x;
//     }

//     public int dequeue() {
//         if (front == -1) {
//             System.out.println("Underflow");
//             return -1;
//         }

//         int value = queue[front];

//         if (front == rear) {
//             front = rear = -1;
//         } else {
//             front = (front + 1) % size;
//         }

//         return value;
//     }
// }`,

//     python: `def enqueue(x):
//     global front, rear

//     if (rear + 1) % size == front:
//         print("Overflow")
//         return

//     if front == -1:
//         front = 0
//         rear = 0
//     else:
//         rear = (rear + 1) % size

//     queue[rear] = x


// def dequeue():
//     global front, rear

//     if front == -1:
//         print("Underflow")
//         return None

//     value = queue[front]

//     if front == rear:
//         front = rear = -1
//     else:
//         front = (front + 1) % size

//     return value
// `
// };

// function changeLanguage() {
//     const lang = document.getElementById("languageSelect").value;
//     currentLang = lang;
//     updateCodeDisplay(highlightedLine);
// }

// changeLanguage();
// renderQueue();
// updateSpeed(3);

let size = 6;
let queue = new Array(size).fill(null);
let front = -1;
let rear = -1;
let currentLang = "pseudocode";
let highlightedLine = null;
let animationInProgress = false;

const speedMap = { 1: 1200, 2: 600, 3: 300, 4: 150, 5: 75 };
const speedLabelMap = { 1: "0.25×", 2: "0.5×", 3: "1×", 4: "2×", 5: "4×" };
let currentSpeed = 3;

function updateSpeed(val) {
  currentSpeed = parseInt(val);
  document.getElementById("speedDisplay").innerText = speedLabelMap[currentSpeed];
  const slider = document.getElementById("speedSlider");
  slider.value = currentSpeed;
  slider.style.background = `linear-gradient(to right, #00ff88 0%, #00ff88 ${(currentSpeed - 1) / 4 * 100}%, #333 ${(currentSpeed - 1) / 4 * 100}%, #333 100%)`;
  document.querySelectorAll(".speed-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === currentSpeed);
  });
}

function setSpeed(val) { updateSpeed(val); }

const container = document.getElementById("queueContainer");
const frontText = document.getElementById("frontIndex");
const rearText = document.getElementById("rearIndex");
const stepText = document.getElementById("stepText");
const complexity = document.getElementById("complexity");
const codePre = document.getElementById("codeDisplay");
const codeEl = document.getElementById("codeText");

function escapeHtml(raw) {
  return raw
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

function updateCodeDisplay(lineToHighlight = null) {
  highlightedLine = lineToHighlight;
  const raw = codes[currentLang] || "";
  const lines = raw.split("\n");
  const html = lines.map((line, index) => {
    const escaped = escapeHtml(line);
    if (lineToHighlight === index + 1) return `<span class="highlight">${escaped}</span>`;
    return escaped;
  }).join("\n");
  codePre.className = `language-${currentLang}`;
  codeEl.className = `language-${currentLang}`;
  codeEl.innerHTML = html;
  if (currentLang !== 'pseudocode') Prism.highlightElement(codeEl);
}

function tick() {
  return new Promise((resolve) => setTimeout(resolve, speedMap[currentSpeed]));
}

async function highlightStep(line, message) {
  if (message) stepText.innerText = message;
  updateCodeDisplay(line);
  await tick();
}

function renderQueue(anim = false, index = -1) {
  container.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const box = document.createElement("div");
    box.className = "box";
    if (queue[i] !== null) box.innerText = queue[i];

    if (i === front) {
      const f = document.createElement("div");
      f.className = "pointer pointer-f";
      f.innerText = "F";
      box.appendChild(f);
    }
    if (i === rear) {
      const r = document.createElement("div");
      r.className = "pointer pointer-r";
      r.innerText = "R";
      box.appendChild(r);
    }
    // if same index, offset rear pointer a bit
    if (i === front && i === rear) {
      const pointers = box.querySelectorAll(".pointer");
      if (pointers.length === 2) pointers[0].style.left = "2px", pointers[1].style.right = "2px";
    }

    if (anim && i === rear) box.classList.add("enqueuing");
    if (index !== -1 && i === index) box.classList.add("dequeuing");
    container.appendChild(box);
  }
  frontText.innerText = front;
  rearText.innerText = rear;
}

async function enqueue() {
  if (animationInProgress) return;
  animationInProgress = true;
  const val = document.getElementById("valueInput").value;
  if (val === "") { stepText.innerText = "Invalid input"; animationInProgress = false; return; }
  await highlightStep(2, "Checking for overflow...");
  if ((rear + 1) % size === front) {
    await highlightStep(3, "Circular Queue Overflow!");
    complexity.innerText = "O(1)"; animationInProgress = false; return;
  }
  await highlightStep(5, "Checking if queue is empty...");
  if (front === -1) {
    await highlightStep(6, "Queue is empty, setting front and rear to 0...");
    front = 0; rear = 0;
  } else {
    await highlightStep(8, "Advancing rear pointer...");
    rear = (rear + 1) % size;
  }
  await highlightStep(9, `Inserting ${val} at rear index ${rear}...`);
  queue[rear] = val;
  stepText.innerText = "Inserted " + val + " at index " + rear;
  complexity.innerText = "O(1)";
  renderQueue(true);
  animationInProgress = false;
}

async function dequeue() {
  if (animationInProgress) return;
  animationInProgress = true;
  await highlightStep(12, "Checking for underflow...");
  if (front === -1) {
    await highlightStep(13, "Circular Queue Underflow!");
    complexity.innerText = "O(1)"; animationInProgress = false; return;
  }
  await highlightStep(14, "Removing the front element...");
  const removed = queue[front];
  const removedIndex = front;
  queue[front] = null;
  await highlightStep(15, "Updating front pointer...");
  if (front === rear) {
    await highlightStep(16, "Queue is now empty, resetting pointers...");
    front = -1; rear = -1;
  } else {
    await highlightStep(18, "Moving front pointer forward...");
    front = (front + 1) % size;
  }
  stepText.innerText = "Removed " + removed;
  complexity.innerText = "O(1)";
  renderQueue(false, removedIndex);
  animationInProgress = false;
}

function peek() {
  if (front === -1) { stepText.innerText = "Queue Empty"; return; }
  stepText.innerText = "Front Element: " + queue[front];
  complexity.innerText = "O(1)";
}

function isEmpty() {
  stepText.innerText = front === -1 ? "Queue is Empty" : "Queue is not Empty";
  complexity.innerText = "O(1)";
}

function isFull() {
  stepText.innerText = (rear + 1) % size === front ? "Queue is Full" : "Queue is not Full";
  complexity.innerText = "O(1)";
}

function resetQueue() {
  queue = new Array(size).fill(null);
  front = -1; rear = -1;
  stepText.innerText = "Queue Reset";
  complexity.innerText = "—";
  renderQueue();
}

function resizeQueue() {
  const newSize = parseInt(document.getElementById("sizeInput").value);
  if (newSize < 1 || newSize > 20) { stepText.innerText = "Invalid size (1-20)"; return; }
  size = newSize;
  queue = new Array(size).fill(null);
  front = -1; rear = -1;
  renderQueue();
}

const codes = {
  pseudocode: `ENQUEUE(x)
if (rear + 1) % size == front
    Overflow
else
    if front == -1
        front = rear = 0
    else
        rear = (rear + 1) % size
    queue[rear] = x

DEQUEUE()
if front == -1
    Underflow
value = queue[front]
if front == rear
    front = rear = -1
else
    front = (front + 1) % size
return value`,

  javascript: `function enqueue(x) {
    if ((rear + 1) % size === front) {
        console.log("Overflow");
        return;
    }
    if (front === -1) {
        front = 0; rear = 0;
    } else {
        rear = (rear + 1) % size;
    }
    queue[rear] = x;
}

function dequeue() {
    if (front === -1) {
        console.log("Underflow");
        return null;
    }
    const value = queue[front];
    if (front === rear) {
        front = -1; rear = -1;
    } else {
        front = (front + 1) % size;
    }
    return value;
}`,

  c: `#include <stdio.h>

void enqueue(int x) {
    if ((rear + 1) % size == front) {
        printf("Overflow\\n");
        return;
    }
    if (front == -1) {
        front = rear = 0;
    } else {
        rear = (rear + 1) % size;
    }
    queue[rear] = x;
}

int dequeue() {
    if (front == -1) {
        printf("Underflow\\n");
        return -1;
    }
    int value = queue[front];
    if (front == rear) {
        front = rear = -1;
    } else {
        front = (front + 1) % size;
    }
    return value;
}`,

  cpp: `#include <iostream>
using namespace std;

void enqueue(int x) {
    if ((rear + 1) % size == front) {
        cout << "Overflow" << endl;
        return;
    }
    if (front == -1) {
        front = rear = 0;
    } else {
        rear = (rear + 1) % size;
    }
    queue[rear] = x;
}

int dequeue() {
    if (front == -1) {
        cout << "Underflow" << endl;
        return -1;
    }
    int value = queue[front];
    if (front == rear) {
        front = rear = -1;
    } else {
        front = (front + 1) % size;
    }
    return value;
}`,

  java: `public class CircularQueue {
    private int[] queue;
    private int front = -1, rear = -1, size;

    public CircularQueue(int size) {
        this.size = size;
        this.queue = new int[size];
    }

    public void enqueue(int x) {
        if ((rear + 1) % size == front) {
            System.out.println("Overflow");
            return;
        }
        if (front == -1) {
            front = rear = 0;
        } else {
            rear = (rear + 1) % size;
        }
        queue[rear] = x;
    }

    public int dequeue() {
        if (front == -1) {
            System.out.println("Underflow");
            return -1;
        }
        int value = queue[front];
        if (front == rear) {
            front = rear = -1;
        } else {
            front = (front + 1) % size;
        }
        return value;
    }
}`,

  python: `def enqueue(x):
    global front, rear
    if (rear + 1) % size == front:
        print("Overflow")
        return
    if front == -1:
        front = 0
        rear = 0
    else:
        rear = (rear + 1) % size
    queue[rear] = x

def dequeue():
    global front, rear
    if front == -1:
        print("Underflow")
        return None
    value = queue[front]
    if front == rear:
        front = rear = -1
    else:
        front = (front + 1) % size
    return value`
};

function changeLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  updateCodeDisplay(highlightedLine);
}

changeLanguage();
renderQueue();
updateSpeed(3);