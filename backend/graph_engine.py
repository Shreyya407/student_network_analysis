"""
CampusConnect - Graph Intelligence Engine
Real Graph Analysis using NetworkX and pure-Python algorithms.
"""

import csv
import json
import math
import re
from typing import Dict, List, Any, Optional, Tuple
import networkx as nx
from networkx.algorithms.community import louvain_communities, modularity

DEPARTMENT_PREFIXES = {
    "RA231102801": "Cloud Computing",
    "RA231103001": "Cybersecurity",
    "RA231105601": "Data Science",
    "RA231102701": "Big Data Analytics",
    "RA231100301": "CSE Core",
    "RA231102601": "AI/ML",
    "RA231102901": "Computer Networking",
}

DEPARTMENT_COLORS = {
    "Cloud Computing": "#06b6d4",       # Cyan
    "Cybersecurity": "#f43f5e",         # Rose
    "Data Science": "#8b5cf6",          # Violet
    "Big Data Analytics": "#f59e0b",    # Amber
    "CSE Core": "#3b82f6",              # Blue
    "AI/ML": "#10b981",                 # Emerald
    "Computer Networking": "#ec4899",   # Pink
}

COMMUNITY_COLORS = {
    "Community 1": "#6366f1",           # Indigo
    "Community 2": "#14b8a6",           # Teal
    "Community 3": "#f59e0b",           # Amber
    "Community 4": "#ec4899",           # Pink
    "Isolated / No Community": "#64748b" # Slate
}

CONNECTIVITY_COLORS = {
    "Completely Isolated": "#ef4444",   # Red
    "Low Connectivity": "#f97316",      # Orange
    "Moderately Connected": "#3b82f6",  # Blue
    "Highly Connected": "#10b981",      # Emerald
}


def compute_pagerank(graph: nx.Graph, alpha: float = 0.85, max_iter: int = 200, tol: float = 1e-6) -> Dict[str, float]:
    """Pure-Python power iteration PageRank with dangling node redistribution."""
    nodes = list(graph.nodes())
    N = len(nodes)
    if N == 0:
        return {}
    x = {n: 1.0 / N for n in nodes}
    dangling_nodes = [n for n in nodes if graph.degree(n) == 0]
    
    for _ in range(max_iter):
        xlast = x
        x = {n: 0.0 for n in nodes}
        danglesum = alpha * sum(xlast[n] for n in dangling_nodes)
        
        for n in nodes:
            deg = graph.degree(n)
            if deg > 0:
                share = alpha * xlast[n] / deg
                for nbr in graph[n]:
                    x[nbr] += share
                    
        for n in nodes:
            x[n] += danglesum / N + (1.0 - alpha) / N
            
        err = sum(abs(x[n] - xlast[n]) for n in nodes)
        if err < N * tol:
            break
            
    return x


