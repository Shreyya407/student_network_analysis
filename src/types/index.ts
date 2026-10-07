export type DepartmentName = 
  | 'CSE Core'
  | 'Big Data Analytics'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Information Technology'
  | 'Data Science'
  | 'AIML';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface Student {
  registration_number: string;
  department: DepartmentName;
  year: AcademicYear;
  degree: number;
  degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality: number;
  pagerank: number;
  influence_score: number;
  influence_rank: number;
  community_id: string;
  role: string;
  is_isolated: boolean;
  network_status: string;
}

export interface InteractionEdge {
  edge_id: string;
  registration_number_1: string;
  registration_number_2: string;
  interaction_count: number;
  interaction_type: string;
}

export interface CommunityStat {
  community_id: string;
  num_students: number;
  percentage: number;
  top_student: string;
  top_student_dept: string;
  top_student_score: number;
  avg_influence: number;
  avg_degree: number;
  dominant_department: string;
}

export interface DepartmentStat {
  department: string;
  students_count: number;
  isolated_count: number;
  average_degree: number;
  average_influence: number;
  interaction_volume: number;
}

export interface ClassStat {
  department: string;
  year: string;
  student_count: number;
  status: string;
  average_connections: number;
  most_connected: string;
  most_connected_deg: number;
  top_influence: string;
  top_influence_score: number;
  network_density: number;
  internal_edges: number;
}

export interface DeptYearRow {
  department: string;
  first_year: number;
  second_year: number;
  third_year: number;
  fourth_year: number;
  total: number;
}

export interface Metadata {
  title: string;
  total_students: number;
  total_connections: number;
  total_events: number;
  total_departments: number;
  total_classes: number;
  isolated_students_count: number;
  connected_students_count: number;
  communities_count: number;
  modularity: number;
  average_degree: number;
  network_density: number;
}

export interface SNABundle {
  metadata: Metadata;
  students: Student[];
  edges: InteractionEdge[];
  community_stats: CommunityStat[];
  department_stats: DepartmentStat[];
  department_matrix: Record<string, Record<string, number>>;
  class_stats: ClassStat[];
  dept_year_matrix: DeptYearRow[];
  isolated_students: Student[];
  low_connected_students: Student[];
}

export interface NetworkFilters {
  department: string;
  year: string;
  community: string;
}
