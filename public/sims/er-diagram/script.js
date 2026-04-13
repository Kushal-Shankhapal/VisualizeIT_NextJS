// Updated script.js with inline attribute editing
let entityCount = 0;
const canvas = document.getElementById("canvasArea");
const addEntityBtn = document.getElementById("addEntityBtn");
const clearBtn = document.getElementById("clearBtn");
const ddlOutput = document.getElementById("ddlOutput");

const relationships = [];
const entities = [];
let relationshipMode = false;
let selectedEntity = null;

const relBtn = document.createElement("button");
relBtn.textContent = "Start Relationship";
relBtn.style.marginLeft = "1rem";
clearBtn.insertAdjacentElement("afterend", relBtn);

relBtn.addEventListener("click", () => {
  relationshipMode = !relationshipMode;
  relBtn.textContent = relationshipMode ? "Cancel Relationship" : "Start Relationship";
  selectedEntity = null;
});

addEntityBtn.addEventListener("click", () => {
  let name = prompt("Enter entity name:");
  if (!name) return;
  name = sanitizeIdentifier(name);

  const entityDiv = document.createElement("div");
  entityDiv.className = "entity";
  entityDiv.style.left = `${60 + entityCount * 30}px`;
  entityDiv.style.top = `${60 + entityCount * 30}px`;
  entityDiv.setAttribute("data-name", name);

  const title = document.createElement("div");
  title.className = "drag-handle";
  title.textContent = name;
  title.style.fontWeight = "bold";
  title.style.cursor = "move";

  const attrList = document.createElement("ul");
  attrList.className = "attr-list";
  const defaultAttrs = [
    { name: "id", type: "INT", constraint: "PRIMARY KEY" },
    { name: "name", type: "VARCHAR(100)" }
  ];

  const entityData = {
    name,
    el: entityDiv,
    attributes: [...defaultAttrs],
    listEl: attrList
  };
  defaultAttrs.forEach(attr => {
    const li = createAttrElement(attr, entityData);
    attrList.appendChild(li);
  });

  entityDiv.appendChild(title);
  entityDiv.appendChild(attrList);
  canvas.appendChild(entityDiv);
  makeDraggable(entityDiv, title);
  entities.push(entityData);
  updateDDL();
  entityCount++;

  entityDiv.addEventListener("dblclick", () => {
    const input = prompt("Add attribute (e.g., age INT or salary FLOAT):");
    if (input) {
      const [attrName, attrTypeRaw] = input.split(/\s+/);
      const attr = {
        name: sanitizeIdentifier(attrName),
        type: attrTypeRaw || "TEXT"
      };
      entityData.attributes.push(attr);
      const li = createAttrElement(attr, entityData);
      entityData.listEl.appendChild(li);
      updateDDL();
    }
  });

  entityDiv.addEventListener("click", () => {
    if (!relationshipMode) return;
    if (!selectedEntity) {
      selectedEntity = entityData;
      entityDiv.classList.add("highlight-rel");
    } else if (selectedEntity !== entityData) {
      const cardinality = prompt("Enter relationship (e.g., 1:N, 1:1, M:N):", "1:N");
      if (!cardinality) return;
      const rel = drawLine(selectedEntity.el, entityData.el, cardinality);
      relationships.push({ from: selectedEntity, to: entityData, label: cardinality, line: rel.line, text: rel.text });
      entityDiv.classList.remove("highlight-rel");
      selectedEntity.el.classList.remove("highlight-rel");

      if (cardinality === "1:N" || cardinality === "1:1") {
        const baseName = `${selectedEntity.name}_id`;
        let fkName = baseName;
        let counter = 1;
        const targetAttrs = entityData.attributes.map(a => a.name);
        while (targetAttrs.includes(fkName)) {
          fkName = `${baseName}_${counter++}`;
        }
        const fkAttr = { name: fkName, type: "INT", constraint: `REFERENCES ${selectedEntity.name}(id)` };
        entityData.attributes.push(fkAttr);
        const li = createAttrElement(fkAttr, entityData);
        entityData.listEl.appendChild(li);
      }

      updateDDL();
      selectedEntity = null;
      relationshipMode = false;
      relBtn.textContent = "Start Relationship";
    }
  });
});

function createAttrElement(attr, entity) {
  const li = document.createElement("li");
  li.className = "attr-item";
  const span = document.createElement("span");
  span.textContent = renderAttr(attr);
  span.style.cursor = "pointer";

  span.addEventListener("click", () => {
    const newDef = prompt("Edit attribute (name type constraint):", `${attr.name} ${attr.type || ''} ${attr.constraint || ''}`);
    if (newDef) {
      const parts = newDef.split(/\s+/);
      attr.name = sanitizeIdentifier(parts[0]);
      attr.type = parts[1] || "TEXT";
      attr.constraint = parts.slice(2).join(" ") || "";
      span.textContent = renderAttr(attr);
      updateDDL();
    }
  });

  const del = document.createElement("button");
  del.textContent = "❌";
  del.style.marginLeft = "8px";
  del.addEventListener("click", () => {
    const idx = entity.attributes.indexOf(attr);
    if (idx !== -1) entity.attributes.splice(idx, 1);
    li.remove();
    updateDDL();
  });

  li.appendChild(span);
  li.appendChild(del);
  return li;
}

clearBtn.addEventListener("click", () => {
  canvas.innerHTML = "";
  ddlOutput.textContent = "";
  relationships.length = 0;
  entities.length = 0;
  entityCount = 0;
});

function renderAttr(attr) {
  const parts = [attr.name];
  if (attr.type) parts.push(attr.type);
  if (attr.constraint) parts.push(attr.constraint);
  return parts.join(" ");
}

function updateDDL() {
  const ddl = entities.map(e => {
    const lines = e.attributes.map(renderAttr);
    return `CREATE TABLE ${e.name} (\n  ${lines.join(",\n  ")}\n);`;
  }).join("\n\n");
  ddlOutput.textContent = ddl;
}

function sanitizeIdentifier(str) {
  return str.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^([^a-zA-Z_])/, "_$1");
}

function makeDraggable(container, handle) {
  let offsetX = 0, offsetY = 0;
  let isDragging = false;
  handle.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    container.style.zIndex = 1000;
  });
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    container.style.left = `${e.clientX - offsetX}px`;
    container.style.top = `${e.clientY - offsetY}px`;
    updateLines();
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    container.style.zIndex = 1;
  });
}

function drawLine(fromEl, toEl, label) {
  const svgNS = "http://www.w3.org/2000/svg";
  let svg = document.getElementById("rel-lines");
  if (!svg) {
    svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("id", "rel-lines");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    canvas.appendChild(svg);
  }
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("stroke", "#88f");
  line.setAttribute("stroke-width", "2");
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("fill", "#88f");
  text.setAttribute("font-size", "12px");
  text.textContent = label;
  svg.appendChild(line);
  svg.appendChild(text);
  updateLinePosition(fromEl, toEl, line, text);
  return { line, text };
}

function updateLinePosition(fromEl, toEl, line, text) {
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
  const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
  const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  text.setAttribute("x", (x1 + x2) / 2);
  text.setAttribute("y", (y1 + y2) / 2 - 5);
}

function updateLines() {
  relationships.forEach(rel => {
    updateLinePosition(rel.from.el, rel.to.el, rel.line, rel.text);
  });
}
