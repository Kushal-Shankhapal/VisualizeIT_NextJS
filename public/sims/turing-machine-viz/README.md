# Turing Machine Visualizer

This is a local install of the Turing machine visualizer originally published at turingmachine.io and adapted for this workspace.

It is a teaching and exploration tool for anyone who wants to understand Turing machines by building and watching them run. That includes students encountering automata theory for the first time, instructors who want a visual companion to a lecture, and contributors who want to study or extend the codebase.

The core idea is simple: you write the machine in a small YAML format, load it into the editor, and the app turns that text into an animated state diagram and tape simulator. The editor, diagram, and storage layer stay synchronized so the current machine can be edited, stepped, shared, duplicated, and recovered without leaving the browser.

## Getting Started

1. Clone the repository and open the project folder.
2. Install the development dependencies with `npm install`.
3. Start the local dev server with `npm start`.
4. Open `http://localhost:8080/` in your browser. The webpack dev server listens on port 8080 by default.

If you want a production build instead of the dev server, use `npm run prod`.

## Machine Format

The simulator reads a YAML-based machine specification inside the document’s source code field. The most important top-level keys are:

* `blank`: the tape symbol used for empty cells. It must be a single character.
* `start state`: the initial state name. It must also appear in the transition table.
* `table`: the transition table, keyed first by state and then by symbol.
* `input`: optional starting tape contents.
* `positions`: optional saved diagram positions for each state node.
* `synonyms`: optional reusable instruction aliases.

Instructions can be written in a few compact forms:

* `L` or `R` for moving left or right without writing.
* A synonym name defined in `synonyms`.
* An explicit mapping such as `{write: 1, L: carry}` or `{write: ' ', R: accept}`.

Here is a small annotated example:

```yaml
name: binary increment
source code: |

  # Adds 1 to a binary number.
  input: '1011'
  blank: ' '
  start state: right
  table:
    # Scan right until we hit the blank at the end of the number.
    right:
      [1,0]: R
      ' ': {L: carry}

    # Propagate the carry back to the left.
    carry:
      1:      {write: 0, L}
      [0,' ']: {write: 1, L: done}

    # Halting state. An empty mapping means no outgoing transitions.
    done:

positions:
  right: {x: 230, y: 250}
  carry: {x: 400, y: 250}
  done: {x: 570, y: 250}
```

The machine format is deliberately compact, but it is still strict: invalid YAML is rejected, undeclared states are rejected, and the blank symbol and start state must both be present.

## Example Machines

The bundled example machines live in [src/examples](src/examples). Each YAML file in that folder contains a complete document, not just a machine body. That document usually includes:

* A human-readable `name`.
* The machine specification in `source code`.
* Saved `positions` so the diagram opens in a readable layout.

The list of examples is assembled in [src/examples.js](src/examples.js), which loads the YAML files through webpack’s raw loader, parses them into documents, and exposes the ordered list shown in the document menu. The first-time document is [src/examples/binaryIncrement.yaml](src/examples/binaryIncrement.yaml), and [src/examples/_template.yaml](src/examples/_template.yaml) is used when creating a new blank document.

Many examples include inline commentary and exercises inside the machine source itself. That is intentional: the examples are meant to teach patterns such as scanning, carry propagation, subroutines, and simple recursion-like behavior, not just provide ready-made machines to run.

## Documents, Autosave, and Snapshots

The app stores documents in browser local storage when the browser allows it. The storage layer in [src/storage.js](src/storage.js) first probes `localStorage`; if that fails, it falls back to an in-memory store so the app still works, but nothing persists after the tab closes.

Each document is represented by [src/TMDocument.js](src/TMDocument.js). A document stores the machine source, the editor contents, the saved node positions, and the document name under keys derived from the document ID. The document menu in [src/DocumentMenu.js](src/DocumentMenu.js) keeps a list of document IDs plus the currently selected document ID in storage, so the last-opened document reappears on the next visit.

Autosave happens through [src/TMDocumentController.js](src/TMDocumentController.js) and [src/main.js](src/main.js): the current document is saved when you switch documents, blur the page, or leave the tab. The controller keeps the editor text, parsed machine, and diagram positions aligned when the machine is valid, and it preserves the editor text separately if the diagram becomes temporarily invalid.

