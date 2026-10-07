# School of Computing — Student Network Analytics

An academic Social Network Analysis (SNA) web application designed for the **School of Computing** to explore student connections, identify high-leverage peer influencers and cross-departmental bridge brokers, and uncover network-isolated students.

---

## 1. Executive Summary & Overview
The application is built with a **clean, modern university portal design philosophy** (restrained colors, whitespace, subtle borders, crisp typography, and responsive controls). It uses graph theory to evaluate a realistic academic network of **636 students** across 7 computing programs and 28 Department-Year groups.

### Key Metrics Summary
- **Total Students ($N$)**: `636` (7 Departments × 4 Academic Cohorts, all groups $\ge 22$ students)
- **Academic Years**: `4 Cohorts` (RA23=4th Year, RA24=3rd Year, RA25=2nd Year, RA26=1st Year)
- **Computing Departments**: `7 Programs` (CSE Core, AIML, Data Science, Cloud Computing, Cybersecurity, Information Technology, Big Data Analytics)
- **Department-Year Groups**: `28 Groups` (Natural variation: 22 to 24 students per group)
- **Section Field**: `Eliminated` (Students are uniquely identified by Department and Academic Year)
- **Unique Interaction Ties ($E$)**: `5,420+`
- **Longitudinal Interaction Events**: `10,600+`
- **Structurally Isolated Nodes ($k=0$)**: `Exactly 27 Students` (distributed across cohorts & departments)
- **Connected Students ($k > 0$)**: `609 Students`
- **Louvain Modularity ($Q$)**: `> 0.80` (dense peer communities)

---

## 2. Identifier Rule: Registration Numbers Only
Every student is identified exclusively by their **University Registration Number** across all charts, tables, search inputs, node labels, and CSV exports:
- Format: `RA<Year><110><DeptCode><Serial>`
- Example: `RA24110280000024` (3rd Year, Cloud Computing)
- **Department Codes**:
  - `03` = CSE Core
  - `27` = Big Data Analytics
  - `28` = Cloud Computing
  - `29` = Cybersecurity
  - `30` = Information Technology
  - `54` = Data Science
  - `56` = AIML

---

## 3. Technology Stack
- **Frontend Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (university SaaS clean theme)
- **Charts & Graphs**: Recharts + HTML5 Interactive Canvas Force Graph
- **Icons**: Lucide React
- **Graph Backend & Analysis**: NetworkX (Degree, Betweenness, Closeness, PageRank, Louvain Modularity)

---

## 4. Application Architecture & Pages
```
src/
├── types/                     # TypeScript definitions for students, edges, and statistics
├── context/
│   └── NetworkContext.tsx     # Global state: bundle data, selectedStudent, search query, active tab, filters
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # Left sidebar with School of Computing branding and navigation
│   │   ├── Header.tsx         # Registration number search and live status indicator
│   │   └── Layout.tsx         # Responsive shell with right slide-over student detail panel
│   ├── common/
│   │   ├── StatCard.tsx       # Compact KPI cards
│   │   ├── StudentBadge.tsx   # Department & role pills
│   │   └── StudentDetailPanel.tsx # Right slide-over inspector for student drill-down
│   ├── network/
│   │   ├── StudentNetworkGraph.tsx # 60 FPS Canvas graph with zoom, pan, hover, and neighbor highlighting
│   │   └── NetworkFilters.tsx # Multi-attribute filter bar (Department, Academic Year, Community)
│   └── pages/
│       ├── OverviewPage.tsx   # 5 compact stats, network canvas, top influencer & bridge cards, activity chart
│       ├── StudentNetworkPage.tsx # Filterable interactive network explorer with Department-Year summary
│       ├── InfluentialStudentsPage.tsx # Top 10 ranking table, horizontal bar chart, expandable formula
│       ├── NetworkIsolationPage.tsx # 27 isolated students (degree 0), degree 1-2 peripherals, non-clinical definition
│       ├── CommunitiesPage.tsx # Detected communities, cards grid, modularity partition
│       ├── DepartmentsPage.tsx # Department stats, volume chart, and 7x7 Department Interaction Matrix
│       ├── MetricComparisonPage.tsx # Connections vs Brokerage and Connections vs PageRank scatter charts
│       ├── MethodologyPage.tsx # 6 clean methodology cards (01 to 06) and mathematical formulas
│       └── DataPage.tsx       # Dataset statistics, paginated preview table, 4 CSV download buttons
```

---

## 5. Mathematical Formulations & Influence Score

### Centrality Metrics
1. **Degree Centrality**: $C_D(v) = \frac{\text{deg}(v)}{n - 1}$
2. **Betweenness Centrality**: $C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$
3. **Closeness Centrality**: $C_C(v) = \frac{n - 1}{\sum_{u \neq v} d(v, u)}$
4. **PageRank**: $\text{PR}(u) = \frac{1 - d}{N} + d \sum_{v \in M(u)} \frac{w_{vu} \cdot \text{PR}(v)}{\text{deg}_w(v)}$

### Composite Influence Score Formula
All four centralities are Min-Max scaled into $[0, 1]$ before aggregation:
$$\text{Influence Score} = 0.30 \cdot C_D' + 0.30 \cdot C_B' + 0.20 \cdot C_C' + 0.20 \cdot \text{PR}'$$

---

## 6. How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### 3. Build for Production
```bash
npm run build
```

---

## 7. Synthetic Dataset & Ethical Disclaimer
> **Disclaimer:** This project uses a synthetic dataset for academic Social Network Analysis demonstration. Network isolation (degree = 0) and influence scores describe structural graph properties of this simulated dataset and should not be interpreted as psychological or real-world judgments about students.
