export interface Resource {
  title: string;
  url: string;
  channel?: string;
  free?: boolean;
}

export interface SimResources {
  nptel: Resource[];
  youtube: Resource[];
  articles: Resource[];
  textbooks: Resource[];
}

const commonDSA: SimResources = {
  nptel: [{ title: "NPTEL Data Structures and Algorithms", url: "https://nptel.ac.in/courses/106102064" }],
  youtube: [
    { title: "Neso Academy DSA Playlist", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y" },
    { title: "Abdul Bari Algorithms", channel: "Abdul Bari", url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwL3EwcOnZlUjA3mB-5M1m8f" }
  ],
  articles: [{ title: "GeeksforGeeks DSA Guide", url: "https://www.geeksforgeeks.org/data-structures/" }],
  textbooks: [{ title: "OpenDSA Interactive Textbook", url: "https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/", free: true }]
};

const commonOS: SimResources = {
  nptel: [{ title: "NPTEL Operating Systems", url: "https://nptel.ac.in/courses/106106144" }],
  youtube: [
    { title: "Neso Academy OS Playlist", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O" },
    { title: "Gate Smashers OS", channel: "Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donvgFAdkp1ut8vtp9y" }
  ],
  articles: [{ title: "OS Three Easy Pieces (Chapters)", url: "https://ostep.org/book.html" }],
  textbooks: [{ title: "Operating System Concepts (Silberschatz)", url: "https://codex.cs.yale.edu/os-book/os10/slide-dir/index.html", free: true }]
};

const commonDBMS: SimResources = {
  nptel: [{ title: "NPTEL DBMS Course", url: "https://nptel.ac.in/courses/106105175" }],
  youtube: [
    { title: "Neso Academy DBMS Playlist", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1YZyD_JW0" },
    { title: "Gate Smashers DBMS", channel: "Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGGWpQKHsjt015TAzhL29Gz" }
  ],
  articles: [{ title: "GFG DBMS Tutorial", url: "https://www.geeksforgeeks.org/dbms/" }],
  textbooks: [{ title: "Database System Concepts (Korth)", url: "https://db-book.com/", free: false }]
};

const commonCG: SimResources = {
  nptel: [{ title: "NPTEL Computer Graphics", url: "https://nptel.ac.in/courses/106105086" }],
  youtube: [
    { title: "Neso Academy CG Playlist", channel: "Neso Academy", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiHMJnfYzx0BkPbYy7_1GIc" },
    { title: "Gate Smashers Computer Graphics", channel: "Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGlh3DV7bMUcCfMmg6I5lbW" }
  ],
  articles: [{ title: "GFG Computer Graphics Tutorial", url: "https://www.geeksforgeeks.org/computer-graphics-2/" }],
  textbooks: [{ title: "Computer Graphics: Principles and Practice (Foley et al.)", url: "https://www.cs.cornell.edu/courses/cs4620/2014fa/", free: true }]
};

export const RESOURCES: Record<string, SimResources> = {
  "sorting": commonDSA,
  "searching": commonDSA,
  "stack": commonDSA,
  "queue": commonDSA,
  "circular-queue": commonDSA,
  "expression-conversion": commonDSA,
  "cpu-scheduling": commonOS,
  "disk-scheduling": commonOS,
  "page-replacement": commonOS,
  "er-diagram": commonDBMS,
  "line-algorithms": commonCG
};
