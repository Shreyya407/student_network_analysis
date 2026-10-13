"""
CampusConnect - College Social Network Intelligence Platform
FastAPI Backend Application
"""

import io
import csv
import math
from typing import Optional, Dict, Any, List

# Explicitly import anyio.to_thread to prevent lazy-loading issues on Python 3.15
import anyio
import anyio.to_thread

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend.graph_engine import engine

app = FastAPI(
    title="CampusConnect API",
    description="Social Network Analysis & Graph Intelligence Platform for Higher Education",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "CampusConnect Network Intelligence API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "nodes": engine.G.number_of_nodes(),
        "edges": engine.G.number_of_edges()
    }


@app.get("/api/health")
async def get_health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "CampusConnect Network Intelligence API",
        "nodes": engine.G.number_of_nodes(),
        "edges": engine.G.number_of_edges(),
        "communities": engine.analysis_results["kpis"]["detected_communities"]
    }


@app.get("/api/dataset/summary")
async def get_dataset_summary():
    """Dataset summary and key parameters."""
    return engine.get_summary()


@app.get("/api/dataset/validation")
async def get_dataset_validation():
    """Detailed dataset validation report with all checks and integrity tests."""
    return engine.validation_report


@app.get("/api/dashboard")
async def get_dashboard():
    """Overview dashboard analytics bundle."""
    res = engine.analysis_results
    return {
        "kpis": res["kpis"],
        "insights": res["insights"],
        "degree_distribution": res["degree_distribution"],
        "connectivity_summary": res["connectivity_summary"],
        "top_influential": res["top_influential"][:5],
        "community_sizes": [
            {
                "community": comm_id,
                "students": data["student_count"],
                "color": data["color"],
                "density": data["density"]
            }
            for comm_id, data in res["community_analytics"].items()
        ],
        "department_comparison": [
            {
                "department": d,
                "student_count": data["student_count"],
                "color": data["color"],
                "average_degree": data["average_degree"],
                "internal_edges": data["internal_edges"],
                "external_edges": data["external_edges"]
            }
            for d, data in res["department_analytics"].items()
        ]
    }


@app.get("/api/network")
async def get_network(
    department: Optional[str] = None,
    community: Optional[str] = None,
    connectivity: Optional[str] = None,
    min_degree: Optional[int] = 0,
    max_degree: Optional[int] = 100,
    search: Optional[str] = None
):
    """
    Get Cytoscape.js network graph elements with optional filtering.
    """
    students = engine.analysis_results["students"]
    
    # Filter matching node IDs
    matching_nodes = set()
    for s in students:
        if department and department != "all" and s["department"] != department:
            continue
        if community and community != "all" and s["community"] != community:
            continue
        if connectivity and connectivity != "all" and s["connectivity_category"] != connectivity:
            continue
        if min_degree is not None and s["degree"] < min_degree:
            continue
        if max_degree is not None and s["degree"] > max_degree:
            continue
        if search:
            q = search.lower()
            if q not in s["student_name"].lower() and q not in s["registration_number"].lower() and q not in s["department"].lower():
                continue
        matching_nodes.add(s["registration_number"])

    elements = []
    # Add filtered nodes and incident edges
    for el in engine.analysis_results["cytoscape_elements"]:
        if el["group"] == "nodes":
            if el["data"]["id"] in matching_nodes:
                elements.append(el)
        elif el["group"] == "edges":
            src = el["data"]["source"]
            tgt = el["data"]["target"]
            if src in matching_nodes and tgt in matching_nodes:
                elements.append(el)

    return {
        "elements": elements,
        "total_nodes": len(matching_nodes),
        "total_edges": sum(1 for e in elements if e["group"] == "edges"),
        "full_graph_nodes": engine.G.number_of_nodes(),
        "full_graph_edges": engine.G.number_of_edges(),
    }


@app.get("/api/communities")
async def get_communities():
    """Get all detected communities and cross-community matrices."""
    res = engine.analysis_results
    return {
        "communities": list(res["community_analytics"].values()),
        "modularity": res["kpis"]["modularity_score"],
        "detected_count": res["kpis"]["detected_communities"],
        "community_matrix": res["community_matrix"],
    }


@app.get("/api/communities/{community_id}")
async def get_community_detail(community_id: str):
    """Get detailed statistics and student roster for a single community."""
    comm_data = engine.analysis_results["community_analytics"].get(community_id)
    if not comm_data:
        raise HTTPException(status_code=404, detail="Community not found")
        
    students = [
        s for s in engine.analysis_results["students"]
        if s["community"] == community_id
    ]
    return {
        **comm_data,
        "students": students
    }


