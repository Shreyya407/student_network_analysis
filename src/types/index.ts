export type DepartmentName =
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Data Science'
  | 'Big Data Analytics'
  | 'CSE Core'
  | 'AI/ML'
  | 'Computer Networking';

export type ConnectivityCategory =
  | 'Completely Isolated'
  | 'Low Connectivity'
  | 'Moderately Connected'
  | 'Highly Connected';

export type NetworkPosition =
  | 'Isolated'
  | 'Influential'
  | 'Bridge'
  | 'Regular Connectivity';

export interface Student {
  registration_number: string;
  student_name: string;
  department: DepartmentName | string;
  academic_year: string;
  year_of_study: string;
  degree: number;
  degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality: number;
  pagerank: number;
  community: string;
  connectivity_category: ConnectivityCategory;
  network_position: NetworkPosition;
  neighbors_count: number;
  cross_community_connections: number;
  neighbor_departments: Record<string, number>;
  is_isolated: boolean;
  pagerank_rank?: number;
  degree_centrality_rank?: number;
  betweenness_rank?: number;
  neighbors_list?: Student[];
}

export interface KPIs {
  total_students: number;
  total_friendship_edges: number;
  detected_communities: number;
  isolated_students_count: number;
  low_connected_count: number;
  moderately_connected_count: number;
  highly_connected_count: number;
  average_degree: number;
  network_density: number;
  connected_components: number;
  modularity_score: number;
}

export interface ValidationCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
}

export interface ValidationReport {
  passed: boolean;
  total_students: number;
  unique_students: number;
  expected_students: number;
  total_edges: number;
  unique_edges: number;
  expected_edges: number;
  departments_found: Record<string, number>;
  expected_departments_count: number;
  students_per_department_target: number;
  errors: string[];
  warnings: string[];
  checks: ValidationCheck[];
}

export interface CommunityData {
  community_id: string;
  name: string;
  color: string;
  student_count: number;
  density: number;
  within_community_edges: number;
  external_edges: number;
  department_composition: Record<string, number>;
  top_influential: Student[];
  top_bridges: Student[];
  average_degree: number;
  students?: Student[];
}

export interface DepartmentData {
  department: string;
  student_count: number;
  color: string;
  internal_edges: number;
  external_edges: number;
  total_edges: number;
  average_degree: number;
  average_degree_centrality: number;
  average_betweenness_centrality: number;
  average_pagerank: number;
  connectivity_breakdown: Record<ConnectivityCategory, number>;
  community_breakdown: Record<string, number>;
}

export interface InsightItem {
  title: string;
  detail: string;
  category: string;
}

export interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: Record<string, any>;
}

export interface DashboardData {
  kpis: KPIs;
  insights: InsightItem[];
  degree_distribution: { degree: number; count: number }[];
  connectivity_summary: { category: ConnectivityCategory; count: number; percentage: number; color: string }[];
  top_influential: Student[];
  community_sizes: { community: string; students: number; color: string; density: number }[];
  department_comparison: {
    department: string;
    student_count: number;
    color: string;
    average_degree: number;
    internal_edges: number;
    external_edges: number;
  }[];
}

export type TabId =
  | 'overview'
  | 'network'
  | 'communities'
  | 'influential'
  | 'bridges'
  | 'isolated'
  | 'connectivity'
  | 'departments'
  | 'centrality'
  | 'data'
  | 'methodology';