Snapshots are implemented by duplication. When you duplicate a document, the app creates a new saved document with the same contents, giving you a quick branch point without overwriting the original. That is the practical meaning of the “quick snapshots” idea in this project.

The storage layer also listens for browser storage events so changes made in another tab can be reflected here. That keeps open tabs from drifting apart when the same document is edited in more than one place.

## State Diagram Pipeline

The visual pipeline is:

1. The YAML source is parsed by [src/parser.js](src/parser.js) into a machine specification.
2. [src/TMSimulator.js](src/TMSimulator.js) hands that spec to [src/TMViz.js](src/TMViz.js).
3. [src/TMViz.js](src/TMViz.js) builds a [src/state-diagram/StateGraph.js](src/state-diagram/StateGraph.js) from the transition table and creates the tape view with [src/tape/TapeViz.js](src/tape/TapeViz.js).
4. [src/state-diagram/StateViz.js](src/state-diagram/StateViz.js) renders the graph with D3 force layout, SVG paths, arrowheads, labels, and drag behavior.
5. The running machine uses [src/TuringMachine.js](src/TuringMachine.js) plus animated transitions so each step can highlight the active edge and current state.

The important detail is that the diagram is not a static picture. The YAML transition table is transformed into graph vertices and edges, each transition is normalized into an instruction object, and D3 then renders and animates the result. When you step the machine, the active transition pulses on the graph while the tape view updates in sync.

## Source Tree

The `src/` directory is organized by responsibility rather than by feature page. The breakdown below covers the whole tree.

### Top-Level Files

| Path | What it does |
| --- | --- |
| [src/main.js](src/main.js) | Browser entrypoint. Wires the HTML page to the document menu, editor, simulator, import/export dialogs, keyboard shortcuts, autosave, and cross-tab sync. |
| [src/TMViz.js](src/TMViz.js) | High-level visualization wrapper that combines the Turing machine core, the state diagram, the tape view, and animated stepping. |
| [src/TMSimulator.js](src/TMSimulator.js) | Bridges the parsed machine spec to the UI controls and exposes the load/run/step/reset behavior. |
| [src/TMDocumentController.js](src/TMDocumentController.js) | Coordinates the editor, simulator, storage, sync state, validation errors, and load/revert actions for a single document. |
| [src/TMDocument.js](src/TMDocument.js) | Storage-backed document model. Defines how document fields map to localStorage keys and how documents are copied or deleted. |
| [src/DocumentMenu.js](src/DocumentMenu.js) | Manages the document selector, the saved document list, duplication, renaming, deletion, and last-opened document restoration. |
| [src/examples.js](src/examples.js) | Loads the bundled example documents, exposes the example list, and chooses the first-time and blank-template documents. |
| [src/parser.js](src/parser.js) | Parses machine YAML into a validated machine spec and raises structured errors for invalid YAML or invalid TM syntax. |
| [src/TuringMachine.js](src/TuringMachine.js) | Pure machine execution model plus tape-movement direction enums. |
| [src/util.js](src/util.js) | Shared helpers for null handling, DOM fragments, and browser feature detection. |
| [src/storage.js](src/storage.js) | Storage abstraction with localStorage support, RAM fallback, and storage-event listeners. |
| [src/watch.js](src/watch.js) | Lightweight property watching utility used to bridge plain JS objects to UI updates. |
| [src/kbdshortcuts.js](src/kbdshortcuts.js) | Builds the keyboard shortcut table from Ace command metadata. |

### sharing/

| Path | What it does |
| --- | --- |
| [src/sharing/format.js](src/sharing/format.js) | Serializes and parses full documents for export, import, and sharing. It maps friendly YAML keys like `name` and `source code` to the internal document model. |
| [src/sharing/import.js](src/sharing/import.js) | Handles importing from pasted text, local files, and GitHub gists, including validation and user feedback. |
| [src/sharing/import-panel.js](src/sharing/import-panel.js) | Wires the import modal UI to the different import paths. |
| [src/sharing/export-panel.js](src/sharing/export-panel.js) | Builds the share/export dialog, including download links, clipboard support, and GitHub gist creation. |
| [src/sharing/gist.js](src/sharing/gist.js) | Thin Bluebird-backed wrapper around the GitHub Gist API. |
| [src/sharing/FileReaderPromise.js](src/sharing/FileReaderPromise.js) | Promise wrapper around FileReader for importing local files. |
| [src/sharing/CheckboxTable.js](src/sharing/CheckboxTable.js) | Reusable checkbox table used by the import dialog when selecting multiple files. |

