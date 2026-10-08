# School of Computing — Student Network Analytics

An academic Social Network Analysis (SNA) platform designed for the **School of Computing** to explore student connections, identify high-leverage peer influencers and cross-departmental bridge brokers, and uncover network-isolated students.

---

## 🏛️ Project Architecture (Frontend & Backend)

The project is organized into clear **Frontend** and **Backend** subsystems:

```
student_network_analysis/
├── backend/                            # Python Data Science & SNA Engine
│   ├── generate_dataset.py             # Synthetic generator & pure-Python SNA pipeline
│   ├── requirements.txt                # Python environment specifications
│   ├── data/                           # Output CSV datasets & JSON bundle
│   │   ├── school_of_computing_students.csv
│   │   ├── school_of_computing_interactions.csv
│   │   ├── school_of_computing_events.csv
│   │   ├── school_of_computing_sna_results.csv
│   │   └── soc_network_bundle.json
│   └── README.md                       # Backend documentation & algorithm details
│
├── src/                                # Frontend: React 18 + TypeScript + Tailwind
│   ├── components/
│   │   ├── common/                     # StatCards, Badges, StudentDetailPanel
│   │   ├── layout/                     # Header (Dark/Light), Sidebar (In/Out), Layout
│   │   ├── network/                    # 60FPS Canvas Graph (Pan, Zoom, Hover tooltips)
│   │   └── pages/
│   │       ├── OverviewPage.tsx        # High-level KPIs, full network graph & charts
│   │       ├── StudentNetworkPage.tsx  # Filterable interactive graph explorer
│   │       ├── InfluentialStudentsPage.tsx # Influence rankings & score breakdown
│   │       ├── NetworkIsolationPage.tsx # 27 isolated student profiles & analysis
│   │       ├── CommunitiesPage.tsx     # Louvain cluster discovery & modularity
│   │       ├── DepartmentsPage.tsx     # 28 cohort matrix & 7x7 interaction matrix
│   │       ├── MetricComparisonPage.tsx # Centrality metric comparison scatter charts
│   │       ├── MethodologyPage.tsx     # Beginner-friendly SNA formulas & examples
│   │       └── DataPage.tsx            # Dataset registry & CSV download center
│   ├── context/
│   │   └── NetworkContext.tsx          # Global store, theme toggle & sidebar state
│   ├── types/                          # SNA TypeScript interfaces
│   └── utils/                          # CSV export, graph formatting & algorithms
│
├── public/
│   └── data/                           # Synced JSON bundle & CSV assets for frontend
├── package.json                        # Frontend dependencies & scripts
├── tailwind.config.js                  # Red/White palette, dark mode configuration
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite build configuration
```

---

## 📊 Dataset & Class Structure Summary
- **Total Students ($N$)**: `636`
- **Academic Years**: `4 Cohorts` (`RA23` = 4th Year, `RA24` = 3rd Year, `RA25` = 2nd Year, `RA26` = 1st Year)
- **Computing Departments**: `7 Programs` (`CSE Core`, `AIML`, `Data Science`, `Cloud Computing`, `Cybersecurity`, `Information Technology`, `Big Data Analytics`)
- **Department-Year Cohort Groups**: `28 Groups` (All groups contain $\ge 22$ students)
- **Registration Number Scheme**: `15-digit alphanumeric` format (e.g. `RA2311028010141`)
- **Structurally Isolated Students ($k=0$)**: `27 Students` randomly and naturally distributed across departments
- **Unique Interaction Ties ($E$)**: `5,285`
- **Total Longitudinal Events**: `10,400+`

---

## 🧮 Social Network Analysis (SNA) Formulations

| Metric | Meaning & Analogy | Formula |
| :--- | :--- | :--- |
| **Degree Centrality** | Total direct peers (*Popularity*) | $C_D(v) = \frac{\text{deg}(v)}{N - 1}$ |
| **Betweenness Centrality** | Shortest path intermediary (*Bridge broker*) | $C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$ |
| **Closeness Centrality** | Geodesic closeness to all peers (*Fast broadcaster*) | $C_C(v) = \frac{N - 1}{\sum_{u \neq v} d(v, u)}$ |
| **PageRank** | Influence through well-connected neighbors | $PR(u) = \frac{1-d}{N} + d \sum_{v \in M(u)} \frac{PR(v)}{L(v)}$ |

### Composite Influence Score Formula
$$\text{CIS}(v) = 0.30 \times \widetilde{C_D}(v) + 0.30 \times \widetilde{C_B}(v) + 0.20 \times \widetilde{C_C}(v) + 0.20 \times \widetilde{PR}(v)$$

---

## 🚀 Getting Started

### Backend: Generate Dataset & Calculate SNA Metrics
```bash
python backend/generate_dataset.py
```

### Frontend: Run React Application
```bash
# 1. Install frontend dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

