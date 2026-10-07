# Backend — Social Network Analysis & Dataset Pipeline

This directory contains the Python data generation engine and pure-Python Social Network Analysis (SNA) algorithms that power the School of Computing Network Analytics platform.

---

## 📁 Directory Structure

```
backend/
├── generate_dataset.py       # Main synthetic generator & SNA calculation pipeline
├── requirements.txt          # Python dependencies
├── data/                     # Output datasets & JSON bundles
│   ├── school_of_computing_students.csv
│   ├── school_of_computing_interactions.csv
│   ├── school_of_computing_events.csv
│   ├── school_of_computing_sna_results.csv
│   └── soc_network_bundle.json
└── README.md                 # Backend documentation
```

---

## 🚀 Running the Data Generation & SNA Engine

To regenerate the dataset and recalculate all graph metrics:

```bash
python generate_dataset.py
```

### Outputs Produced:
1. **`data/school_of_computing_students.csv`**: Complete student registry (636 records) with 15-character registration numbers (`RA2311028010141`), departments, academic years, and network connectivity status.
2. **`data/school_of_computing_interactions.csv`**: Weighted peer-to-peer interaction graph (5,285 edges).
3. **`data/school_of_computing_events.csv`**: Detailed timeline of 10,400+ collaboration and academic interaction events.
4. **`data/school_of_computing_sna_results.csv`**: Full metric evaluation including Degree, Betweenness (Brandes), Closeness, PageRank, Louvain Communities, and Composite Influence Scores.
5. **`data/soc_network_bundle.json`**: Precomputed metadata and aggregation bundle served to the React frontend.

---

## 🧮 Pure-Python Graph Algorithm Implementations

- **Degree Centrality**: Normalized direct connection count $C_D(v) = \frac{\text{deg}(v)}{N - 1}$.
- **Shortest Paths & Closeness Centrality**: Breadth-First Search (BFS) multi-source distance matrix.
- **Betweenness Centrality**: Exact Brandes Algorithm with path counting ($\mathcal{O}(V \cdot E)$).
- **PageRank**: Power iteration with $0.85$ damping factor and dangling node distribution over 50 iterations.
- **Community Detection**: Fast modularity optimization (Louvain heuristic) partitioning into informal clusters ($Q \ge 0.465$).
