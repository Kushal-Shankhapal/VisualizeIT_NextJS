const arrayContainer = document.getElementById("arrayContainer");
const algorithmSelect = document.getElementById("algorithmSelect");
const arrayInput = document.getElementById("arrayInput");
const targetInput = document.getElementById("targetInput");
const startBtn = document.getElementById("startBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const generateBtn = document.getElementById("generateBtn");
const loadBtn = document.getElementById("loadBtn");
const speedSlider = document.getElementById("speedRange");
const speedLabel = document.getElementById("speedLabel");
const stepDescription = document.getElementById("stepDescription");
const resultOutput = document.getElementById("resultOutput");
const codeDisplay = document.getElementById("codeDisplay");
const codeToggle = document.getElementById("codeToggle");
const originalArrayText = document.getElementById("originalArray");

let data = [];
let steps = [];
let currentStep = 0;
let interval = null;
let speed = 800;

/* ================= ARRAY FUNCTIONS ================= */

function generateRandomArray(){
  return Array.from({length:8},()=>Math.floor(Math.random()*100));
}

function renderArray(arr){
  arrayContainer.innerHTML="";
  arr.forEach(val=>{
    const div=document.createElement("div");
    div.className="bar";
    div.innerText=val;
    arrayContainer.appendChild(div);
  });
}

/* ================= LINEAR SEARCH ================= */

function recordLinear(arr,target){
  steps=[];
  for(let i=0;i<arr.length;i++){
    steps.push({
      type:"compare",
      i,
      desc:`Comparing target ${target} with element at index ${i}`
    });

    if(arr[i]==target){
      steps.push({
        type:"found",
        i,
        desc:`Element ${target} found at index ${i}`
      });
      return;
    }
  }

  steps.push({
    type:"notfound",
    desc:`Element ${target} not found in array`
  });
}

/* ================= BINARY SEARCH ================= */

function recordBinary(arr,target){
  steps=[];
  arr=[...arr].sort((a,b)=>a-b);
  data=arr;
  renderArray(data);

  let low=0,high=arr.length-1;

  while(low<=high){
    let mid=Math.floor((low+high)/2);

    steps.push({
      type:"binary",
      low,
      mid,
      high,
      desc:`Low=${low}, Mid=${mid}, High=${high}`
    });

    if(arr[mid]==target){
      steps.push({
        type:"found",
        i:mid,
        desc:`Element ${target} found at index ${mid}`
      });
      return;
    }
    else if(arr[mid]<target){
      low=mid+1;
    }
    else{
      high=mid-1;
    }
  }

  steps.push({
    type:"notfound",
    desc:`Element ${target} not found in array`
  });
}

/* ================= APPLY STEP ================= */

function applyStep(step){
  const bars=document.querySelectorAll(".bar");
  bars.forEach(b=>b.className="bar");

  stepDescription.textContent=step.desc;

  switch(step.type){
    case "compare":
      if(bars[step.i])
        bars[step.i].classList.add("highlight");
      break;

    case "binary":
      if(bars[step.low])
        bars[step.low].classList.add("low");
      if(bars[step.high])
        bars[step.high].classList.add("high");
      if(bars[step.mid])
        bars[step.mid].classList.add("highlight");
      break;

    case "found":
      if(bars[step.i])
        bars[step.i].classList.add("found");
      resultOutput.textContent="Found";
      clearInterval(interval);
      break;

    case "notfound":
      resultOutput.textContent="Not Found";
      clearInterval(interval);
      break;
  }
}

/* ================= PLAY ================= */

function play(){
  clearInterval(interval);
  interval=setInterval(()=>{
    if(currentStep>=steps.length){
      clearInterval(interval);
      return;
    }
    applyStep(steps[currentStep]);
    currentStep++;
  },speed);
}

/* ================= BUTTON EVENTS ================= */

startBtn.onclick=()=>{
  clearInterval(interval);
  currentStep=0;
  resultOutput.textContent="-";

  const target=parseInt(targetInput.value);
  if(isNaN(target)) return alert("Enter target value");

  if(algorithmSelect.value==="linear")
    recordLinear([...data],target);
  else
    recordBinary([...data],target);

  play();
};

stepBtn.onclick=()=>{
  if(currentStep<steps.length){
    applyStep(steps[currentStep]);
    currentStep++;
  }
};

resetBtn.onclick=()=>{
  clearInterval(interval);
  renderArray(data);
  stepDescription.textContent="Waiting...";
  resultOutput.textContent="-";
  currentStep=0;
};

generateBtn.onclick=()=>{
  data=generateRandomArray();
  arrayInput.value=data.join(",");
  originalArrayText.textContent=data.join(",");
  renderArray(data);
};

loadBtn.onclick=()=>{
  data=arrayInput.value.split(",").map(x=>parseInt(x.trim()));
  originalArrayText.textContent=data.join(",");
  renderArray(data);
};

speedSlider.oninput=()=>{
  speed=1600-speedSlider.value;
  speedLabel.textContent=Math.round((1600-speed)/400)+"x";
};

/* ================= CODE DISPLAY ================= */

function updateCodeDisplay(){
  const algo=algorithmSelect.value;
  const lang=codeToggle.value;
  let code="";

  if(algo==="linear"){
    if(lang==="pseudo"){
      code=`FOR i = 0 to n-1
    IF arr[i] == target
        RETURN i
RETURN -1`;
    }
    else if(lang==="python"){
      code=`def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`;
    }
    else if(lang==="c"){
      code=`int linearSearch(int arr[], int n, int target){
    for(int i=0;i<n;i++){
        if(arr[i]==target)
            return i;
    }
    return -1;
}`;
    }
    else if(lang==="cpp"){
      code=`int linearSearch(vector<int>& arr, int target){
    for(int i=0;i<arr.size();i++){
        if(arr[i]==target)
            return i;
    }
    return -1;
}`;
    }
    else if(lang==="java"){
      code=`public static int linearSearch(int[] arr, int target){
    for(int i=0;i<arr.length;i++){
        if(arr[i]==target)
            return i;
    }
    return -1;
}`;
    }
  }
  else{
    if(lang==="pseudo"){
      code=`SET low = 0, high = n-1
WHILE low <= high
    mid = (low + high) / 2
    IF arr[mid] == target
        RETURN mid
    ELSE IF arr[mid] < target
        low = mid + 1
    ELSE
        high = mid - 1
RETURN -1`;
    }
    else if(lang==="python"){
      code=`def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`;
    }
    else if(lang==="c"){
      code=`int binarySearch(int arr[], int n, int target){
    int low=0, high=n-1;
    while(low<=high){
        int mid=(low+high)/2;
        if(arr[mid]==target)
            return mid;
        else if(arr[mid]<target)
            low=mid+1;
        else
            high=mid-1;
    }
    return -1;
}`;
    }
    else if(lang==="cpp"){
      code=`int binarySearch(vector<int>& arr, int target){
    int low=0, high=arr.size()-1;
    while(low<=high){
        int mid=(low+high)/2;
        if(arr[mid]==target)
            return mid;
        else if(arr[mid]<target)
            low=mid+1;
        else
            high=mid-1;
    }
    return -1;
}`;
    }
    else if(lang==="java"){
      code=`public static int binarySearch(int[] arr, int target){
    int low=0, high=arr.length-1;
    while(low<=high){
        int mid=(low+high)/2;
        if(arr[mid]==target)
            return mid;
        else if(arr[mid]<target)
            low=mid+1;
        else
            high=mid-1;
    }
    return -1;
}`;
    }
  }

  codeDisplay.textContent=code;
}

algorithmSelect.onchange=updateCodeDisplay;
codeToggle.onchange=updateCodeDisplay;

updateCodeDisplay();
