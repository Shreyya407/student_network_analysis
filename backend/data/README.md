# College Social Network Analysis — Synthetic Dataset

## Dataset size
- Students: 630 (90 per each of 7 registration-prefix groups)
- Friendship edges: 4,020
- Isolated nodes detected by degree: 6
- Communities detected by Louvain on non-isolated nodes: 4
- Modularity: 0.6784

## Registration-number construction
Each department uses the first 11 characters of the corresponding registration-number example supplied by the user, followed by a four-digit serial from `0001` through `0090` with no missing values. This produces 15-character IDs.

## Department mapping
- `RA231102801` — Cloud Computing
- `RA231103001` — Cybersecurity
- `RA231105601` — Data Science
- `RA231102701` — Big Data Analytics
- `RA231100301` — CSE Core
- `RA231102601` — AI/ML
- `RA231102901` — Computer Networking

## Files
- `students_630.csv`: student attributes only; no influence, isolation, or community labels.
- `student_connections.csv`: undirected friendship edge list; no preassigned social labels.
- `sna_analysis_results.csv`: outputs calculated after running graph analysis.
- `sna_analysis.py`: reproducible analysis script using NetworkX and Louvain community detection.
- `dataset_summary.json`: summary statistics from the generated graph.

## Methodology
The synthetic graph is generated with four latent social circles mixed across departments. Those latent generation assignments are not exported to the input dataset. Friendship edges are sampled probabilistically, with higher within-circle probability and occasional cross-circle links. A small set of students receives no edges to test graph-based isolation detection; no isolation label is stored in the input data. Louvain runs on the graph derived from the edge list, excluding degree-zero nodes so isolated students do not become artificial singleton communities.

## Labeling clarification
The input student and connection CSV files contain no preassigned social outcome labels such as isolated, influential, bridge, normal, or community membership. Department is an ordinary student attribute, not a social outcome label. The analysis output file contains algorithm-derived results only.

## Important interpretation
The four social circles are a design goal, not labels given to the algorithm. Louvain's detected community count and modularity are calculated from the graph. Influence is structural, not a judgement of personal worth or real-world leadership. The data is fictional and should not be used to make claims about real students.
