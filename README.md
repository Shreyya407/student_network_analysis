# CampusConnect — College Network Intelligence

> **Tagline:** Discover the connections that shape campus life.

**CampusConnect** is a Social Network Analysis (SNA) intelligence platform built for higher education institutions. The platform models, calculates, and visualizes synthetic student friendship networks to uncover natural social communities, identify influential opinion leaders, detect structural bridges, spot isolated students, and classify campus-wide connectivity.

---

## 🌟 Key Capabilities & Findings

- **630 Synthetic Students** across **7 Academic Departments** (exactly 90 students per department).
- **3,985 Recorded Friendship Edges** (undirected mutual ties).
- **4 Emergent Social Communities** discovered organically via NetworkX Louvain optimization with high modularity score ($Q = 0.6778$, resolution = 0.75, seed = 42).
- **6 Completely Isolated Students** ($0.95\%$ of campus population) detected via graph degree zero ($k_i = 0$).
- **4-Level Mutually Exclusive Connectivity Classification**:
  - **Completely Isolated:** 0 friends (6 students, 0.95%)
  - **Low Connectivity:** 1–2 friends (10 students, 1.59%)
  - **Moderately Connected:** 3–10 friends (147 students, 23.33%)
  - **Highly Connected:** > 10 friends (467 students, 74.13%)
- **Multi-Centrality Analytics**: Degree Centrality, Betweenness Centrality, Closeness Centrality, and PageRank power-iteration.
- **Interactive Force-Directed Graph Explorer**: Cytoscape.js visualization with node dragging, zoom/pan, community/department/tier coloring, degree/PageRank sizing, neighbor highlighting, hover tooltips, and student detail inspection drawers.
- **Cross-Faculty Friendship Heatmap**: Exact $7 \times 7$ symmetric matrix measuring internal versus external friendships.
- **Dynamic Dataset Validation & Reanalysis**: Real-time validation against schema integrity rules with live upload and parameter reconfiguration.

---

## 🏗️ System Architecture

### Backend
- **Framework:** FastAPI (Python)
- **Graph Engine:** NetworkX 3.7 with pure-Python algorithmic routines
- **Community Detection:** Louvain modularity optimization (`networkx.algorithms.community.louvain_communities`)
- **Centrality Engine:** Degree Centrality, Normalized Betweenness Centrality, Closeness Centrality, Power Iteration PageRank ($\alpha = 0.85$)
- **Data Ingestion:** Standard Library `csv` and `json` engines (zero C-extension friction)
- **Endpoints:**
  - `GET /api/health` — Service health & network summary
  - `GET /api/dataset/summary` — KPIs and parameters
  - `GET /api/dataset/validation` — Comprehensive schema integrity report
  - `GET /api/dashboard` — Overview dashboard bundle
  - `GET /api/network` — Cytoscape.js elements with dynamic filtering
  - `GET /api/communities` — Louvain communities & inter-community matrix
  - `GET /api/communities/{id}` — Community student roster
  - `GET /api/students` — Searchable, sortable, paginated student catalog
  - `GET /api/students/{reg}` — Student details, neighbors, & metrics
  - `GET /api/centrality` — Multi-centrality scatter correlation data
  - `GET /api/influential` — Top students ranked by PageRank / Degree
  - `GET /api/bridges` — Top structural bridges ranked by Betweenness
  - `GET /api/isolated` — Zero-degree isolation detection & departmental breakdown
  - `GET /api/connectivity` — 4-tier classification dashboard data
  - `GET /api/departments` — 7-department metrics & cross-department heatmap
  - `POST /api/analyze` — Live parameter re-analysis (resolution, seed)
  - `POST /api/dataset/upload` — Multipart CSV upload & validation
  - `GET /api/export/{type}` — Dynamic CSV downloads

### Frontend
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Vanilla CSS design system powered by Tailwind CSS (Midnight Navy Dark Mode & Crisp Neutral Light Mode)
- **Graph Visualization:** Cytoscape.js with CoSE force-directed physics layout
- **Charts:** Recharts (Bar charts, Area charts, Pie charts, Scatter plots)
- **Icons:** Lucide React
- **Global Navigation (11 Dedicated Pages):**
  1. Overview Dashboard
  2. Student Network Explorer
  3. Communities (Louvain)
  4. Influential Students
  5. Bridge Students
  6. Isolated Students
  7. Connectivity Analysis
  8. Department Analytics
  9. Centrality Comparison
  10. Data Explorer & Validation
  11. Methodology & Insights

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API Server
Open a terminal in the project directory:
```bash
# Start FastAPI backend with Uvicorn
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Backend API will be live at: `http://127.0.0.1:8000`  
Swagger API Docs available at: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend Development Server
Open a second terminal in the project directory:
```bash
# On Windows, run npm.cmd
npm.cmd run dev
```
Frontend Web App will be live at: `http://localhost:5173`

---

## 📊 Dataset Schema & Registration Mappings

| Prefix | Department | Student Range | Count |
|---|---|---|---|
| `RA231102801` | Cloud Computing | `RA2311028010001` - `RA2311028010090` | 90 |
| `RA231103001` | Cybersecurity | `RA2311030010001` - `RA2311030010090` | 90 |
| `RA231105601` | Data Science | `RA2311056010001` - `RA2311056010090` | 90 |
| `RA231102701` | Big Data Analytics | `RA2311027010001` - `RA2311027010090` | 90 |
| `RA231100301` | CSE Core | `RA2311003010001` - `RA2311003010090` | 90 |
| `RA231102601` | AI/ML | `RA2311026010001` - `RA2311026010090` | 90 |
| `RA231102901` | Computer Networking | `RA2311029010001` - `RA2311029010090` | 90 |
| **Total** | **7 Departments** | **15-Character Strict Identifiers** | **630** |

---

## 🔬 Mathematical Formulas & Methodological Transparency

1. **Modularity Optimization (Louvain):**
   $$Q = \frac{1}{2m} \sum_{ij} \left[ A_{ij} - \frac{k_i k_j}{2m} \right] \delta(c_i, c_j)$$
   Resolution parameter $\gamma = 0.75$, random seed $42$. Yields $Q = 0.6784$.

2. **Degree Centrality:**
   $$C_D(v) = \frac{\deg(v)}{N - 1}$$

3. **PageRank Prestige:**
   $$PR(u) = \frac{1 - \alpha}{N} + \alpha \sum_{v \in \mathcal{N}_{in}(u)} \frac{PR(v)}{\deg(v)}$$
   With $\alpha = 0.85$ and dangling node redistribution.

4. **Betweenness Centrality:**
   $$C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$

5. **Closeness Centrality:**
   $$C_C(v) = \frac{n - 1}{\sum_{u} d(v, u)}$$