@app.get("/api/students")
async def get_students(
    search: Optional[str] = None,
    department: Optional[str] = None,
    community: Optional[str] = None,
    connectivity: Optional[str] = None,
    sort_by: Optional[str] = "pagerank",
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200)
):
    """Search, filter, sort, and paginate students."""
    all_students = engine.analysis_results["students"]
    
    # Filter
    filtered = all_students
    if search:
        q = search.lower()
        filtered = [
            s for s in filtered
            if q in s["student_name"].lower() or q in s["registration_number"].lower() or q in s["department"].lower()
        ]
    if department and department != "all":
        filtered = [s for s in filtered if s["department"] == department]
    if community and community != "all":
        filtered = [s for s in filtered if s["community"] == community]
    if connectivity and connectivity != "all":
        filtered = [s for s in filtered if s["connectivity_category"] == connectivity]

    # Sort
    reverse = (order.lower() == "desc")
    valid_sort_keys = ["pagerank", "degree", "degree_centrality", "betweenness_centrality", "closeness_centrality", "student_name", "registration_number", "department"]
    key = sort_by if sort_by in valid_sort_keys else "pagerank"
    
    filtered = sorted(filtered, key=lambda x: x.get(key, 0) if isinstance(x.get(key), (int, float)) else str(x.get(key, "")), reverse=reverse)

    total_records = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_items = filtered[start_idx:end_idx]

    return {
        "items": page_items,
        "total": total_records,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total_records / page_size) if page_size else 1
    }


@app.get("/api/students/{registration_number}")
async def get_student(registration_number: str):
    """Get single student details with direct neighbors and departmental breakdown."""
    student = engine.get_student(registration_number)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/api/centrality")
async def get_centrality_comparison():
    """Compare centrality distributions, correlations, and rankings."""
    students = engine.analysis_results["students"]
    top_degree = sorted(students, key=lambda s: s["degree"], reverse=True)[:10]
    top_pr = sorted(students, key=lambda s: s["pagerank"], reverse=True)[:10]
    top_between = sorted(students, key=lambda s: s["betweenness_centrality"], reverse=True)[:10]
    top_close = sorted(students, key=lambda s: s["closeness_centrality"], reverse=True)[:10]
    
    return {
        "top_by_degree": top_degree,
        "top_by_pagerank": top_pr,
        "top_by_betweenness": top_between,
        "top_by_closeness": top_close,
        "scatter_data": [
            {
                "registration_number": s["registration_number"],
                "student_name": s["student_name"],
                "department": s["department"],
                "degree": s["degree"],
                "pagerank": s["pagerank"],
                "betweenness": s["betweenness_centrality"],
                "closeness": s["closeness_centrality"],
                "connectivity": s["connectivity_category"]
            }
            for s in students
        ]
    }


@app.get("/api/influential")
async def get_influential_students(limit: int = 50):
    """Get structurally influential students ranked by PageRank or Degree Centrality."""
    students = engine.analysis_results["top_influential"]
    return {
        "students": students[:limit],
        "cutoff_percentile": engine.analysis_results["parameters"]["influence_cutoff_percentile"],
        "total_influential_detected": sum(1 for s in engine.analysis_results["students"] if s["network_position"] == "Influential")
    }


@app.get("/api/bridges")
async def get_bridge_students(limit: int = 50):
    """Get top bridge students ranked by betweenness centrality."""
    students = engine.analysis_results["top_bridges"]
    return {
        "students": students[:limit],
        "cutoff_percentile": engine.analysis_results["parameters"]["bridge_cutoff_percentile"],
        "total_bridges_detected": sum(1 for s in engine.analysis_results["students"] if s["network_position"] == "Bridge")
    }


@app.get("/api/isolated")
async def get_isolated_students():
    """Get completely isolated students (degree zero)."""
    isolated = engine.analysis_results["isolated_students"]
    dept_distribution: Dict[str, int] = {}
    for s in isolated:
        dept_distribution[s["department"]] = dept_distribution.get(s["department"], 0) + 1
        
    return {
        "total_isolated": len(isolated),
        "percentage": round(len(isolated) / engine.G.number_of_nodes() * 100, 2),
        "department_distribution": dept_distribution,
        "students": isolated
    }


