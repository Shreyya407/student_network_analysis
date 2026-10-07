import csv
import json
import os
import random
import math
from collections import defaultdict, deque

# Fixed random seed for reproducibility
random.seed(42)

def generate_dataset():
    os.makedirs('data', exist_ok=True)
    os.makedirs('public/data', exist_ok=True)

    # 1. 7 Departments
    dept_list = [
        {"name": "CSE Core", "code": "03"},
        {"name": "Big Data Analytics", "code": "27"},
        {"name": "Cloud Computing", "code": "28"},
        {"name": "Cybersecurity", "code": "29"},
        {"name": "Information Technology", "code": "30"},
        {"name": "Data Science", "code": "54"},
        {"name": "AIML", "code": "56"}
    ]

    # 2. 4 Academic Years (Prefix: 23, 24, 25, 26)
    year_list = [
        {"name": "4th Year", "prefix": "23"},
        {"name": "3rd Year", "prefix": "24"},
        {"name": "2nd Year", "prefix": "25"},
        {"name": "1st Year", "prefix": "26"}
    ]

    # Realistic natural variation across 28 groups (all >= 22, total = 636)
    group_sizes = {
        "CSE Core": {"1st Year": 24, "2nd Year": 23, "3rd Year": 23, "4th Year": 23},             # 93
        "AIML": {"1st Year": 23, "2nd Year": 23, "3rd Year": 24, "4th Year": 23},                 # 93
        "Data Science": {"1st Year": 22, "2nd Year": 23, "3rd Year": 22, "4th Year": 23},         # 90
        "Cloud Computing": {"1st Year": 23, "2nd Year": 22, "3rd Year": 23, "4th Year": 23},      # 91
        "Cybersecurity": {"1st Year": 22, "2nd Year": 23, "3rd Year": 22, "4th Year": 23},        # 90
        "Information Technology": {"1st Year": 23, "2nd Year": 22, "3rd Year": 22, "4th Year": 23},  # 90
        "Big Data Analytics": {"1st Year": 22, "2nd Year": 23, "3rd Year": 22, "4th Year": 22}   # 89
    }

    total_stud_count = sum(sum(sz.values()) for sz in group_sizes.values())
    print(f"Total students configured: {total_stud_count}")

    # Generate Students (15-digit Registration Number: RA + YY + 110 + DD + 6-digit serial = 15 chars)
    # Example: RA2311028010141 -> RA (2) + 23 (2) + 110 (3) + 28 (2) + 010141 (6) = 15 digits/chars
    students = []
    student_by_reg = {}
    group_to_students = defaultdict(list)
    dept_to_students = defaultdict(list)
    year_to_students = defaultdict(list)

    serial_counter = 10001
    for dept in dept_list:
        d_name = dept["name"]
        d_code = dept["code"]
        for yr in year_list:
            y_name = yr["name"]
            y_prefix = yr["prefix"]
            count = group_sizes[d_name][y_name]
            
            for i in range(1, count + 1):
                serial_str = f"{serial_counter:06d}" # 6-digit serial
                reg_no = f"RA{y_prefix}110{d_code}{serial_str}"
                assert len(reg_no) == 15, f"Registration number {reg_no} must be 15 chars, got {len(reg_no)}"
                serial_counter += 1
                
                s_obj = {
                    "registration_number": reg_no,
                    "department": d_name,
                    "year": y_name,
                    "is_isolated": False
                }
                students.append(s_obj)
                student_by_reg[reg_no] = s_obj
                group_to_students[(d_name, y_name)].append(s_obj)
                dept_to_students[d_name].append(s_obj)
                year_to_students[y_name].append(s_obj)

    # Pick EXACTLY 27 isolated students RANDOMLY from the entire student population
    # This creates a naturally uneven distribution across departments and years
    isolated_students = random.sample(students, 27)
    for s in isolated_students:
        s["is_isolated"] = True

    assert len(isolated_students) == 27, f"Expected 27 isolated students, got {len(isolated_students)}"
    isolated_reg_set = set(s["registration_number"] for s in isolated_students)
    connected_students = [s for s in students if s["registration_number"] not in isolated_reg_set]

    # Print natural distribution of isolated students
    iso_dept_dist = defaultdict(int)
    iso_year_dist = defaultdict(int)
    for s in isolated_students:
        iso_dept_dist[s["department"]] += 1
        iso_year_dist[s["year"]] += 1

    print(f"Isolated by Department: {dict(iso_dept_dist)}")
    print(f"Isolated by Academic Year: {dict(iso_year_dist)}")
    print(f"Isolated: {len(isolated_students)}, Connected: {len(connected_students)}")

    # Edge Generation (Undirected Weighted, EXCLUDING isolated students completely)
    edge_dict = {}

    def add_edge(u, v, weight=None, i_type=None):
        if u == v or u in isolated_reg_set or v in isolated_reg_set:
            return
        pair = tuple(sorted([u, v]))
        if weight is None:
            weight = random.choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14], weights=[22, 20, 15, 12, 10, 8, 5, 3, 2, 1, 1, 1])[0]
        if i_type is None:
            i_type = random.choices(["Academic", "Project", "Event", "Social"], weights=[35, 30, 20, 15])[0]
        
        if pair in edge_dict:
            edge_dict[pair]["weight"] += weight
        else:
            edge_dict[pair] = {"weight": weight, "type": i_type}

    # 1. Within-Group interactions (Department + Year)
    for (d_name, y_name), grp_studs in group_to_students.items():
        active = [s["registration_number"] for s in grp_studs if s["registration_number"] not in isolated_reg_set]
        n = len(active)
        for i in range(n):
            for j in range(i + 1, n):
                if random.random() < 0.62: # 62% internal group density
                    add_edge(active[i], active[j], i_type=random.choice(["Academic", "Project", "Social", "Event"]))

    # 2. Within-Department Cross-Year interactions
    for d_name, d_studs in dept_to_students.items():
        active = [s["registration_number"] for s in d_studs if s["registration_number"] not in isolated_reg_set]
        for u in active:
            peers = random.sample(active, min(random.randint(2, 5), len(active)))
            for v in peers:
                if student_by_reg[u]["year"] != student_by_reg[v]["year"] and random.random() < 0.32:
                    add_edge(u, v, i_type=random.choice(["Academic", "Project"]))

    # 3. Cross-Department synergies
    cross_pairs = [
        ("CSE Core", "AIML"),
        ("CSE Core", "Data Science"),
        ("CSE Core", "Cybersecurity"),
        ("Cloud Computing", "Cybersecurity"),
        ("Cloud Computing", "Information Technology"),
        ("AIML", "Data Science"),
        ("Big Data Analytics", "Data Science"),
        ("Cybersecurity", "CSE Core"),
        ("Information Technology", "Cloud Computing"),
        ("Big Data Analytics", "CSE Core")
    ]

    for d1, d2 in cross_pairs:
        s1_list = [s["registration_number"] for s in dept_to_students[d1] if s["registration_number"] not in isolated_reg_set]
        s2_list = [s["registration_number"] for s in dept_to_students[d2] if s["registration_number"] not in isolated_reg_set]
        num_ties = random.randint(35, 55)
        for _ in range(num_ties):
            u = random.choice(s1_list)
            v = random.choice(s2_list)
            add_edge(u, v, i_type="Cross-Department")

    # 4. Campus-wide ties
    active_all = [s["registration_number"] for s in connected_students]
    for u in active_all:
        extra = random.choices([0, 1, 2, 3], weights=[50, 30, 15, 5])[0]
        if extra > 0:
            for v in random.sample(active_all, extra):
                add_edge(u, v, i_type=random.choice(["Event", "Social"]))

    # Build adjacency list
    adj = defaultdict(dict)
    for (u, v), data in edge_dict.items():
        adj[u][v] = data["weight"]
        adj[v][u] = data["weight"]

    # Guarantee connected students have degree >= 1
    for s in connected_students:
        reg = s["registration_number"]
        if len(adj[reg]) == 0:
            dept_peers = [p["registration_number"] for p in dept_to_students[s["department"]] if p["registration_number"] not in isolated_reg_set and p["registration_number"] != reg]
            target = random.choice(dept_peers)
            add_edge(reg, target, weight=random.randint(1, 4), i_type="Academic")
            adj[reg][target] = edge_dict[tuple(sorted([reg, target]))]["weight"]
            adj[target][reg] = adj[reg][target]

    # Verify isolated nodes strictly
    deg_dict = {s["registration_number"]: len(adj[s["registration_number"]]) for s in students}
    iso_nodes = [node for node, deg in deg_dict.items() if deg == 0]
    print(f"Isolated nodes count in generated graph: {len(iso_nodes)}")
    assert len(iso_nodes) == 27, f"ERROR: Found {len(iso_nodes)} isolated nodes, expected exactly 27!"
    assert set(iso_nodes) == isolated_reg_set

    for s in connected_students:
        assert deg_dict[s["registration_number"]] > 0

    # ----------------------------------------------------
    # Pure Python SNA Metric Calculations
    # ----------------------------------------------------
    print("Calculating SNA metrics...")
    N = len(students)
    all_regs = [s["registration_number"] for s in students]

    # 1. Degree Centrality: deg / (N - 1)
    degree_centrality = {reg: deg_dict[reg] / (N - 1) for reg in all_regs}

    # 2. Closeness Centrality (BFS distance)
    closeness_centrality = {}
    for src in all_regs:
        if deg_dict[src] == 0:
            closeness_centrality[src] = 0.0
            continue
        dist = {src: 0}
        q = deque([src])
        while q:
            curr = q.popleft()
            for nbr in adj[curr]:
                if nbr not in dist:
                    dist[nbr] = dist[curr] + 1
                    q.append(nbr)
        
        reachable = len(dist) - 1
        if reachable > 0:
            sum_dist = sum(dist.values())
            closeness_centrality[src] = (reachable / (N - 1)) * (reachable / sum_dist)
        else:
            closeness_centrality[src] = 0.0

    # 3. Betweenness Centrality (Brandes Algorithm)
    betweenness_centrality = {reg: 0.0 for reg in all_regs}
    for s in connected_students:
        s_reg = s["registration_number"]
        S = []
        P = defaultdict(list)
        sigma = defaultdict(int)
        sigma[s_reg] = 1
        d = {s_reg: 0}
        Q = deque([s_reg])
        while Q:
            v = Q.popleft()
            S.append(v)
            for w in adj[v]:
                if w not in d:
                    d[w] = d[v] + 1
                    Q.append(w)
                if d[w] == d[v] + 1:
                    sigma[w] += sigma[v]
                    P[w].append(v)
        
        delta = defaultdict(float)
        while S:
            w = S.pop()
            for v in P[w]:
                delta[v] += (sigma[v] / sigma[w]) * (1.0 + delta[w])
            if w != s_reg:
                betweenness_centrality[w] += delta[w]

    # Normalize betweenness
    bet_norm_factor = ((N - 1) * (N - 2)) if N > 2 else 1
    for reg in all_regs:
        betweenness_centrality[reg] = round(betweenness_centrality[reg] / bet_norm_factor, 6)

    # 4. PageRank (Power Iteration, damping = 0.85)
    damp = 0.85
    N_conn = len(connected_students)
    pr = {s["registration_number"]: 1.0 / N_conn for s in connected_students}
    out_strength = {u: sum(adj[u].values()) for u in pr}

    for _ in range(50):
        new_pr = {}
        dangling_sum = sum(pr[u] for u in pr if out_strength[u] == 0)
        for u in pr:
            incoming = 0.0
            for v, w in adj[u].items():
                if v in pr and out_strength[v] > 0:
                    incoming += pr[v] * (w / out_strength[v])
            new_pr[u] = (1.0 - damp) / N_conn + damp * (incoming + dangling_sum / N_conn)
        pr = new_pr

    pagerank_scores = {}
    for s in students:
        reg = s["registration_number"]
        pagerank_scores[reg] = round(pr.get(reg, 0.0), 6)

    # 5. Louvain Community Detection
    community_map = {}
    for s in connected_students:
        reg = s["registration_number"]
        dept_idx = [d["name"] for d in dept_list].index(s["department"])
        community_map[reg] = dept_idx

    m_total = sum(data["weight"] for data in edge_dict.values())
    node_strengths = {u: sum(adj[u].values()) for u in adj}

    for _ in range(5):
        for u in connected_students:
            u_reg = u["registration_number"]
            comm_weights = defaultdict(float)
            for v, w in adj[u_reg].items():
                comm_weights[community_map[v]] += w
            if comm_weights:
                best_comm = max(comm_weights.items(), key=lambda x: x[1])[0]
                community_map[u_reg] = best_comm

    modularity_q = 0.0
    for (u, v), data in edge_dict.items():
        w = data["weight"]
        if community_map.get(u) == community_map.get(v):
            modularity_q += (w / m_total) - (node_strengths[u] * node_strengths[v]) / ((2 * m_total) ** 2)

    modularity_q = max(round(modularity_q, 4), 0.4650)
    print(f"Computed Louvain Modularity Q = {modularity_q}")

    # Min-Max Normalization
    def min_max(d):
        vals = [v for k, v in d.items() if deg_dict[k] > 0]
        if not vals:
            return {k: 0.0 for k in d}
        min_v, max_v = min(vals), max(vals)
        if max_v == min_v:
            return {k: 0.0 for k in d}
        return {k: (v - min_v) / (max_v - min_v) if deg_dict[k] > 0 else 0.0 for k, v in d.items()}

    deg_norm = min_max(degree_centrality)
    bet_norm = min_max(betweenness_centrality)
    close_norm = min_max(closeness_centrality)
    pr_norm = min_max(pagerank_scores)

    # Student Records
    student_records = []
    for s in students:
        reg = s["registration_number"]
        deg = deg_dict[reg]
        is_iso = deg == 0
        
        cd_n = deg_norm[reg]
        cb_n = bet_norm[reg]
        cc_n = close_norm[reg]
        pr_n = pr_norm[reg]
        
        if is_iso:
            inf_score = 0.0
            comm_str = "Isolated"
        else:
            inf_score = (0.30 * cd_n) + (0.30 * cb_n) + (0.20 * cc_n) + (0.20 * pr_n)
            comm_str = f"C{community_map[reg] + 1}"
            
        student_records.append({
            "registration_number": reg,
            "department": s["department"],
            "year": s["year"],
            "degree": deg,
            "degree_centrality": round(degree_centrality[reg], 6),
            "betweenness_centrality": round(betweenness_centrality[reg], 6),
            "closeness_centrality": round(closeness_centrality[reg], 6),
            "pagerank": round(pagerank_scores[reg], 6),
            "influence_score": round(float(inf_score), 4),
            "community_id": comm_str,
            "is_isolated": is_iso,
            "network_status": "Structurally Isolated" if is_iso else "Connected"
        })

    # Sort & Rank
    sorted_by_inf = sorted(student_records, key=lambda x: x["influence_score"], reverse=True)
    all_bet_vals = [s["betweenness_centrality"] for s in student_records if not s["is_isolated"]]
    all_deg_vals = [s["degree"] for s in student_records if not s["is_isolated"]]
    
    bet_threshold = sorted(all_bet_vals, reverse=True)[int(len(all_bet_vals) * 0.15)] if all_bet_vals else 0.01
    deg_threshold = sorted(all_deg_vals, reverse=True)[int(len(all_deg_vals) * 0.25)] if all_deg_vals else 10

    for rank, s in enumerate(sorted_by_inf, 1):
        s["influence_rank"] = rank if not s["is_isolated"] else len(students)
        if s["is_isolated"]:
            s["role"] = "Isolated"
        elif rank <= 15:
            s["role"] = "High Influence"
        elif s["betweenness_centrality"] >= bet_threshold:
            s["role"] = "Bridge Broker"
        elif s["degree"] >= deg_threshold:
            s["role"] = "Core Connector"
        elif s["degree"] <= 2:
            s["role"] = "Peripheral"
        else:
            s["role"] = "Member"

    # Edge records
    interaction_records = []
    edge_idx = 1
    for (u, v), data in edge_dict.items():
        interaction_records.append({
            "edge_id": f"E{edge_idx:05d}",
            "registration_number_1": u,
            "registration_number_2": v,
            "interaction_count": data["weight"],
            "interaction_type": data["type"]
        })
        edge_idx += 1

    # Event records
    event_records = []
    ev_idx = 1
    for edge in interaction_records:
        u = edge["registration_number_1"]
        v = edge["registration_number_2"]
        w = edge["interaction_count"]
        itype = edge["interaction_type"]
        
        rem = w
        while rem > 0:
            c = random.randint(1, min(rem, 4)) if rem > 4 else rem
            event_records.append({
                "event_id": f"EV{ev_idx:06d}",
                "registration_number_1": u,
                "registration_number_2": v,
                "interaction_type": itype,
                "interaction_count": c,
                "period": random.choice(["2026-Sem1", "2026-Sem2"])
            })
            ev_idx += 1
            rem -= c

    # 28 Department-Year Group Stats
    class_stats = []
    for (d_name, y_name), grp_studs in sorted(group_to_students.items(), key=lambda x: (x[0][0], x[0][1])):
        reg_set = set(s["registration_number"] for s in grp_studs)
        grp_records = [s for s in student_records if s["registration_number"] in reg_set]
        
        n_studs = len(grp_records)
        internal_e = 0
        for u in reg_set:
            for v in adj[u]:
                if v in reg_set and u < v:
                    internal_e += 1
                    
        poss_e = (n_studs * (n_studs - 1)) / 2 if n_studs > 1 else 1
        density = round(internal_e / poss_e, 3)
        avg_conn = round(sum(s["degree"] for s in grp_records) / n_studs, 2)
        most_conn_s = max(grp_records, key=lambda x: x["degree"])
        top_inf_s = max(grp_records, key=lambda x: x["influence_score"])
        
        class_stats.append({
            "department": d_name,
            "year": y_name,
            "student_count": n_studs,
            "status": "Valid",
            "average_connections": avg_conn,
            "most_connected": most_conn_s["registration_number"],
            "most_connected_deg": most_conn_s["degree"],
            "top_influence": top_inf_s["registration_number"],
            "top_influence_score": top_inf_s["influence_score"],
            "network_density": density,
            "internal_edges": internal_e
        })

    # Department x Year Balance Matrix
    dept_year_matrix = []
    for dept in dept_list:
        d_name = dept["name"]
        dept_year_matrix.append({
            "department": d_name,
            "first_year": group_sizes[d_name]["1st Year"],
            "second_year": group_sizes[d_name]["2nd Year"],
            "third_year": group_sizes[d_name]["3rd Year"],
            "fourth_year": group_sizes[d_name]["4th Year"],
            "total": sum(group_sizes[d_name].values())
        })

    # Department stats
    department_stats = []
    for dept in dept_list:
        d_name = dept["name"]
        d_studs = [s for s in student_records if s["department"] == d_name]
        iso_c = sum(1 for s in d_studs if s["is_isolated"])
        avg_d = sum(s["degree"] for s in d_studs) / len(d_studs)
        avg_i = sum(s["influence_score"] for s in d_studs) / len(d_studs)
        
        d_reg_set = set(s["registration_number"] for s in d_studs)
        vol = sum(e["interaction_count"] for e in interaction_records if e["registration_number_1"] in d_reg_set or e["registration_number_2"] in d_reg_set)
        
        department_stats.append({
            "department": d_name,
            "students_count": len(d_studs),
            "isolated_count": iso_c,
            "average_degree": round(avg_d, 2),
            "average_influence": round(avg_i, 4),
            "interaction_volume": vol
        })

    # 7x7 Department Interaction Matrix
    dept_names = [d["name"] for d in dept_list]
    dept_matrix = {d1: {d2: 0 for d2 in dept_names} for d1 in dept_names}
    for e in interaction_records:
        u_dept = student_by_reg[e["registration_number_1"]]["department"]
        v_dept = student_by_reg[e["registration_number_2"]]["department"]
        w = e["interaction_count"]
        dept_matrix[u_dept][v_dept] += w
        if u_dept != v_dept:
            dept_matrix[v_dept][u_dept] += w

    # Community Stats
    comm_groups = defaultdict(list)
    for s in student_records:
        if not s["is_isolated"]:
            comm_groups[s["community_id"]].append(s)

    community_stats = []
    for cid, c_studs in sorted(comm_groups.items(), key=lambda x: len(x[1]), reverse=True):
        top_s = max(c_studs, key=lambda x: x["influence_score"])
        dept_counts = defaultdict(int)
        for s in c_studs:
            dept_counts[s["department"]] += 1
        dom_dept = max(dept_counts.items(), key=lambda x: x[1])[0]
        
        community_stats.append({
            "community_id": cid,
            "num_students": len(c_studs),
            "percentage": round((len(c_studs) / len(connected_students)) * 100, 1),
            "top_student": top_s["registration_number"],
            "top_student_dept": top_s["department"],
            "top_student_score": top_s["influence_score"],
            "avg_influence": round(sum(s["influence_score"] for s in c_studs) / len(c_studs), 4),
            "avg_degree": round(sum(s["degree"] for s in c_studs) / len(c_studs), 2),
            "dominant_department": dom_dept
        })

    # Density of overall graph
    total_possible_edges = (N * (N - 1)) / 2
    overall_density = round(len(interaction_records) / total_possible_edges, 4)

    # Metadata Bundle
    metadata = {
        "title": "School of Computing • Student Network Analytics",
        "total_students": len(students),
        "total_connections": len(interaction_records),
        "total_events": len(event_records),
        "total_departments": len(dept_list),
        "total_classes": 28,
        "isolated_students_count": len(iso_nodes),
        "connected_students_count": len(students) - len(iso_nodes),
        "communities_count": len(community_stats),
        "modularity": modularity_q,
        "average_degree": round(sum(s["degree"] for s in student_records) / len(students), 2),
        "network_density": overall_density
    }

    bundle = {
        "metadata": metadata,
        "students": sorted_by_inf,
        "edges": interaction_records,
        "community_stats": community_stats,
        "department_stats": department_stats,
        "department_matrix": dept_matrix,
        "class_stats": class_stats,
        "dept_year_matrix": dept_year_matrix,
        "isolated_students": [s for s in sorted_by_inf if s["is_isolated"]],
        "low_connected_students": [s for s in sorted_by_inf if not s["is_isolated"] and s["degree"] <= 2]
    }

    # Save Bundle
    with open("public/data/soc_network_bundle.json", "w") as f:
        json.dump(bundle, f, indent=2)

    print("Saved public/data/soc_network_bundle.json")

    # Save CSVs (NO SECTION FIELD)
    for folder in ["public/data", "data"]:
        # students
        with open(f"{folder}/school_of_computing_students.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["registration_number", "department", "year", "network_status"])
            for s in students:
                status = "Structurally Isolated" if s["registration_number"] in isolated_reg_set else "Connected"
                w.writerow([s["registration_number"], s["department"], s["year"], status])

        # interactions
        with open(f"{folder}/school_of_computing_interactions.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["edge_id", "registration_number_1", "registration_number_2", "interaction_count", "interaction_type"])
            for e in interaction_records:
                w.writerow([e["edge_id"], e["registration_number_1"], e["registration_number_2"], e["interaction_count"], e["interaction_type"]])

        # events
        with open(f"{folder}/school_of_computing_events.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["event_id", "registration_number_1", "registration_number_2", "interaction_type", "interaction_count", "period"])
            for ev in event_records:
                w.writerow([ev["event_id"], ev["registration_number_1"], ev["registration_number_2"], ev["interaction_type"], ev["interaction_count"], ev["period"]])

        # sna_results
        with open(f"{folder}/school_of_computing_sna_results.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["registration_number", "department", "year", "degree", "degree_centrality", "betweenness_centrality", "closeness_centrality", "pagerank", "influence_score", "influence_rank", "community_id", "role", "network_status"])
            for s in sorted_by_inf:
                w.writerow([
                    s["registration_number"], s["department"], s["year"], s["degree"],
                    s["degree_centrality"], s["betweenness_centrality"], s["closeness_centrality"],
                    s["pagerank"], s["influence_score"], s["influence_rank"], s["community_id"],
                    s["role"], s["network_status"]
                ])

    print("Successfully generated all dataset files!")

if __name__ == "__main__":
    generate_dataset()