### state-diagram/

| Path | What it does |
| --- | --- |
| [src/state-diagram/StateGraph.js](src/state-diagram/StateGraph.js) | Converts the transition table into a graph structure with vertices, edges, labels, and normalized transition lookups. |
| [src/state-diagram/StateViz.js](src/state-diagram/StateViz.js) | D3 force-layout renderer for the state graph. Handles node layout, drag behavior, arrowheads, edge paths, and position-table persistence. |
| [src/state-diagram/StateViz.css](src/state-diagram/StateViz.css) | Styling for the state diagram SVG. |

### tape/

| Path | What it does |
| --- | --- |
| [src/tape/Tape.js](src/tape/Tape.js) | Core infinite tape model implemented as a zipper structure with read, write, and head movement operations. |
| [src/tape/TapeViz.js](src/tape/TapeViz.js) | SVG visualization for the tape, including animated cell updates and head movement. |
| [src/tape/tape.css](src/tape/tape.css) | Styling for the tape SVG. |

## Runtime Dependencies

There are no npm runtime dependencies in `package.json`. Instead, the app loads browser-side libraries from CDN URLs in [index.html](index.html), and webpack treats them as externals.

Those runtime libraries are:

* Ace, for the YAML editor and editor commands.
* Bluebird, for cancellable promises used by gist creation and file reading.
* Bootstrap plus the Lumen theme, for layout, dialogs, alerts, and buttons.
* Font Awesome, for the icon set used in the page chrome.
* clipboard.js, for one-click copying of export permalinks.
* D3 v3, for the force layout, SVG graph rendering, and UI updates.
* jQuery, for Bootstrap modal and tooltip behavior.
* js-yaml, for parsing and serializing YAML documents.
* lodash and lodash/fp, for object manipulation, functional helpers, and document serialization logic.

Analytics is also loaded in [index.html](index.html), but it is not part of the core simulator behavior.

## Build Pipeline

The webpack configuration in [webpack.config.js](webpack.config.js) defines two entry points:

* `main`, which bootstraps the browser app.
* `TMViz`, which exposes the visualization component for direct console use.

Webpack writes bundles into `build/` as `[name].bundle.js` and keeps those bundles on `window` by using `libraryTarget: 'var'`. Shared code is collected with `CommonsChunkPlugin`, and CSS files imported from `src/` are copied into the build directory by `file-loader` so [index.html](index.html) can reference them directly.

In development, `npm start` launches webpack-dev-server with progress output and serves the app from the local build. In production, `npm run prod` first runs linting and then builds with source maps, ordered module output, and minification.

Useful scripts:

* `npm start` for the dev server.
* `npm run prod` for the production bundle.
* `npm run watch` for rebuilds on file changes.
* `npm run depgraph` or `npm run depgraph-noext` for a visual dependency graph.

## Known Limitations

* The app depends on browser features like SVG, localStorage, and modern modal behavior. If localStorage is unavailable, persistence falls back to RAM only.
* Very old browsers are not fully supported; the app includes warnings for outdated IE and Safari private-browsing-like storage behavior.
* The diagram renderer assumes a single active diagram per page, so SVG IDs can collide if multiple instances are embedded on the same document.
* Machine syntax is strict. Invalid YAML, undeclared states, invalid movement keys, or malformed document wrappers will stop a machine from loading.

If you need more background, the project wiki collects notes, known issues, and ideas for future improvements:

https://github.com/aepsilon/turing-machine-viz/wiki

## More Links

* Issue tracker: https://github.com/aepsilon/turing-machine-viz/issues
* Original project page: http://turingmachine.io
* Turing machine background: http://plato.stanford.edu/entries/turing-machine