@app.get("/api/connectivity")
async def get_connectivity_analysis():
    """Get 4-level connectivity classification dashboard."""
    res = engine.analysis_results
    return {
        "summary": res["connectivity_summary"],
        "thresholds": res["parameters"]["connectivity_thresholds"],
        "degree_distribution": res["degree_distribution"],
        "departments": list(res["department_analytics"].values()),
        "total_students": res["kpis"]["total_students"]
    }


@app.get("/api/departments")
async def get_department_analytics():
    """Get department comparison analytics and cross-department matrix."""
    res = engine.analysis_results
    return {
        "departments": list(res["department_analytics"].values()),
        "matrix": res["department_matrix"],
    }


@app.post("/api/analyze")
async def reanalyze(
    resolution: float = Form(0.75),
    seed: int = Form(42)
):
    """Trigger re-analysis with modified Louvain resolution or seed."""
    try:
        results = engine.load_and_analyze(resolution=resolution, seed=seed)
        return {
            "status": "success",
            "message": f"Network reanalyzed with resolution={resolution}, seed={seed}",
            "kpis": results["kpis"],
            "parameters": results["parameters"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/dataset/upload")
async def upload_dataset(
    students_file: UploadFile = File(...),
    connections_file: UploadFile = File(...)
):
    """Upload replacement dataset CSVs, validate schema and integrity, and rerun analysis."""
    try:
        students_content = await students_file.read()
        connections_content = await connections_file.read()

        # Parse CSVs in memory
        students_rows = []
        students_reader = csv.DictReader(io.StringIO(students_content.decode("utf-8")))
        for row in students_reader:
            students_rows.append({k.strip(): v.strip() for k, v in row.items()})

        connections_rows = []
        connections_reader = csv.DictReader(io.StringIO(connections_content.decode("utf-8")))
        for row in connections_reader:
            connections_rows.append({k.strip(): v.strip() for k, v in row.items()})

        # Validate
        val = engine.validate_dataset(students_rows, connections_rows)
        if not val["passed"]:
            return {
                "status": "error",
                "message": "Dataset validation failed. Please correct errors and try again.",
                "validation": val
            }

        # Write to active data directory
        with open("data/students_630.csv", "wb") as f:
            f.write(students_content)
        with open("data/student_connections.csv", "wb") as f:
            f.write(connections_content)

        # Rerun analysis
        engine.load_and_analyze(resolution=engine.resolution, seed=engine.seed)

        return {
            "status": "success",
            "message": "Dataset uploaded and analyzed successfully.",
            "kpis": engine.analysis_results["kpis"],
            "validation": engine.validation_report
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded files: {str(e)}")


@app.get("/api/export/{export_type}")
async def export_csv(export_type: str):
    """Export current analysis tables as downloadable CSV files."""
    output = io.StringIO()

    if export_type == "students":
        fieldnames = ["registration_number", "student_name", "department", "degree", "degree_centrality", "betweenness_centrality", "closeness_centrality", "pagerank", "community", "connectivity_category", "network_position"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for s in engine.analysis_results["students"]:
            writer.writerow(s)
        filename = "campusconnect_students_analysis.csv"

    elif export_type == "isolated":
        fieldnames = ["registration_number", "student_name", "department", "degree", "connectivity_category", "network_position"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for s in engine.analysis_results["isolated_students"]:
            writer.writerow(s)
        filename = "campusconnect_isolated_students.csv"

    elif export_type == "bridges":
        fieldnames = ["registration_number", "student_name", "department", "degree", "betweenness_centrality", "betweenness_rank", "community", "cross_community_connections"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for s in engine.analysis_results["top_bridges"]:
            writer.writerow(s)
        filename = "campusconnect_bridge_students.csv"

    elif export_type == "influential":
        fieldnames = ["registration_number", "student_name", "department", "degree", "pagerank", "pagerank_rank", "degree_centrality", "degree_centrality_rank", "community"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for s in engine.analysis_results["top_influential"]:
            writer.writerow(s)
        filename = "campusconnect_influential_students.csv"

    elif export_type == "departments":
        fieldnames = ["department", "student_count", "internal_edges", "external_edges", "average_degree", "average_pagerank", "average_betweenness_centrality"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for d in engine.analysis_results["department_analytics"].values():
            writer.writerow(d)
        filename = "campusconnect_department_summary.csv"

    elif export_type == "communities":
        fieldnames = ["community_id", "student_count", "density", "within_community_edges", "external_edges", "average_degree"]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for c in engine.analysis_results["community_analytics"].values():
            writer.writerow(c)
        filename = "campusconnect_communities_summary.csv"

    else:
        raise HTTPException(status_code=400, detail=f"Unknown export type: {export_type}")

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
