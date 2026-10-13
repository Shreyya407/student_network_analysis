import pandas as pd
import networkx as nx
from networkx.algorithms.community import louvain_communities, modularity

STUDENTS_FILE = "students_630.csv"
EDGES_FILE = "student_connections.csv"

students = pd.read_csv(STUDENTS_FILE)
edges = pd.read_csv(EDGES_FILE)

G = nx.Graph()
for row in students.itertuples(index=False):
    G.add_node(row.registration_number, name=row.student_name, department=row.department)

for row in edges.itertuples(index=False):
    G.add_edge(row.source_registration_number, row.target_registration_number)

degree = dict(G.degree())
active = [n for n in G.nodes if degree[n] > 0]
H = G.subgraph(active).copy()

# Louvain discovers communities from graph structure; no community labels are read from input.
communities = louvain_communities(H, seed=42, resolution=0.75)
communities = sorted(communities, key=lambda c: (-len(c), min(c)))
community_of = {node: f"Community {i}" for i, group in enumerate(communities, start=1) for node in group}

degree_c = nx.degree_centrality(G)
between_c = nx.betweenness_centrality(G, normalized=True)
close_c = nx.closeness_centrality(G)
pr = nx.pagerank(G)

result = students.copy()
result["degree"] = result.registration_number.map(degree)
result["degree_centrality"] = result.registration_number.map(degree_c)
result["betweenness_centrality"] = result.registration_number.map(between_c)
result["closeness_centrality"] = result.registration_number.map(close_c)
result["pagerank"] = result.registration_number.map(pr)
result["detected_community"] = result.registration_number.map(community_of).fillna("Isolated / no detected community")

result["network_position"] = "Regular connectivity"
result.loc[result.degree == 0, "network_position"] = "Isolated"
pr_cut = result.pagerank.quantile(0.95)
degree_cut = result.degree_centrality.quantile(0.95)
between_cut = result.betweenness_centrality.quantile(0.95)
result.loc[(result.pagerank >= pr_cut) | (result.degree_centrality >= degree_cut), "network_position"] = "Influential"
result.loc[(result.betweenness_centrality >= between_cut) & (result.degree > 0), "network_position"] = "Bridge"
result.loc[result.degree == 0, "network_position"] = "Isolated"

result.to_csv("sna_analysis_results.csv", index=False)
print(f"Students: {G.number_of_nodes()}")
print(f"Friendship edges: {G.number_of_edges()}")
print(f"Isolated students: {sum(degree[n] == 0 for n in G.nodes)}")
print(f"Louvain communities detected: {len(communities)}")
print(f"Modularity: {modularity(H, communities):.4f}" if H.number_of_edges() else "Modularity: N/A")
print("\\nCommunity sizes:")
for i, group in enumerate(communities, start=1):
    print(f"Community {i}: {len(group)} students")
print("\\nTop 10 PageRank students:")
print(result.sort_values("pagerank", ascending=False)[["registration_number","student_name","department","degree","pagerank"]].head(10).to_string(index=False))
