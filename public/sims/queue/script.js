let size = 6;

let queue = new Array(size).fill(null);
let front = -1;
let rear = -1;

const container = document.getElementById("queueContainer");
const frontText = document.getElementById("frontIndex");
const rearText = document.getElementById("rearIndex");
const stepText = document.getElementById("stepText");
const complexity = document.getElementById("complexity");

function renderQueue(enqueueAnim = false, dequeueIndex = -1) {

    container.innerHTML = "";

    for (let i = 0; i < size; i++) {

        const box = document.createElement("div");
        box.className = "box";

        if (queue[i] !== null)
            box.innerText = queue[i];

        if (i === front) {

            const f = document.createElement("div");
            f.className = "pointer";
            f.innerText = "F";

            box.appendChild(f);

        }

        if (i === rear) {

            const r = document.createElement("div");
            r.className = "pointer";
            r.innerText = "R";

            box.appendChild(r);

        }

        // Animation
        if (enqueueAnim && i === rear) box.classList.add('enqueuing');
        if (dequeueIndex !== -1 && i === dequeueIndex) box.classList.add('dequeuing');

        container.appendChild(box);

    }

    frontText.innerText = front;
    rearText.innerText = rear;

    // Remove animation classes after delay
    setTimeout(() => {

        const boxes = container.querySelectorAll('.box');
        boxes.forEach(box => box.classList.remove('enqueuing', 'dequeuing'));

    }, 500);

}

function enqueue() {

    const val = document.getElementById("valueInput").value;

    if (val === "" || isNaN(val)) {

        stepText.innerText = "Invalid input!";
        return;

    }

    const lang = document.getElementById("languageSelect").value;

    if (lang === 'pseudocode') {

        highlightLine(1, 'condition');

        setTimeout(() => {

            if (rear === size - 1) {

                highlightLine(2, 'error');
                stepText.innerText = "Queue Overflow!";
                complexity.innerText = "O(1)";
                setTimeout(clearHighlight, 2000);

            } else {

                highlightLine(3, 'condition');

                setTimeout(() => {

                    if (front === -1) {

                        highlightLine(4, 'condition');
                        setTimeout(() => highlightLine(5, 'assignment'), 1000);

                    }

                    setTimeout(() => {

                        highlightLine(6, 'assignment');
                        setTimeout(() => {

                            highlightLine(7, 'assignment');

                            if (front === -1) front = 0;
                            rear++;
                            queue[rear] = val;
                            stepText.innerText = "Inserted " + val + " at position " + rear;
                            complexity.innerText = "O(1)";
                            renderQueue(true);
                            setTimeout(clearHighlight, 2000);

                        }, 1000);

                    }, front === -1 ? 2000 : 0);

                }, 1000);

            }

        }, 1000);

    } else {

        if (rear === size - 1) {

            stepText.innerText = "Queue Overflow!";
            complexity.innerText = "O(1)";
            return;

        }

        if (front === -1) front = 0;
        rear++;
        queue[rear] = val;
        stepText.innerText = "Inserted " + val + " at position " + rear;
        complexity.innerText = "O(1)";
        renderQueue(true);

    }

}

function dequeue() {

    const lang = document.getElementById("languageSelect").value;

    if (lang === 'pseudocode') {

        highlightLine(10, 'condition');

        setTimeout(() => {

            if (front === -1 || front > rear) {

                highlightLine(11, 'error');
                setTimeout(() => highlightLine(12, 'error'), 1000);
                stepText.innerText = "Queue Underflow!";
                complexity.innerText = "O(1)";
                setTimeout(clearHighlight, 2000);

            } else {

                highlightLine(13, 'assignment');

                setTimeout(() => {

                    highlightLine(14, 'assignment');
                    const removed = queue[front];
                    const removedIndex = front;
                    queue[front] = null;

                    setTimeout(() => {

                        highlightLine(15, 'assignment');

                        if (front === rear) {
                            front = -1;
                            rear = -1;
                        } else {
                            front++;
                        }

                        setTimeout(() => {

                            if (front === -1) {

                                highlightLine(16, 'condition');
                                setTimeout(() => highlightLine(17, 'assignment'), 1000);
                                setTimeout(() => highlightLine(18, 'assignment'), 2000);

                            }

                            setTimeout(() => {

                                highlightLine(19, 'normal');
                                stepText.innerText = "Removed " + removed + " from queue";
                                complexity.innerText = "O(1)";
                                renderQueue(false, removedIndex);
                                setTimeout(clearHighlight, 2000);

                            }, front === -1 ? 3000 : 0);

                        }, 1000);

                    }, 1000);

                }, 1000);

            }

        }, 1000);

    } else {

        if (front === -1 || front > rear) {

            stepText.innerText = "Queue Underflow!";
            complexity.innerText = "O(1)";
            return;

        }

        const removed = queue[front];
        const removedIndex = front;

        queue[front] = null;

        stepText.innerText = "Removed " + removed + " from queue";
        complexity.innerText = "O(1)";

        if (front === rear) {

            front = -1;
            rear = -1;

        } else {

            front++;

        }

        renderQueue(false, removedIndex); // animate dequeue

    }

}

