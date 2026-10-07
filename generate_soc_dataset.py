import csv
import json
import random
import os
import networkx as nx

def generate_soc_dataset():
    random.seed(2026)
    os.makedirs('data', exist_ok=True)
    os.makedirs('public/data', exist_ok=True)

    # 1. Departments and their 2-digit codes
    dept_info = [
        {"name": "CSE Core", "code": "03"},
        {"name": "Big Data Analytics", "code": "27"},
        {"name": "Cloud Computing", "code": "28"},
        {"name": "Cybersecurity", "code": "29"},
        {"name": "Information Technology", "code": "30"},
        {"name": "Data Science", "code": "54"},
        {"name": "AIML", "code": "56"}
    ]

    years_info = [
        {"year_num": 4, "prefix": "RA23", "label": "4th Year"},
        {"year_num": 3, "prefix": "RA24", "label": "3rd Year"},
        {"year_num": 2, "prefix": "RA25", "label": "2nd Year"},
        {"year_num": 1, "prefix": "RA26", "label": "1st Year"}
    ]

    sections = ["Section A", "Section B", "Section C", "Section D"]
    clubs = [
        "Coding Club",
        "AI & Robotics Club",
        "Cyber Security Club",
        "Cloud Computing Society",
        "Big Data Analytics Club",
        "Web3 & Open Source",
        "ACM Student Chapter",
        "None"
    ]

    # Generate 500 students (125 per year across 7 departments)
    students = []
    reg_numbers = []
    
    # 8 designated isolated students across different departments & years
    # 500 - 8 = 492 connected students
    isolated_indices = set([12, 65, 140, 210, 290, 360, 425, 490])

    student_idx = 0
    for y_idx, y_info in enumerate(years_info):
        for i in range(125):
            d_info = dept_info[(y_idx * 17 + i) % len(dept_info)]
            serial = 10000 + student_idx + 1
            # Registration Number structure: RA23 + 110 + DeptCode + Serial
            # e.g., RA2311028010141
            reg_num = f"{y_info['prefix']}110{d_info['code']}0{serial % 10000:04d}"
            
            is_isolated = student_idx in isolated_indices
            status = "Network-Isolated" if is_isolated else "Connected"
            
            # Underlying synthetic community (for post-hoc validation only)
            comm_id = f"Community {((student_idx % 6) + 1)}" if not is_isolated else "Isolated"
            sec = sections[(student_idx * 3) % len(sections)]
            club = clubs[(student_idx * 7) % len(clubs)]

            students.append({
                "registration_number": reg_num,
                "department": d_info["name"],
                "dept_code": d_info["code"],
                "year": y_info["label"],
                "year_num": y_info["year_num"],
                "section": sec,
                "club": club,
                "synthetic_community": comm_id,
                "network_status": status
            })
            reg_numbers.append(reg_num)
            student_idx += 1

    print(f"Total students generated: {len(students)}")
    print(f"Isolated students count: {len(isolated_indices)}")

    # Write students CSV
    student_fields = ["registration_number", "department", "year", "section", "club", "synthetic_community", "network_status"]
    
    for path in ['data/school_of_computing_students_500.csv', 'public/data/school_of_computing_students_500.csv']:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=student_fields)
            writer.writeheader()
            for s in students:
                row = {k: s[k] for k in student_fields}
                writer.writerow(row)

    # 2. Generate 3,726 unique interaction edges between connected students
    connected_students = [s["registration_number"] for s in students if s["network_status"] == "Connected"]
    
    # Community clustering groups to simulate realistic modularity
    student_meta = {s["registration_number"]: s for s in students}
    comm_groups = {f"Community {c}": [] for c in range(1, 7)}
    for s_reg in connected_students:
        c_tag = student_meta[s_reg]["synthetic_community"]
        if c_tag in comm_groups:
            comm_groups[c_tag].append(s_reg)

    interaction_types = [
        "Lab Collaboration",
        "Project Team",
        "Technical Club",
        "Peer Study",
        "Hackathon Team"
    ]

    all_pairs = set()

    # Intra-community backbone & dense ties (~2,700 edges)
    for c_name, members in comm_groups.items():
        n_mem = len(members)
        for idx in range(n_mem - 1):
            pair = tuple(sorted([members[idx], members[idx+1]]))
            all_pairs.add(pair)
            
        target_intra = 450
        attempts = 0
        while len([p for p in all_pairs if student_meta[p[0]]["synthetic_community"] == c_name and student_meta[p[1]]["synthetic_community"] == c_name]) < target_intra and attempts < 10000:
            u, v = random.sample(members, 2)
            pair = tuple(sorted([u, v]))
            all_pairs.add(pair)
            attempts += 1

    # Inter-community bridge edges & departmental ties (~1,026 edges to reach 3,726)
    # Designated top bridge students
    key_bridges = random.sample(connected_students, 25)
    
    attempts = 0
    while len(all_pairs) < 3726 and attempts < 50000:
        attempts += 1
        if random.random() < 0.60:
            u = random.choice(key_bridges)
            v = random.choice(connected_students)
        else:
            u, v = random.sample(connected_students, 2)
        if u != v:
            pair = tuple(sorted([u, v]))
            all_pairs.add(pair)

    pair_list = list(all_pairs)
    if len(pair_list) > 3726:
        pair_list = pair_list[:3726]
    while len(pair_list) < 3726:
        u, v = random.sample(connected_students, 2)
        pair = tuple(sorted([u, v]))
        if pair not in all_pairs:
            all_pairs.add(pair)
            pair_list.append(pair)

    pair_list.sort()
    print(f"Total unique interaction pairs: {len(pair_list)}")

    edge_rows = []
    for idx, (u, v) in enumerate(pair_list, 1):
        if u in key_bridges or v in key_bridges:
            weight = random.choices([4, 5, 6, 7, 8, 9, 10, 12, 15, 18], weights=[15, 20, 20, 15, 12, 8, 5, 3, 1, 1])[0]
        else:
            weight = random.choices([1, 2, 3, 4, 5, 6, 7, 8], weights=[28, 25, 20, 12, 7, 4, 3, 1])[0]
            
        itype = random.choice(interaction_types)
        edge_rows.append({
            "edge_id": f"E{idx:05d}",
            "registration_number_1": u,
            "registration_number_2": v,
            "interaction_count": weight,
            "interaction_type": itype
        })

    edge_fields = ["edge_id", "registration_number_1", "registration_number_2", "interaction_count", "interaction_type"]
    for path in ['data/school_of_computing_interactions_500.csv', 'public/data/school_of_computing_interactions_500.csv']:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=edge_fields)
            writer.writeheader()
            writer.writerows(edge_rows)

    # 3. Generate 6,115 interaction events
    periods = [
        "Odd Sem 2025 - Month 1",
        "Odd Sem 2025 - Month 2",
        "Odd Sem 2025 - Midterm",
        "Odd Sem 2025 - Month 4",
        "Even Sem 2026 - Month 1",
        "Even Sem 2026 - Month 2",
        "Even Sem 2026 - Finals"
    ]

    events = []
    for e in edge_rows:
        events.append({
            "registration_number_1": e["registration_number_1"],
            "registration_number_2": e["registration_number_2"],
            "interaction_type": e["interaction_type"],
            "interaction_count": max(1, e["interaction_count"] // 2),
            "period": random.choice(periods)
        })
        
    extra_edges = random.choices(edge_rows, k=(6115 - len(edge_rows)))
    for e in extra_edges:
        events.append({
            "registration_number_1": e["registration_number_1"],
            "registration_number_2": e["registration_number_2"],
            "interaction_type": random.choice(interaction_types),
            "interaction_count": random.randint(1, 4),
            "period": random.choice(periods)
        })

    event_rows = []
    for idx, ev in enumerate(events, 1):
        event_rows.append({
            "event_id": f"EV{idx:05d}",
            "registration_number_1": ev["registration_number_1"],
            "registration_number_2": ev["registration_number_2"],
            "interaction_type": ev["interaction_type"],
            "interaction_count": ev["interaction_count"],
            "period": ev["period"]
        })

    event_fields = ["event_id", "registration_number_1", "registration_number_2", "interaction_type", "interaction_count", "period"]
    for path in ['data/school_of_computing_events_500.csv', 'public/data/school_of_computing_events_500.csv']:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=event_fields)
            writer.writeheader()
            writer.writerows(event_rows)

    print(f"Total events generated: {len(event_rows)}")

    # 4. Data dictionary CSV
    dict_rows = [
        {"dataset": "students", "column_name": "registration_number", "data_type": "string", "description": "Unique university registration number (RA23/RA24/RA25/RA26 + 110 + DeptCode + Serial)", "example_value": "RA2311028010141"},
        {"dataset": "students", "column_name": "department", "data_type": "string", "description": "School of Computing academic department program", "example_value": "Cloud Computing"},
        {"dataset": "students", "column_name": "year", "data_type": "string", "description": "Academic cohort year (1st Year to 4th Year)", "example_value": "4th Year"},
        {"dataset": "students", "column_name": "section", "data_type": "string", "description": "Classroom academic section", "example_value": "Section B"},
        {"dataset": "students", "column_name": "club", "data_type": "string", "description": "Extracurricular technical/social club affiliation", "example_value": "Coding Club"},
        {"dataset": "students", "column_name": "synthetic_community", "data_type": "string", "description": "Synthetic baseline community tag for academic validation only", "example_value": "Community 2"},
        {"dataset": "students", "column_name": "network_status", "data_type": "string", "description": "Graph connectivity state (Connected vs Network-Isolated)", "example_value": "Connected"},
        {"dataset": "interactions", "column_name": "edge_id", "data_type": "string", "description": "Unique undirected edge identifier", "example_value": "E00001"},
        {"dataset": "interactions", "column_name": "registration_number_1", "data_type": "string", "description": "Registration number of student 1", "example_value": "RA2311003010001"},
        {"dataset": "interactions", "column_name": "registration_number_2", "data_type": "string", "description": "Registration number of student 2", "example_value": "RA2411028010045"},
        {"dataset": "interactions", "column_name": "interaction_count", "data_type": "integer", "description": "Cumulative weighted frequency of observed interactions", "example_value": "7"},
        {"dataset": "interactions", "column_name": "interaction_type", "data_type": "string", "description": "Primary context of recorded peer interaction", "example_value": "Project Team"},
        {"dataset": "events", "column_name": "event_id", "data_type": "string", "description": "Longitudinal event timestamp log identifier", "example_value": "EV00001"},
        {"dataset": "events", "column_name": "period", "data_type": "string", "description": "Academic semester milestone observation window", "example_value": "Odd Sem 2025 - Midterm"}
    ]
    for path in ['data/school_of_computing_data_dictionary.csv', 'public/data/school_of_computing_data_dictionary.csv']:
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["dataset", "column_name", "data_type", "description", "example_value"])
            writer.writeheader()
            writer.writerows(dict_rows)

    # 5. Compute Full Graph & SNA Metrics (NetworkX)
    print("\nComputing Graph Metrics...")
    G = nx.Graph()
    for s in students:
        G.add_node(
            s["registration_number"],
            department=s["department"],
            year=s["year"],
            year_num=s["year_num"],
            section=s["section"],
            club=s["club"],
            synthetic_community=s["synthetic_community"],
            network_status=s["network_status"]
        )

    for e in edge_rows:
        G.add_edge(
            e["registration_number_1"],
            e["registration_number_2"],
            weight=float(e["interaction_count"]),
            interaction_type=e["interaction_type"]
        )

    # Centralities
    degree_dict = dict(G.degree())
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

    # Louvain Community Detection on connected subgraph
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

    # Compile student metrics
    compiled_students = []
    for s in students:
        reg = s["registration_number"]
        d = degree_dict[reg]
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

    # Add ranks
    compiled_students.sort(key=lambda x: x["influence_score"], reverse=True)
    for i, s in enumerate(compiled_students, 1):
        s["influence_rank"] = i

    # Assign roles
    for s in compiled_students:
        deg = s["degree"]
        inf_rank = s["influence_rank"]
        bc = s["betweenness_centrality"]
        
        if deg == 0:
            s["role"] = "Network-Isolated"
        elif deg in [1, 2]:
            s["role"] = "Low-Connected"
        elif inf_rank <= 15:
            if bc >= 0.015:
                s["role"] = "Bridge Student"
            else:
                s["role"] = "Influential"
        elif bc >= 0.012:
            s["role"] = "Bridge"
        elif deg >= 20:
            s["role"] = "Highly Connected"
        elif s["closeness_centrality"] >= 0.44:
            s["role"] = "Central"
        else:
            s["role"] = "Peer Member"

    # Department interaction matrix
    dept_names = [d["name"] for d in dept_info]
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
        
        # Dominant department
        d_counts = {}
        for x in c_students:
            d_counts[x["department"]] = d_counts.get(x["department"], 0) + 1
        dom_dept = max(d_counts, key=d_counts.get)

        comm_stats.append({
            "community_id": c_id,
            "num_students": len(c_students),
            "percentage": round(100.0 * len(c_students) / 500, 1),
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

    # Summary payload for frontend
    sna_bundle = {
        "metadata": {
            "title": "School of Computing Student Network Analytics",
            "subtitle": "Explore student connections, influence and communities",
            "total_students": 500,
            "total_connections": 3726,
            "total_events": 6115,
            "total_departments": 7,
            "isolated_students_count": 8,
            "communities_count": len(comm_stats),
            "modularity": round(modularity, 4),
            "average_degree": round(sum(d for _, d in G.degree()) / 500, 2),
            "network_density": round(nx.density(G), 4)
        },
        "students": compiled_students,
        "edges": edge_rows,
        "community_stats": comm_stats,
        "department_stats": dept_stats,
        "department_matrix": dept_matrix,
        "isolated_students": [s for s in compiled_students if s["degree"] == 0],
        "low_connected_students": [s for s in compiled_students if s["degree"] in [1, 2]]
    }

    # Write JSON bundle for fast React loading
    with open('public/data/soc_network_bundle.json', 'w', encoding='utf-8') as f:
        json.dump(sna_bundle, f, indent=2)

    # Also save SNA results CSV
    with open('public/data/school_of_computing_sna_results_500.csv', 'w', newline='', encoding='utf-8') as f:
        fields = [
            "registration_number", "department", "year", "section", "club",
            "degree", "degree_centrality", "betweenness_centrality", "closeness_centrality",
            "pagerank", "influence_score", "influence_rank", "community", "role", "network_status"
        ]
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for s in compiled_students:
            writer.writerow({k: s[k] for k in fields})

    print("Complete School of Computing 500-Student Dataset & SNA Bundle generated successfully!")

if __name__ == '__main__':
    generate_soc_dataset()
