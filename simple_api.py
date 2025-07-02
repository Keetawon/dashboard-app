#!/usr/bin/env python3
import sqlite3
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import datetime

class DashboardAPI(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.db_path = "dashboard.db"
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query_params = parse_qs(parsed_url.query)
        
        try:
            # Route validation
            valid_endpoints = ['/api/stats', '/api/data', '/api/projects', '/api/status']
            if path not in valid_endpoints:
                self.send_error_response(404, "Endpoint not found", {
                    "available_endpoints": valid_endpoints
                })
                return
            
            # Enable CORS
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            if path == '/api/stats':
                response = self.get_stats()
            elif path == '/api/data':
                response = self.get_data(query_params)
            elif path == '/api/projects':
                response = self.get_projects()
            elif path == '/api/status':
                response = self.get_status_summary()
            
            self.wfile.write(json.dumps(response, ensure_ascii=False, indent=2).encode('utf-8'))
            
        except Exception as e:
            self.send_error_response(500, "Internal server error", {"details": str(e)})
    
    def send_error_response(self, status_code, message, extra_data=None):
        """Send structured error response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {"error": message}
        if extra_data:
            error_response.update(extra_data)
        
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_stats(self):
        """Get database statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        stats = {}
        
        # Total records
        cursor.execute("SELECT COUNT(*) FROM dashboard_data")
        stats['total_records'] = cursor.fetchone()[0]
        
        # Unique projects
        cursor.execute("SELECT COUNT(DISTINCT project_code) FROM dashboard_data WHERE project_code != ''")
        stats['unique_projects'] = cursor.fetchone()[0]
        
        # Install status breakdown
        cursor.execute("SELECT install_status, COUNT(*) FROM dashboard_data WHERE install_status != '' GROUP BY install_status ORDER BY COUNT(*) DESC")
        stats['install_status_breakdown'] = dict(cursor.fetchall())
        
        # Monthly breakdown
        cursor.execute("SELECT sales_year, sales_month, COUNT(*) FROM dashboard_data WHERE sales_year IS NOT NULL AND sales_month IS NOT NULL GROUP BY sales_year, sales_month ORDER BY sales_year DESC, sales_month DESC LIMIT 12")
        monthly_data = cursor.fetchall()
        stats['monthly_breakdown'] = [{"year": year, "month": month, "count": count} for year, month, count in monthly_data]
        
        # Top brands
        cursor.execute("SELECT brand, COUNT(*) FROM dashboard_data WHERE brand != '' GROUP BY brand ORDER BY COUNT(*) DESC LIMIT 10")
        stats['top_brands'] = dict(cursor.fetchall())
        
        conn.close()
        return stats
    
    def get_data(self, query_params):
        """Get filtered data"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        cursor = conn.cursor()
        
        # Build query with filters
        where_conditions = []
        params = []
        
        if 'project_code' in query_params:
            project_code = query_params['project_code'][0].strip()
            if project_code:
                where_conditions.append("project_code = ?")
                params.append(project_code)
        
        if 'install_status' in query_params:
            install_status = query_params['install_status'][0].strip()
            if install_status:
                where_conditions.append("install_status = ?")
                params.append(install_status)
        
        if 'brand' in query_params:
            brand = query_params['brand'][0].strip()
            if brand:
                where_conditions.append("brand = ?")
                params.append(brand)
        
        # Pagination with validation
        try:
            limit = min(int(query_params.get('limit', [100])[0]), 1000)  # Max 1000 records
            offset = max(int(query_params.get('offset', [0])[0]), 0)    # Min 0
        except (ValueError, IndexError):
            limit = 100
            offset = 0
        
        # Build final query
        base_query = """
            SELECT order_number, order_date, project_code, project_name, unit_no, house_number,
                   contact_name, contact_phone, product_detail, brand, product_size,
                   install_date, install_status, document_status, building, floor_level,
                   items_group, room_type, install_point, color, sync_timestamp
            FROM dashboard_data
        """
        
        if where_conditions:
            base_query += " WHERE " + " AND ".join(where_conditions)
        
        base_query += " ORDER BY order_date DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(base_query, params)
        rows = cursor.fetchall()
        
        # Convert to list of dictionaries
        data = []
        for row in rows:
            data.append({
                "order_number": row["order_number"],
                "order_date": row["order_date"],
                "project_code": row["project_code"],
                "project_name": row["project_name"],
                "unit_no": row["unit_no"],
                "house_number": row["house_number"],
                "contact_name": row["contact_name"],
                "contact_phone": row["contact_phone"],
                "product_detail": row["product_detail"],
                "brand": row["brand"],
                "product_size": row["product_size"],
                "install_date": row["install_date"],
                "install_status": row["install_status"],
                "document_status": row["document_status"],
                "building": row["building"],
                "floor_level": row["floor_level"],
                "items_group": row["items_group"],
                "room_type": row["room_type"],
                "install_point": row["install_point"],
                "color": row["color"],
                "sync_timestamp": row["sync_timestamp"]
            })
        
        conn.close()
        return {
            "data": data,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "returned_count": len(data)
            }
        }
    
    def get_projects(self):
        """Get list of projects"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT project_code, project_name, COUNT(*) as record_count,
                   MAX(install_date) as latest_install
            FROM dashboard_data 
            WHERE project_code != '' 
            GROUP BY project_code, project_name 
            ORDER BY record_count DESC
        """)
        
        projects = []
        for row in cursor.fetchall():
            projects.append({
                "project_code": row[0],
                "project_name": row[1],
                "record_count": row[2],
                "latest_install": row[3]
            })
        
        conn.close()
        return {"projects": projects}
    
    def get_status_summary(self):
        """Get installation status summary"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT install_status, COUNT(*) as count,
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM dashboard_data), 2) as percentage
            FROM dashboard_data 
            WHERE install_status != ''
            GROUP BY install_status 
            ORDER BY count DESC
        """)
        
        status_summary = []
        for row in cursor.fetchall():
            status_summary.append({
                "status": row[0],
                "count": row[1],
                "percentage": row[2]
            })
        
        conn.close()
        return {"status_summary": status_summary}

def run_server(port=3001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, DashboardAPI)
    print(f"Dashboard API server running on http://localhost:{port}")
    print("Available endpoints:")
    print("  GET /api/stats - Database statistics")
    print("  GET /api/data - Get filtered data (supports ?project_code=, ?install_status=, ?brand=, ?limit=, ?offset=)")
    print("  GET /api/projects - List all projects")
    print("  GET /api/status - Installation status summary")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()

if __name__ == "__main__":
    run_server()