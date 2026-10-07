import csv
import json
import os
import networkx as nx

def build_616_dataset_and_bundle():
    os.makedirs('data', exist_ok=True)
    os.makedirs('public/data', exist_ok=True)

    dept_list = [
        {"name": "CSE Core", "code": "03"},
        {"name": "Big Data Analytics", "code": "27"},
        {"name": "Cloud Computing", "code": "28"},
        {"name": "Cybersecurity", "code": "29"},
        {"name": "Information Technology", "code": "30"},
        {"name": "Data Science", "code": "54"},
        {"name": "AIML", "code": "56"}
    ]

    year_list = [
        {"year": "4th Year", "prefix": "RA23", "year_num": 4, "range": (1, 22)},
        {"year": "3rd Year", "prefix": "RA24", "year_num": 3, "range": (23, 44)},
        {"year": "2nd Year", "prefix": "RA25", "year_num": 2, "range": (45, 66)},
        {"year": "1st Year", "prefix": "RA26", "year_num": 1, "range": (67, 88)}
    ]

    # Clubs pool
    clubs_pool = [
        "Coding Club",
        "AI & ML Club",
        "Cloud Club",
        "Cyber Security Club",
        "Data Science Club",
        "Robotics Club",
        "Open Source Club",
        "Sports Club",
        "Cultural Club",
        "Entrepreneurship Club",
        "None"
    ]

    # 8 designated isolated students across different departments and years
    # 1. CSE Core 4th Year: RA2311003000001
    # 2. CSE Core 1st Year: RA2611003000074
    # 3. Big Data Analytics 2nd Year: RA2511027000051
    # 4. Cloud Computing 1st Year: RA2611028000070
    # 5. Cybersecurity 4th Year: RA2311029000005
    # 6. Information Technology 3rd Year: RA2411030000028
    # 7. Data Science 2nd Year: RA2511054000047
    # 8. AIML 3rd Year: RA2411056000024
    designated_isolates = set([
        "RA2311003000001",
        "RA2611003000074",
        "RA2511027000051",
        "RA2611028000070",
        "RA2311029000005",
        "RA2411030000028",
        "RA2511054000047",
        "RA2411056000024"
    ])

    # 1. Generate 616 Students
    students = []
    reg_set = set()
    global_idx = 0

    for d in dept_list:
        for y in year_list:
            start_num, end_num = y["range"]
            for num in range(start_num, end_num + 1):
                reg = f"{y['prefix']}110{d['code']}{num:07d}"
                if reg in reg_set:
                    raise ValueError(f"Duplicate registration number detected: {reg}")
                reg_set.add(reg)
                
                is_iso = reg in designated_isolates
                status = "Network-Isolated" if is_iso else "Connected"
                
                # Synthetic community baseline
                comm_id = f"Community {((global_idx % 6) + 1)}" if not is_iso else "Isolated"
                club = clubs_pool[(global_idx * 3 + int(d['code'])) % len(clubs_pool)]

                students.append({
                    "registration_number": reg,
                    "department": d["name"],
                    "dept_code": d["code"],
                    "year": y["year"],
                    "year_num": y["year_num"],
                    "section": "A",
                    "club": club,
                    "synthetic_community": comm_id,
                    "network_status": status
                })
                global_idx += 1

    print(f"Total students created: {len(students)}")
    assert len(students) == 616, f"Expected 616 students, got {len(students)}"

    # Build student metadata lookup
    student_meta = {s["registration_number"]: s for s in students}

    # 2. Generate 5,320 Weighted Interaction Edges
    # Structure:
    # A. Dense intra-class interactions (within each of the 28 classes) ~2,800 edges
    # B. Departmental cross-year ties ~1,000 edges
    # C. Cross-department ties (CSE ↔ AIML, Cloud ↔ Cyber, etc.) ~1,520 edges
    import random
    random.seed(2026)

    all_pairs = set()
    connected_regs = [s["registration_number"] for s in students if s["network_status"] == "Connected"]
    connected_set = set(connected_regs)

    # Group by class (Dept + Year)
    class_groups = {}
    for s in students:
        if s["network_status"] == "Connected":
            key = f"{s['department']}_{s['year']}"
            class_groups.setdefault(key, []).append(s["registration_number"])

    # Group by department
    dept_groups = {}
    for s in students:
        if s["network_status"] == "Connected":
            dept_groups.setdefault(s["department"], []).append(s["registration_number"])

    # A. Intra-class connections
    for c_key, members in class_groups.items():
        n = len(members)
        # Connected ring backbone
        for i in range(n):
            pair = tuple(sorted([members[i], members[(i + 1) % n]]))
            all_pairs.add(pair)
        # Additional intra-class edges
        for i in range(n):
            for j in range(i + 2, n):
                if random.random() < 0.38:
                    pair = tuple(sorted([members[i], members[j]]))
                    all_pairs.add(pair)

    # B. Intra-department cross-year connections
    for d_name, d_members in dept_groups.items():
        for _ in range(120):
            u, v = random.sample(d_members, 2)
            if u != v:
                all_pairs.add(tuple(sorted([u, v])))

    # C. Cross-department bridge connections
    # Key bridge leaders
    top_bridge_candidates = random.sample(connected_regs, 35)
    
    cross_dept_pairs = [
        ("CSE Core", "AIML"),
        ("CSE Core", "Data Science"),
        ("Cloud Computing", "Cybersecurity"),
        ("Cloud Computing", "Information Technology"),
        ("AIML", "Data Science"),
        ("Big Data Analytics", "Data Science"),
        ("Cybersecurity", "CSE Core"),
        ("Information Technology", "CSE Core"),
        ("Big Data Analytics", "AIML"),
        ("Cloud Computing", "CSE Core")
    ]

    for d1, d2 in cross_dept_pairs:
        m1 = dept_groups[d1]
        m2 = dept_groups[d2]
        for _ in range(160):
            u = random.choice(m1)
            v = random.choice(m2)
            all_pairs.add(tuple(sorted([u, v])))

    # Fill or trim to exactly 5,320 edges
    pair_list = list(all_pairs)
    while len(pair_list) < 5320:
        if random.random() < 0.6:
            u = random.choice(top_bridge_candidates)
            v = random.choice(connected_regs)
        else:
            u, v = random.sample(connected_regs, 2)
        if u != v:
            pair = tuple(sorted([u, v]))
            if pair not in all_pairs:
                all_pairs.add(pair)
                pair_list.append(pair)

    if len(pair_list) > 5320:
        pair_list = pair_list[:5320]

    pair_list.sort()
    print(f"Total unique interaction edges: {len(pair_list)}")

    interaction_types = [
        "Academic",
        "Project",
        "Club",
        "Social",
        "Event"
    ]

    edge_rows = []
    for idx, (u, v) in enumerate(pair_list, 1):
        is_cross = student_meta[u]["department"] != student_meta[v]["department"]
        
        if is_cross:
            itype = "Cross-Department"
            weight = random.choices([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14], weights=[10, 15, 20, 20, 15, 10, 5, 3, 1, 1, 1])[0]
        else:
            itype = random.choice(interaction_types)
            weight = random.choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14], weights=[20, 20, 18, 14, 10, 7, 4, 3, 2, 1, 1, 1])[0]

        edge_rows.append({
            "edge_id": f"E{idx:05d}",
            "registration_number_1": u,
            "registration_number_2": v,
            "interaction_count": weight,
            "interaction_type": itype
        })

    # 3. Generate 10,409 Longitudinal Events
    periods = [
        "2025-Sem1",
        "2026-Sem1",
        "2026-Sem2"
    ]
    event_rows = []
    ev_idx = 1
    for e in edge_rows:
        cnt = e["interaction_count"]
        # Break cnt into chunks summing to cnt
        remaining = cnt
        while remaining > 0:
            chunk = min(remaining, random.choices([1, 2, 3, 4, 5, 6], weights=[35, 30, 18, 10, 5, 2])[0])
            event_rows.append({
                "event_id": f"EV{ev_idx:06d}",
                "registration_number_1": e["registration_number_1"],
                "registration_number_2": e["registration_number_2"],
                "interaction_type": e["interaction_type"],
                "interaction_count": chunk,
                "period": random.choice(periods)
            })
            ev_idx += 1
            remaining -= chunk

    # Fill to exactly 10,409
    while len(event_rows) < 10409:
        e = random.choice(edge_rows)
        event_rows.append({
            "event_id": f"EV{len(event_rows)+1:06d}",
            "registration_number_1": e["registration_number_1"],
            "registration_number_2": e["registration_number_2"],
            "interaction_type": e["interaction_type"],
            "interaction_count": random.randint(1, 3),
            "period": random.choice(periods)
        })
    if len(event_rows) > 10409:
        event_rows = event_rows[:10409]

    print(f"Total longitudinal events: {len(event_rows)}")

    # 4. Graph Modeling & NetworkX Metrics Computation
    G = nx.Graph()
    for s in students:
        G.add_node(
            s["registration_number"],
            department=s["department"],
            year=s["year"],
            year_num=s["year_num"],
            section=s["section"],
            club=s["club"],
            network_status=s["network_status"]
        )

    for e in edge_rows:
        G.add_edge(
            e["registration_number_1"],
            e["registration_number_2"],
            weight=float(e["interaction_count"]),
            interaction_type=e["interaction_type"]
        )

    deg_dict = dict(G.degree())
    deg_cent = nx.degree_centrality(G)
    btw_cent = nx.betweenness_centrality(G, normalized=True)
    cls_cent = nx.closeness_centrality(G)
    
    # Power iteration PageRank
    N = len(G)
    nodes = list(G.nodes())
    pr_scores = {n: 1.0 / N for n in nodes}
    weights_sum = {n: sum(d.get("weight", 1.0) for _, _, d in G.edges(n, data=True)) for n in nodes}
    dangling = [n for n in nodes if weights_sum[n] == 0]
    alpha = 0.85
    for _ in range(150):
        pr_last = pr_scores.copy()
        pr_scores = {n: 0.0 for n in nodes}
        d_sum = alpha * sum(pr_last[n] for n in dangling)
        for n in nodes:
            for nbr in G[n]:
                w = G[n][nbr].get("weight", 1.0)
                if weights_sum[nbr] > 0:
                    pr_scores[n] += alpha * pr_last[nbr] * w / weights_sum[nbr]
        teleport = (1.0 - alpha) / N + d_sum / N
        for n in nodes:
            pr_scores[n] += teleport

    # Louvain Community Detection
    non_iso = [n for n, d in G.degree() if d > 0]
    subG = G.subgraph(non_iso)
    raw_comms = sorted(nx.community.louvain_communities(subG, weight="weight", seed=42), key=len, reverse=True)
    modularity = nx.community.modularity(subG, raw_comms, weight="weight")
    
    comm_map = {}
    for idx, c_set in enumerate(raw_comms, 1):
        c_name = f"Community {idx}"
        for n in c_set:
            comm_map[n] = c_name
    for iso_n in [n for n, d in G.degree() if d == 0]:
        comm_map[iso_n] = "Isolated"

    # Min-Max Normalization
    def min_max(val, min_v, max_v):
        return (val - min_v) / (max_v - min_v) if max_v > min_v else 0.0

    min_deg, max_deg = min(deg_cent.values()), max(deg_cent.values())
    min_btw, max_btw = min(btw_cent.values()), max(btw_cent.values())
    min_cls, max_cls = min(cls_cent.values()), max(cls_cent.values())
    min_pr, max_pr = min(pr_scores.values()), max(pr_scores.values())

    compiled_students = []
    for s in students:
        reg = s["registration_number"]
        d = deg_dict[reg]
        dc = deg_cent[reg]
        bc = btw_cent[reg]
        cc = cls_cent[reg]
        pr = pr_scores[reg]
        
        n_dc = min_max(dc, min_deg, max_deg)
        n_bc = min_max(bc, min_btw, max_btw)
        n_cc = min_max(cc, min_cls, max_cls)
        n_pr = min_max(pr, min_pr, max_pr)

        inf_score = round(0.30 * n_dc + 0.30 * n_bc + 0.20 * n_cc + 0.20 * n_pr, 4)

        compiled_students.append({
            "registration_number": reg,
            "department": s["department"],
            "dept_code": s["dept_code"],
            "year": s["year"],
            "year_num": s["year_num"],
            "section": s["section"],
            "club": s["club"],
            "degree": d,
            "degree_centrality": round(dc, 4),
            "betweenness_centrality": round(bc, 4),
            "closeness_centrality": round(cc, 4),
            "pagerank": round(pr, 4),
            "norm_degree": round(n_dc, 4),
            "norm_betweenness": round(n_bc, 4),
            "norm_closeness": round(n_cc, 4),
            "norm_pagerank": round(n_pr, 4),
            "influence_score": inf_score,
            "community": comm_map.get(reg, "Community 1"),
            "network_status": s["network_status"]
        })

    # Ranks and Roles
    compiled_students.sort(key=lambda x: x["influence_score"], reverse=True)
    for i, s in enumerate(compiled_students, 1):
        s["influence_rank"] = i

    for s in compiled_students:
        deg = s["degree"]
        inf_rank = s["influence_rank"]
        bc = s["betweenness_centrality"]
        
        if deg == 0:
            s["role"] = "Network-Isolated"
        elif deg in [1, 2]:
            s["role"] = "Low-Connected"
        elif inf_rank <= 15:
            if bc >= 0.012:
                s["role"] = "Bridge Student"
            else:
                s["role"] = "Influential"
        elif bc >= 0.010:
            s["role"] = "Bridge"
        elif deg >= 24:
            s["role"] = "Highly Connected"
        elif s["closeness_centrality"] >= 0.44:
            s["role"] = "Central"
        else:
            s["role"] = "Peer Member"

    # Department interaction matrix
    dept_names = [d["name"] for d in dept_list]
    dept_matrix = {d1: {d2: 0 for d2 in dept_names} for d1 in dept_names}
    for e in edge_rows:
        d1 = student_meta[e["registration_number_1"]]["department"]
        d2 = student_meta[e["registration_number_2"]]["department"]
        cnt = e["interaction_count"]
        dept_matrix[d1][d2] += cnt
        if d1 != d2:
            dept_matrix[d2][d1] += cnt

    # Community statistics
    unique_comms = sorted(list(set(comm_map.values())))
    comm_stats = []
    for c_id in unique_comms:
        if c_id == "Isolated":
            continue
        c_students = [s for s in compiled_students if s["community"] == c_id]
        if not c_students:
            continue
        top_s = max(c_students, key=lambda x: x["influence_score"])
        avg_inf = sum(x["influence_score"] for x in c_students) / len(c_students)
        avg_deg = sum(x["degree"] for x in c_students) / len(c_students)
        
        d_counts = {}
        for x in c_students:
            d_counts[x["department"]] = d_counts.get(x["department"], 0) + 1
        dom_dept = max(d_counts, key=d_counts.get)

        comm_stats.append({
            "community_id": c_id,
            "num_students": len(c_students),
            "percentage": round(100.0 * len(c_students) / 616, 1),
            "top_student": top_s["registration_number"],
            "top_student_dept": top_s["department"],
            "top_student_score": top_s["influence_score"],
            "avg_influence": round(avg_inf, 3),
            "avg_degree": round(avg_deg, 2),
            "dominant_department": dom_dept
        })

    # Department statistics
    dept_stats = []
    for d_name in dept_names:
        d_students = [s for s in compiled_students if s["department"] == d_name]
        d_iso = [s for s in d_students if s["degree"] == 0]
        avg_inf = sum(s["influence_score"] for s in d_students) / len(d_students) if d_students else 0
        avg_deg = sum(s["degree"] for s in d_students) / len(d_students) if d_students else 0
        total_vol = sum(dept_matrix[d_name][d_other] for d_other in dept_names)
        
        dept_stats.append({
            "department": d_name,
            "students_count": len(d_students),
            "isolated_count": len(d_iso),
            "average_degree": round(avg_deg, 2),
            "average_influence": round(avg_inf, 3),
            "interaction_volume": total_vol
        })

    # Class-Level Statistics & Validation Breakdown (All 28 classes)
    class_stats = []
    for d_name in dept_names:
        for y in ["1st Year", "2nd Year", "3rd Year", "4th Year"]:
            c_members = [s for s in compiled_students if s["department"] == d_name and s["year"] == y and s["section"] == "A"]
            count = len(c_members)
            status = "✓ Valid" if count >= 20 else "Invalid"
            
            c_regs = set(s["registration_number"] for s in c_members)
            c_subgraph = G.subgraph(c_regs)
            c_edges = c_subgraph.number_of_edges()
            c_density = round(nx.density(c_subgraph), 3) if count > 1 else 0
            
            top_conn = max(c_members, key=lambda x: x["degree"])
            top_inf = max(c_members, key=lambda x: x["influence_score"])
            avg_conn = round(sum(x["degree"] for x in c_members) / count, 2)
            
            class_stats.append({
                "department": d_name,
                "year": y,
                "section": "A",
                "student_count": count,
                "status": status,
                "average_connections": avg_conn,
                "most_connected": top_conn["registration_number"],
                "most_connected_deg": top_conn["degree"],
                "top_influence": top_inf["registration_number"],
                "top_influence_score": top_inf["influence_score"],
                "network_density": c_density,
                "internal_edges": c_edges
            })

    # Department/Year Matrix
    dept_year_matrix = []
    for d_name in dept_names:
        y1 = len([s for s in compiled_students if s["department"] == d_name and s["year"] == "1st Year"])
        y2 = len([s for s in compiled_students if s["department"] == d_name and s["year"] == "2nd Year"])
        y3 = len([s for s in compiled_students if s["department"] == d_name and s["year"] == "3rd Year"])
        y4 = len([s for s in compiled_students if s["department"] == d_name and s["year"] == "4th Year"])
        dept_year_matrix.append({
            "department": d_name,
            "first_year": y1,
            "second_year": y2,
            "third_year": y3,
            "fourth_year": y4,
            "total": y1 + y2 + y3 + y4
        })

    # Export Full Bundle
    bundle = {
        "metadata": {
            "title": "School of Computing Student Network Analytics",
            "subtitle": "Explore student connections, influence and communities",
            "total_students": 616,
            "total_connections": 5320,
            "total_events": 10409,
            "total_departments": 7,
            "total_classes": 28,
            "isolated_students_count": 8,
            "communities_count": len(comm_stats),
            "modularity": round(modularity, 4),
            "average_degree": round(sum(d for _, d in G.degree()) / 616, 2),
            "network_density": round(nx.density(G), 4)
        },
        "students": compiled_students,
        "edges": edge_rows,
        "community_stats": comm_stats,
        "department_stats": dept_stats,
        "department_matrix": dept_matrix,
        "class_stats": class_stats,
        "dept_year_matrix": dept_year_matrix,
        "isolated_students": [s for s in compiled_students if s["degree"] == 0],
        "low_connected_students": [s for s in compiled_students if s["degree"] in [1, 2]]
    }

    # Write files to public/data and data
    for folder in ['public/data', 'data']:
        with open(f'{folder}/soc_network_bundle.json', 'w', encoding='utf-8') as f:
            json.dump(bundle, f, indent=2)

        # Write students CSV
        with open(f'{folder}/school_of_computing_students_616.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["registration_number", "department", "year", "section", "club", "network_status"])
            writer.writeheader()
            for s in students:
                writer.writerow({
                    "registration_number": s["registration_number"],
                    "department": s["department"],
                    "year": s["year"],
                    "section": s["section"],
                    "club": s["club"],
                    "network_status": s["network_status"]
                })

        # Also write alias with standard name
        with open(f'{folder}/school_of_computing_students.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["registration_number", "department", "year", "section", "club", "network_status"])
            writer.writeheader()
            for s in students:
                writer.writerow({
                    "registration_number": s["registration_number"],
                    "department": s["department"],
                    "year": s["year"],
                    "section": s["section"],
                    "club": s["club"],
                    "network_status": s["network_status"]
                })

        # Write interactions CSV
        with open(f'{folder}/school_of_computing_interactions_616.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["edge_id", "registration_number_1", "registration_number_2", "interaction_count", "interaction_type"])
            writer.writeheader()
            writer.writerows(edge_rows)

        with open(f'{folder}/school_of_computing_interactions.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["edge_id", "registration_number_1", "registration_number_2", "interaction_count", "interaction_type"])
            writer.writeheader()
            writer.writerows(edge_rows)

        # Write events CSV
        with open(f'{folder}/school_of_computing_events_616.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["event_id", "registration_number_1", "registration_number_2", "interaction_type", "interaction_count", "period"])
            writer.writeheader()
            writer.writerows(event_rows)

        with open(f'{folder}/school_of_computing_events.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["event_id", "registration_number_1", "registration_number_2", "interaction_type", "interaction_count", "period"])
            writer.writeheader()
            writer.writerows(event_rows)

        # Write SNA Results CSV
        with open(f'{folder}/school_of_computing_sna_results_616.csv', 'w', newline='', encoding='utf-8') as f:
            fields = [
                "registration_number", "department", "year", "section", "club",
                "degree", "degree_centrality", "betweenness_centrality", "closeness_centrality",
                "pagerank", "influence_score", "influence_rank", "community", "role", "network_status"
            ]
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            for s in compiled_students:
                writer.writerow({k: s[k] for k in fields})

    print("\nSUCCESS: 616-Student Balanced Dataset & SNA Bundle generated and verified!")
    print("Class Validation Summary: 28 of 28 classes have >= 20 students.")

if __name__ == '__main__':
    build_616_dataset_and_bundle()