class GraphEngine:
    def __init__(self, students_csv_path: str = "data/students_630.csv", edges_csv_path: str = "data/student_connections.csv"):
        self.students_csv_path = students_csv_path
        self.edges_csv_path = edges_csv_path
        self.resolution = 0.75
        self.seed = 42
        
        # Raw records
        self.raw_students: List[Dict[str, Any]] = []
        self.raw_edges: List[Dict[str, Any]] = []
        
        # Graph & metrics
        self.G: nx.Graph = nx.Graph()
        self.H_active: nx.Graph = nx.Graph()
        
        # Validation report
        self.validation_report: Dict[str, Any] = {}
        
        # Cached analysis
        self.analysis_results: Dict[str, Any] = {}
        
        # Load and compute initially
        self.load_and_analyze()

    def validate_dataset(self, students: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Perform comprehensive validation according to Master Prompt Section 3."""
        errors: List[str] = []
        warnings: List[str] = []
        
        # Student count & uniqueness
        total_students = len(students)
        seen_reg_ids = set()
        duplicate_student_ids = []
        invalid_length_ids = []
        invalid_prefix_ids = []
        
        dept_counts: Dict[str, int] = {}
        prefix_suffixes: Dict[str, set] = {prefix: set() for prefix in DEPARTMENT_PREFIXES}
        
        for s in students:
            reg = s.get("registration_number", "").strip()
            dept = s.get("department", "").strip()
            
            if not reg:
                errors.append("Found student record with empty registration number.")
                continue
                
            if reg in seen_reg_ids:
                duplicate_student_ids.append(reg)
            seen_reg_ids.add(reg)
            
            if len(reg) != 15:
                invalid_length_ids.append(reg)
                
            prefix = reg[:11]
            if prefix not in DEPARTMENT_PREFIXES:
                invalid_prefix_ids.append(reg)
            else:
                expected_dept = DEPARTMENT_PREFIXES[prefix]
                if dept != expected_dept:
                    warnings.append(f"Student {reg} department '{dept}' does not match prefix expected '{expected_dept}'")
                
                suffix = reg[11:]
                prefix_suffixes[prefix].add(suffix)
                
            dept_counts[dept] = dept_counts.get(dept, 0) + 1

        if total_students != 630:
            warnings.append(f"Total students is {total_students}, expected 630.")
            
        if duplicate_student_ids:
            errors.append(f"Found {len(duplicate_student_ids)} duplicate student IDs: {duplicate_student_ids[:5]}...")
            
        if invalid_length_ids:
            errors.append(f"Found {len(invalid_length_ids)} IDs with length != 15.")

        if invalid_prefix_ids:
            errors.append(f"Found {len(invalid_prefix_ids)} IDs with unrecognized department prefix.")

        # Sequential coverage check: 0001 to 0090
        missing_sequential = {}
        for prefix, expected_dept in DEPARTMENT_PREFIXES.items():
            suffixes = prefix_suffixes.get(prefix, set())
            expected_suffixes = {f"{i:04d}" for i in range(1, 91)}
            missing = expected_suffixes - suffixes
            if missing:
                missing_sequential[expected_dept] = sorted(list(missing))
                warnings.append(f"Department '{expected_dept}' ({prefix}) is missing suffixes: {sorted(list(missing))[:5]}...")

        # Edges validation
        total_edges = len(edges)
        edge_set = set()
        duplicate_edges = []
        self_loops = []
        dangling_edges = []
        
        for e in edges:
            u = e.get("source_registration_number", "").strip()
            v = e.get("target_registration_number", "").strip()
            
            if not u or not v:
                errors.append("Found edge record with missing source or target.")
                continue
                
            if u == v:
                self_loops.append(u)
                continue
                
            if u not in seen_reg_ids:
                dangling_edges.append((u, v))
            if v not in seen_reg_ids:
                dangling_edges.append((u, v))
                
            edge_key = tuple(sorted([u, v]))
            if edge_key in edge_set:
                duplicate_edges.append((u, v))
            edge_set.add(edge_key)

        if self_loops:
            warnings.append(f"Found {len(self_loops)} self-loops.")
        if duplicate_edges:
            warnings.append(f"Found {len(duplicate_edges)} duplicate undirected edges.")
        if dangling_edges:
            errors.append(f"Found {len(dangling_edges)} edges referencing non-existent students.")

        passed = len(errors) == 0
        
        return {
            "passed": passed,
            "total_students": total_students,
            "unique_students": len(seen_reg_ids),
            "expected_students": 630,
            "total_edges": total_edges,
            "unique_edges": len(edge_set),
            "expected_edges": len(edge_set),
            "departments_found": dept_counts,
            "expected_departments_count": 7,
            "students_per_department_target": 90,
            "errors": errors,
            "warnings": warnings,
            "checks": [
                {"name": "Student Count", "status": "pass" if total_students == 630 else "warn", "detail": f"{total_students} / 630"},
                {"name": "Department Distribution", "status": "pass" if len(dept_counts) == 7 and all(c == 90 for c in dept_counts.values()) else "warn", "detail": "7 departments × 90 students"},
                {"name": "Registration Format (15 chars)", "status": "pass" if not invalid_length_ids else "fail", "detail": f"{len(invalid_length_ids)} invalid"},
                {"name": "Sequential Suffix Coverage (0001-0090)", "status": "pass" if not missing_sequential else "warn", "detail": "100% complete" if not missing_sequential else "Gaps found"},
                {"name": "Unique Friendship Edges", "status": "pass" if len(edge_set) >= 3900 else "warn", "detail": f"{len(edge_set)} edges verified"},
                {"name": "Self-loops", "status": "pass" if not self_loops else "warn", "detail": f"{len(self_loops)} found"},
                {"name": "Referential Integrity", "status": "pass" if not dangling_edges else "fail", "detail": "0 dangling edges" if not dangling_edges else f"{len(dangling_edges)} dangling"},
            ]
        }

    def load_and_analyze(self, resolution: float = 0.75, seed: int = 42):
        """Load CSVs, construct graph, run Louvain, Centrality, and build complete data bundle."""
        self.resolution = resolution
        self.seed = seed
        
        # Read students
        self.raw_students = []
        with open(self.students_csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_name = row["student_name"].strip()
                clean_name = re.sub(r'\s+\d+$', '', raw_name)
                self.raw_students.append({
                    "registration_number": row["registration_number"].strip(),
                    "student_name": clean_name,
                    "department": row["department"].strip(),
                    "academic_year": row.get("academic_year", "2023-2027").strip(),
                    "year_of_study": row.get("year_of_study", "4").strip(),
                })

        # Read edges
        self.raw_edges = []
        with open(self.edges_csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.raw_edges.append({
                    "source_registration_number": row["source_registration_number"].strip(),
                    "target_registration_number": row["target_registration_number"].strip(),
                    "relationship": row.get("relationship", "friendship").strip()
                })

        # Run validation
        self.validation_report = self.validate_dataset(self.raw_students, self.raw_edges)

        # Construct Graph
        self.G = nx.Graph()
        for s in self.raw_students:
            self.G.add_node(
                s["registration_number"],
                name=s["student_name"],
                department=s["department"],
                academic_year=s["academic_year"],
                year_of_study=s["year_of_study"]
            )

        for e in self.raw_edges:
            u = e["source_registration_number"]
            v = e["target_registration_number"]
            if u in self.G and v in self.G and u != v:
                self.G.add_edge(u, v)

        # Degrees
        degrees = dict(self.G.degree())
        active_nodes = [n for n in self.G.nodes if degrees[n] > 0]
        self.H_active = self.G.subgraph(active_nodes).copy()

        # Louvain Community Detection on active nodes
        if self.H_active.number_of_nodes() > 0:
            communities_raw = louvain_communities(self.H_active, seed=self.seed, resolution=self.resolution)
            communities_sorted = sorted(communities_raw, key=lambda c: (-len(c), min(c)))
            community_map = {node: f"Community {i}" for i, group in enumerate(communities_sorted, start=1) for node in group}
            mod_score = modularity(self.H_active, communities_sorted) if self.H_active.number_of_edges() > 0 else 0.0
        else:
            communities_sorted = []
            community_map = {}
            mod_score = 0.0

        # Centrality metrics
        degree_c = nx.degree_centrality(self.G)
        between_c = nx.betweenness_centrality(self.G, normalized=True)
        close_c = nx.closeness_centrality(self.G)
        pr = compute_pagerank(self.G)

        # Percentile thresholds for Network Position (95th percentile)
        all_prs = sorted([pr[n] for n in self.G.nodes])
        all_dcs = sorted([degree_c[n] for n in self.G.nodes])
        all_bcs = sorted([between_c[n] for n in self.G.nodes])
        idx_95 = int(0.95 * len(all_prs))
        pr_95_cutoff = all_prs[idx_95] if all_prs else 0.0
        dc_95_cutoff = all_dcs[idx_95] if all_dcs else 0.0
        bc_95_cutoff = all_bcs[idx_95] if all_bcs else 0.0

        # Classify students
        enriched_students: List[Dict[str, Any]] = []
        student_by_reg: Dict[str, Dict[str, Any]] = {}

        for s in self.raw_students:
            reg = s["registration_number"]
            deg = degrees[reg]
            comm = community_map.get(reg, "Isolated / No Community")
            
            # Connectivity classification (Exact rule from Section 14)
            if deg == 0:
                conn_cat = "Completely Isolated"
            elif 1 <= deg <= 2:
                conn_cat = "Low Connectivity"
            elif 3 <= deg <= 10:
                conn_cat = "Moderately Connected"
            else:
                conn_cat = "Highly Connected"

            # Network position classification
            if deg == 0:
                net_pos = "Isolated"
            elif (pr[reg] >= pr_95_cutoff) or (degree_c[reg] >= dc_95_cutoff):
                net_pos = "Influential"
            elif between_c[reg] >= bc_95_cutoff and deg > 0:
                net_pos = "Bridge"
            else:
                net_pos = "Regular Connectivity"

            # Neighbor departments & cross-community stats
            neighbors = list(self.G.neighbors(reg)) if reg in self.G else []
            neighbor_depts: Dict[str, int] = {}
            cross_comm_count = 0
            for nbr in neighbors:
                nbr_dept = self.G.nodes[nbr]["department"]
                neighbor_depts[nbr_dept] = neighbor_depts.get(nbr_dept, 0) + 1
                if community_map.get(nbr) != comm and comm != "Isolated / No Community":
                    cross_comm_count += 1

            student_obj = {
                **s,
                "degree": deg,
                "degree_centrality": round(degree_c[reg], 6),
                "betweenness_centrality": round(between_c[reg], 6),
                "closeness_centrality": round(close_c[reg], 6),
                "pagerank": round(pr[reg], 6),
                "community": comm,
                "connectivity_category": conn_cat,
                "network_position": net_pos,
                "neighbors_count": len(neighbors),
                "cross_community_connections": cross_comm_count,
                "neighbor_departments": neighbor_depts,
                "is_isolated": deg == 0
            }
            enriched_students.append(student_obj)
            student_by_reg[reg] = student_obj

        # Rank students by PageRank and Degree
        students_by_pr = sorted(enriched_students, key=lambda x: x["pagerank"], reverse=True)
        for rank, s in enumerate(students_by_pr, start=1):
            s["pagerank_rank"] = rank

        students_by_dc = sorted(enriched_students, key=lambda x: x["degree_centrality"], reverse=True)
        for rank, s in enumerate(students_by_dc, start=1):
            s["degree_centrality_rank"] = rank

        students_by_bc = sorted(enriched_students, key=lambda x: x["betweenness_centrality"], reverse=True)
        for rank, s in enumerate(students_by_bc, start=1):
            s["betweenness_rank"] = rank

        # Department Analytics
        department_names = sorted(list({s["department"] for s in self.raw_students}))
        dept_analytics: Dict[str, Any] = {}
        
        # Dept cross-connection matrix
        dept_matrix: Dict[str, Dict[str, int]] = {d1: {d2: 0 for d2 in department_names} for d1 in department_names}
        
        for u, v in self.G.edges():
            d1 = self.G.nodes[u]["department"]
            d2 = self.G.nodes[v]["department"]
            dept_matrix[d1][d2] += 1
            if d1 != d2:
                dept_matrix[d2][d1] += 1

        for dept in department_names:
            dept_students = [s for s in enriched_students if s["department"] == dept]
            n_dept = len(dept_students)
            internal_edges = dept_matrix[dept][dept]
            external_edges = sum(dept_matrix[dept][d2] for d2 in department_names if d2 != dept)
            
            avg_deg = sum(s["degree"] for s in dept_students) / n_dept if n_dept else 0.0
            avg_dc = sum(s["degree_centrality"] for s in dept_students) / n_dept if n_dept else 0.0
            avg_bc = sum(s["betweenness_centrality"] for s in dept_students) / n_dept if n_dept else 0.0
            avg_pr = sum(s["pagerank"] for s in dept_students) / n_dept if n_dept else 0.0
            
            # Connectivity breakdown
            conn_breakdown = {
                "Completely Isolated": sum(1 for s in dept_students if s["connectivity_category"] == "Completely Isolated"),
                "Low Connectivity": sum(1 for s in dept_students if s["connectivity_category"] == "Low Connectivity"),
                "Moderately Connected": sum(1 for s in dept_students if s["connectivity_category"] == "Moderately Connected"),
                "Highly Connected": sum(1 for s in dept_students if s["connectivity_category"] == "Highly Connected"),
            }
            
            # Community breakdown
            comm_breakdown = {}
            for s in dept_students:
                comm_breakdown[s["community"]] = comm_breakdown.get(s["community"], 0) + 1

            dept_analytics[dept] = {
                "department": dept,
                "student_count": n_dept,
                "color": DEPARTMENT_COLORS.get(dept, "#64748b"),
                "internal_edges": internal_edges,
                "external_edges": external_edges,
                "total_edges": internal_edges + external_edges,
                "average_degree": round(avg_deg, 2),
                "average_degree_centrality": round(avg_dc, 6),
                "average_betweenness_centrality": round(avg_bc, 6),
                "average_pagerank": round(avg_pr, 6),
                "connectivity_breakdown": conn_breakdown,
                "community_breakdown": comm_breakdown,
            }

        # Community Analytics
        community_names = [f"Community {i}" for i in range(1, len(communities_sorted) + 1)]
        community_analytics: Dict[str, Any] = {}
        
        # Inter-community edge matrix
        comm_matrix: Dict[str, Dict[str, int]] = {c1: {c2: 0 for c2 in community_names} for c1 in community_names}
        
        for u, v in self.G.edges():
            c1 = community_map.get(u)
            c2 = community_map.get(v)
            if c1 and c2:
                comm_matrix[c1][c2] += 1
                if c1 != c2:
                    comm_matrix[c2][c1] += 1

        for idx, group in enumerate(communities_sorted, start=1):
            comm_id = f"Community {idx}"
            comm_nodes = list(group)
            subG = self.G.subgraph(comm_nodes)
            within_edges = subG.number_of_edges()
            n_comm = len(comm_nodes)
            max_possible_edges = (n_comm * (n_comm - 1)) / 2 if n_comm > 1 else 1
            density = within_edges / max_possible_edges if max_possible_edges > 0 else 0.0
            
            external_edges = sum(comm_matrix[comm_id][c2] for c2 in community_names if c2 != comm_id)
            
            comm_students = [student_by_reg[node] for node in comm_nodes]
            dept_breakdown: Dict[str, int] = {}
            for s in comm_students:
                dept_breakdown[s["department"]] = dept_breakdown.get(s["department"], 0) + 1
                
            top_influential = sorted(comm_students, key=lambda s: s["pagerank"], reverse=True)[:5]
            top_bridges = sorted(comm_students, key=lambda s: s["betweenness_centrality"], reverse=True)[:5]

            community_analytics[comm_id] = {
                "community_id": comm_id,
                "name": comm_id,
                "color": COMMUNITY_COLORS.get(comm_id, "#6366f1"),
                "student_count": n_comm,
                "density": round(density, 4),
                "within_community_edges": within_edges,
                "external_edges": external_edges,
                "department_composition": dept_breakdown,
                "top_influential": top_influential,
                "top_bridges": top_bridges,
                "average_degree": round(sum(s["degree"] for s in comm_students) / n_comm, 2) if n_comm else 0.0
            }

        # Overall Network KPIs
        n_nodes = self.G.number_of_nodes()
        n_edges = self.G.number_of_edges()
        avg_degree = sum(degrees.values()) / n_nodes if n_nodes > 0 else 0.0
        net_density = nx.density(self.G)
        connected_components_count = nx.number_connected_components(self.G)
        
        isolated_students = [s for s in enriched_students if s["degree"] == 0]
        low_connected_students = [s for s in enriched_students if s["connectivity_category"] == "Low Connectivity"]
        mod_connected_students = [s for s in enriched_students if s["connectivity_category"] == "Moderately Connected"]
        high_connected_students = [s for s in enriched_students if s["connectivity_category"] == "Highly Connected"]
        bridge_students = sorted([s for s in enriched_students if s["betweenness_centrality"] > 0], key=lambda x: x["betweenness_centrality"], reverse=True)
        influential_students = sorted(enriched_students, key=lambda x: x["pagerank"], reverse=True)

        # Degree Distribution Histogram
        degree_hist: Dict[int, int] = {}
        for deg in degrees.values():
            degree_hist[deg] = degree_hist.get(deg, 0) + 1
        degree_distribution = [{"degree": deg, "count": count} for deg, count in sorted(degree_hist.items())]

        # Connectivity category counts
        connectivity_summary = [
            {"category": "Completely Isolated", "count": len(isolated_students), "percentage": round(len(isolated_students) / n_nodes * 100, 2), "color": CONNECTIVITY_COLORS["Completely Isolated"]},
            {"category": "Low Connectivity", "count": len(low_connected_students), "percentage": round(len(low_connected_students) / n_nodes * 100, 2), "color": CONNECTIVITY_COLORS["Low Connectivity"]},
            {"category": "Moderately Connected", "count": len(mod_connected_students), "percentage": round(len(mod_connected_students) / n_nodes * 100, 2), "color": CONNECTIVITY_COLORS["Moderately Connected"]},
            {"category": "Highly Connected", "count": len(high_connected_students), "percentage": round(len(high_connected_students) / n_nodes * 100, 2), "color": CONNECTIVITY_COLORS["Highly Connected"]},
        ]

        # Cytoscape Graph Data Elements
        cytoscape_elements = []
        for s in enriched_students:
            cytoscape_elements.append({
                "group": "nodes",
                "data": {
                    "id": s["registration_number"],
                    "label": s["student_name"],
                    "student_name": s["student_name"],
                    "registration_number": s["registration_number"],
                    "department": s["department"],
                    "community": s["community"],
                    "degree": s["degree"],
                    "degree_centrality": s["degree_centrality"],
                    "betweenness_centrality": s["betweenness_centrality"],
                    "closeness_centrality": s["closeness_centrality"],
                    "pagerank": s["pagerank"],
                    "connectivity_category": s["connectivity_category"],
                    "network_position": s["network_position"],
                    "dept_color": DEPARTMENT_COLORS.get(s["department"], "#64748b"),
                    "comm_color": COMMUNITY_COLORS.get(s["community"], "#64748b"),
                    "conn_color": CONNECTIVITY_COLORS.get(s["connectivity_category"], "#64748b"),
                }
            })

        for edge_idx, (u, v) in enumerate(self.G.edges()):
            c_u = community_map.get(u, "")
            c_v = community_map.get(v, "")
            d_u = self.G.nodes[u]["department"]
            d_v = self.G.nodes[v]["department"]
            
            cytoscape_elements.append({
                "group": "edges",
                "data": {
                    "id": f"e_{u}_{v}",
                    "source": u,
                    "target": v,
                    "relationship": "friendship",
                    "is_cross_community": c_u != c_v and bool(c_u) and bool(c_v),
                    "is_cross_department": d_u != d_v
                }
            })

        # Key Insights Generator
        insights = []
        # Largest community
        largest_comm = max(community_analytics.values(), key=lambda c: c["student_count"]) if community_analytics else None
        if largest_comm:
            insights.append({
                "title": f"Dominant Community: {largest_comm['community_id']}",
                "detail": f"Contains {largest_comm['student_count']} students ({round(largest_comm['student_count']/n_nodes*100, 1)}% of campus) with {largest_comm['within_community_edges']} internal friendships.",
                "category": "community"
            })
            
        # Highest average degree department
        top_dept_deg = max(dept_analytics.values(), key=lambda d: d["average_degree"]) if dept_analytics else None
        if top_dept_deg:
            insights.append({
                "title": f"Most Active Department: {top_dept_deg['department']}",
                "detail": f"Students in {top_dept_deg['department']} average {top_dept_deg['average_degree']} friendship connections each.",
                "category": "department"
            })

        # Cross-department friendship proportion
        total_cross_edges = sum(
            dept_matrix[d1][d2] for d1 in department_names for d2 in department_names if d1 < d2
        )
        total_internal_edges = sum(dept_matrix[d][d] for d in department_names)
        cross_pct = round(total_cross_edges / n_edges * 100, 1) if n_edges > 0 else 0.0
        insights.append({
            "title": f"High Cross-Department Integration: {cross_pct}%",
            "detail": f"{total_cross_edges} of {n_edges} friendships link students across different academic departments, proving social life bridges faculty boundaries.",
            "category": "connectivity"
        })

        # Isolation notice
        insights.append({
            "title": f"Completely Isolated Students: {len(isolated_students)}",
            "detail": f"{len(isolated_students)} students ({round(len(isolated_students)/n_nodes*100, 1)}%) have degree zero with no recorded friendship links in the dataset.",
            "category": "isolation"
        })

        # Top PageRank student
        if influential_students:
            top_pr = influential_students[0]
            insights.append({
                "title": f"Top Structural Influence: {top_pr['student_name']}",
                "detail": f"{top_pr['student_name']} ({top_pr['department']}) holds the highest PageRank score ({top_pr['pagerank']}) with {top_pr['degree']} direct connections.",
                "category": "influence"
            })

        # Top Bridge student
        if bridge_students:
            top_bridge = bridge_students[0]
            insights.append({
                "title": f"Key Campus Connector: {top_bridge['student_name']}",
                "detail": f"{top_bridge['student_name']} ({top_bridge['department']}) has the highest betweenness centrality ({top_bridge['betweenness_centrality']}), connecting multiple distinct communities.",
                "category": "bridge"
            })

        # Store analysis
        self.analysis_results = {
            "kpis": {
                "total_students": n_nodes,
                "total_friendship_edges": n_edges,
                "detected_communities": len(communities_sorted),
                "isolated_students_count": len(isolated_students),
                "low_connected_count": len(low_connected_students),
                "moderately_connected_count": len(mod_connected_students),
                "highly_connected_count": len(high_connected_students),
                "average_degree": round(avg_degree, 2),
                "network_density": round(net_density, 5),
                "connected_components": connected_components_count,
                "modularity_score": round(mod_score, 4),
            },
            "parameters": {
                "louvain_resolution": self.resolution,
                "louvain_seed": self.seed,
                "influence_cutoff_percentile": 95,
                "bridge_cutoff_percentile": 95,
                "connectivity_thresholds": {
                    "completely_isolated": "0",
                    "low_connectivity": "1-2",
                    "moderately_connected": "3-10",
                    "highly_connected": ">10"
                }
            },
            "students": enriched_students,
            "department_analytics": dept_analytics,
            "department_matrix": dept_matrix,
            "community_analytics": community_analytics,
            "community_matrix": comm_matrix,
            "connectivity_summary": connectivity_summary,
            "degree_distribution": degree_distribution,
            "top_influential": influential_students[:15],
            "top_bridges": bridge_students[:15],
            "isolated_students": isolated_students,
            "insights": insights,
            "cytoscape_elements": cytoscape_elements,
            "validation": self.validation_report,
        }

        return self.analysis_results

    def get_summary(self) -> Dict[str, Any]:
        return {
            "kpis": self.analysis_results.get("kpis", {}),
            "validation": self.validation_report,
            "parameters": self.analysis_results.get("parameters", {})
        }

    def get_student(self, registration_number: str) -> Optional[Dict[str, Any]]:
        for s in self.analysis_results.get("students", []):
            if s["registration_number"].lower() == registration_number.lower():
                # Append full neighbor list
                neighbors = []
                for nbr in self.G.neighbors(s["registration_number"]):
                    nbr_obj = next((item for item in self.analysis_results["students"] if item["registration_number"] == nbr), None)
                    if nbr_obj:
                        neighbors.append(nbr_obj)
                return {**s, "neighbors_list": neighbors}
        return None


# Global engine instance
engine = GraphEngine()