function resetQueue() {

    // Animate reset
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(box => box.classList.add('resetting'));

    setTimeout(() => {

        queue = new Array(size).fill(null);
        front = -1;
        rear = -1;
        stepText.innerText = "Queue Reset";
        complexity.innerText = "—";
        renderQueue();

    }, 500);

}

function peek() {

    if (front === -1 || front > rear) {

        stepText.innerText = "Queue is Empty!";
        complexity.innerText = "O(1)";
        return;

    }

    stepText.innerText = "Front element: " + queue[front];
    complexity.innerText = "O(1)";

}

function isEmpty() {

    const empty = front === -1;
    stepText.innerText = empty ? "Queue is Empty" : "Queue is not Empty";
    complexity.innerText = "O(1)";

}

function isFull() {

    const full = rear === size - 1;
    stepText.innerText = full ? "Queue is Full" : "Queue is not Full";
    complexity.innerText = "O(1)";

}

function resizeQueue() {

    const newSize = parseInt(document.getElementById("sizeInput").value);
    if (newSize < 1 || newSize > 20) {

        stepText.innerText = "Invalid size! (1-20)";
        return;

    }

    size = newSize;
    resetQueue();

}

const codes = {

    c: `// Enqueue
void enqueue(int x){
    if(rear==size-1)
        printf("Overflow");
    else{
        if(front==-1)
            front=0;
        rear++;
        queue[rear]=x;
    }
}

// Dequeue
int dequeue(){
    if(front==-1 || front>rear){
        printf("Underflow");
        return -1;
    }
    int val = queue[front];
    queue[front]=NULL;
    front++;
    if(front>rear){
        front=rear=-1;
    }
    return val;
}`,

    cpp: `// Enqueue
void enqueue(int x){
    if(rear==size-1)
        cout<<"Overflow";
    else{
        if(front==-1)
            front=0;
        rear++;
        queue[rear]=x;
    }
}

// Dequeue
int dequeue(){
    if(front==-1 || front>rear){
        cout<<"Underflow";
        return -1;
    }
    int val = queue[front];
    queue[front]=NULL;
    front++;
    if(front>rear){
        front=rear=-1;
    }
    return val;
}`,

    java: `// Enqueue
void enqueue(int x){
    if(rear==size-1)
        System.out.println("Overflow");
    else{
        if(front==-1)
            front=0;
        rear++;
        queue[rear]=x;
    }
}

// Dequeue
int dequeue(){
    if(front==-1 || front>rear){
        System.out.println("Underflow");
        return -1;
    }
    int val = queue[front];
    queue[front]=null;
    front++;
    if(front>rear){
        front=rear=-1;
    }
    return val;
}`,

    python: `# Enqueue
def enqueue(x):
    global rear,front
    if rear==size-1:
        print("Overflow")
    else:
        if front==-1:
            front=0
        rear+=1
        queue[rear]=x

# Dequeue
def dequeue():
    global front,rear
    if front==-1 or front>rear:
        print("Underflow")
        return -1
    val = queue[front]
    queue[front]=None
    front+=1
    if front>rear:
        front=rear=-1
    return val`,

    javascript: `// Enqueue
function enqueue(x) {
if (rear === size - 1) {
console.log("Overflow");
} else {
if (front === -1) front = 0;
rear++;
queue[rear] = x;
}
}

// Dequeue
function dequeue() {
if (front === -1 || front > rear) {
console.log("Underflow");
return -1;
}
const val = queue[front];
queue[front] = null;
front++;
if (front > rear) {
front = rear = -1;
}
return val;
}`,

    go: `// Enqueue
func enqueue(x int) {
if rear == size-1 {
fmt.Println("Overflow")
} else {
if front == -1 {
front = 0
}
rear++
queue[rear] = x
}
}

// Dequeue
func dequeue() int {
if front == -1 || front > rear {
fmt.Println("Underflow")
return -1
}
val := queue[front]
queue[front] = nil
front++
if front > rear {
front = -1
rear = -1
}
return val
}`,

    pseudocode: `if rear == size - 1:
    print("Overflow")
else:
    if front == -1:
        front = 0
    rear = rear + 1
    queue[rear] = value

# Dequeue
if front == -1 or front > rear:
    print("Underflow")
    return -1
value = queue[front]
queue[front] = null
front = front + 1
if front > rear:
    front = -1
    rear = -1
return value`
};

function changeLanguage() {

    const lang = document.getElementById("languageSelect").value;
    const codeDisplay = document.getElementById("codeDisplay");

    if (lang === 'pseudocode') {

        const lines = codes[lang].split('\n');
        const html = lines.map((line, index) => `<span class="line" data-line="${index + 1}">${line}</span>`).join('<br>');
        codeDisplay.innerHTML = html;
        codeDisplay.className = 'pseudocode';

    } else {

        codeDisplay.textContent = codes[lang];
        codeDisplay.className = `language-${lang}`;
        Prism.highlightElement(codeDisplay);

    }

}

function highlightLine(lineNum, type = 'normal') {

    clearHighlight();
    const target = document.querySelector(`.line[data-line="${lineNum}"]`);
    if (target) {
        target.classList.add('highlight', type);
    }

}

function clearHighlight() {

    const lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.classList.remove('highlight', 'condition', 'assignment', 'error', 'normal');
    });

}

changeLanguage();
renderQueue();