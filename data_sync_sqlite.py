#!/usr/bin/env python3
import urllib.request
import sqlite3
import csv
from datetime import datetime
import os

class SQLiteDataSync:
    def __init__(self, db_path="dashboard.db"):
        self.db_path = db_path
        self.tsv_url = os.getenv("GOOGLE_SHEETS_TSV_URL", "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5Qu2gRWD_hZX45QY1AyOK0Wl2QEKtR1yjMqQNWWUv7RuAPWwjLCsxsPSp7RcD0HU0tgeiXlwfRMB0/pub?gid=558973433&single=true&output=tsv")
        
    def create_database(self):
        """Create SQLite database and table"""
        print("Creating SQLite database...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Drop existing table if it exists
        cursor.execute("DROP TABLE IF EXISTS dashboard_data")
        
        # Create table with relevant columns based on your TSV structure
        cursor.execute("""
            CREATE TABLE dashboard_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT,
                order_date TEXT,
                payment_date TEXT,
                project_code TEXT,
                project_name TEXT,
                unit_no TEXT,
                house_number TEXT,
                unit_status TEXT,
                contact_name TEXT,
                contact_phone TEXT,
                product_type TEXT,
                product_group TEXT,
                product_detail TEXT,
                color TEXT,
                brand TEXT,
                product_size TEXT,
                room_type TEXT,
                install_point TEXT,
                install_size TEXT,
                supplier_name TEXT,
                po_number TEXT,
                po_date TEXT,
                install_confirm_date TEXT,
                install_time_slot TEXT,
                install_date TEXT,
                delivery_date TEXT,
                notes TEXT,
                document_status TEXT,
                install_status TEXT,
                cost_total_ex_vat REAL,
                cost_total_in_vat REAL,
                sale_total_ex_vat REAL,
                sale_total_in_vat REAL,
                items_group TEXT,
                sales_month INTEGER,
                sales_year INTEGER,
                building TEXT,
                floor_level TEXT,
                sync_timestamp TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
        print("Database created successfully!")
    
    def fetch_tsv_data(self):
        """Fetch TSV data from Google Sheets"""
        print("Fetching TSV data...")
        
        request = urllib.request.Request(
            self.tsv_url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read().decode('utf-8')
        
        lines = data.strip().split('\n')
        print(f"Fetched {len(lines)} lines from TSV")
        
        return lines
    
    def parse_and_insert_data(self, lines):
        """Parse TSV data and insert into SQLite"""
        print("Parsing and inserting data...")
        
        if len(lines) < 2:
            print("No data to insert")
            return
        
        # Parse header
        header = lines[0].split('\t')
        print(f"Found {len(header)} columns")
        
        # Connect to database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        inserted_count = 0
        sync_timestamp = datetime.now().isoformat()
        
        # Process each data row
        for i, line in enumerate(lines[1:], 1):
            try:
                row_data = line.split('\t')
                
                # Ensure we have enough columns
                while len(row_data) < len(header):
                    row_data.append('')
                
                # Map to database columns (based on Thai column names from TSV)
                # Column indices based on the TSV structure we saw
                insert_data = {
                    'order_number': row_data[0] if len(row_data) > 0 else '',
                    'order_date': row_data[1] if len(row_data) > 1 else '',
                    'payment_date': row_data[2] if len(row_data) > 2 else '',
                    'project_code': row_data[6] if len(row_data) > 6 else '',
                    'project_name': row_data[8] if len(row_data) > 8 else '',
                    'unit_no': row_data[9] if len(row_data) > 9 else '',
                    'house_number': row_data[10] if len(row_data) > 10 else '',
                    'unit_status': row_data[11] if len(row_data) > 11 else '',
                    'contact_name': row_data[13] if len(row_data) > 13 else '',
                    'contact_phone': row_data[14] if len(row_data) > 14 else '',
                    'product_type': row_data[18] if len(row_data) > 18 else '',
                    'product_group': row_data[19] if len(row_data) > 19 else '',
                    'product_detail': row_data[23] if len(row_data) > 23 else '',
                    'color': row_data[24] if len(row_data) > 24 else '',
                    'brand': row_data[25] if len(row_data) > 25 else '',
                    'product_size': row_data[26] if len(row_data) > 26 else '',
                    'room_type': row_data[27] if len(row_data) > 27 else '',
                    'install_point': row_data[28] if len(row_data) > 28 else '',
                    'install_size': row_data[29] if len(row_data) > 29 else '',
                    'supplier_name': row_data[35] if len(row_data) > 35 else '',
                    'po_number': row_data[36] if len(row_data) > 36 else '',
                    'po_date': row_data[37] if len(row_data) > 37 else '',
                    'install_confirm_date': row_data[41] if len(row_data) > 41 else '',
                    'install_time_slot': row_data[42] if len(row_data) > 42 else '',
                    'install_date': row_data[43] if len(row_data) > 43 else '',
                    'delivery_date': row_data[44] if len(row_data) > 44 else '',
                    'notes': row_data[45] if len(row_data) > 45 else '',
                    'document_status': row_data[46] if len(row_data) > 46 else '',
                    'install_status': row_data[47] if len(row_data) > 47 else '',
                    'items_group': row_data[22] if len(row_data) > 22 else '',
                    'sales_month': self.safe_int(row_data[53]) if len(row_data) > 53 else None,
                    'sales_year': self.safe_int(row_data[54]) if len(row_data) > 54 else None,
                    'building': row_data[55] if len(row_data) > 55 else '',
                    'floor_level': row_data[56].rstrip('\r\n') if len(row_data) > 56 else '',
                    'sync_timestamp': sync_timestamp
                }
                
                # Convert cost/sale values to float
                insert_data['cost_total_ex_vat'] = self.safe_float(row_data[48]) if len(row_data) > 48 else None
                insert_data['cost_total_in_vat'] = self.safe_float(row_data[49]) if len(row_data) > 49 else None
                insert_data['sale_total_ex_vat'] = self.safe_float(row_data[50]) if len(row_data) > 50 else None
                insert_data['sale_total_in_vat'] = self.safe_float(row_data[51]) if len(row_data) > 51 else None
                
                # Insert into database
                cursor.execute("""
                    INSERT INTO dashboard_data (
                        order_number, order_date, payment_date, project_code, project_name,
                        unit_no, house_number, unit_status, contact_name, contact_phone,
                        product_type, product_group, product_detail, color, brand,
                        product_size, room_type, install_point, install_size, supplier_name,
                        po_number, po_date, install_confirm_date, install_time_slot,
                        install_date, delivery_date, notes, document_status, install_status,
                        cost_total_ex_vat, cost_total_in_vat, sale_total_ex_vat, sale_total_in_vat,
                        items_group, sales_month, sales_year, building, floor_level, sync_timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    insert_data['order_number'], insert_data['order_date'], insert_data['payment_date'],
                    insert_data['project_code'], insert_data['project_name'], insert_data['unit_no'],
                    insert_data['house_number'], insert_data['unit_status'], insert_data['contact_name'],
                    insert_data['contact_phone'], insert_data['product_type'], insert_data['product_group'],
                    insert_data['product_detail'], insert_data['color'], insert_data['brand'],
                    insert_data['product_size'], insert_data['room_type'], insert_data['install_point'],
                    insert_data['install_size'], insert_data['supplier_name'], insert_data['po_number'],
                    insert_data['po_date'], insert_data['install_confirm_date'], insert_data['install_time_slot'],
                    insert_data['install_date'], insert_data['delivery_date'], insert_data['notes'],
                    insert_data['document_status'], insert_data['install_status'], insert_data['cost_total_ex_vat'],
                    insert_data['cost_total_in_vat'], insert_data['sale_total_ex_vat'], insert_data['sale_total_in_vat'],
                    insert_data['items_group'], insert_data['sales_month'], insert_data['sales_year'],
                    insert_data['building'], insert_data['floor_level'], insert_data['sync_timestamp']
                ))
                
                inserted_count += 1
                
                if inserted_count % 1000 == 0:
                    print(f"Inserted {inserted_count} rows...")
                    
            except Exception as e:
                print(f"Error processing row {i}: {e}")
                continue
        
        conn.commit()
        conn.close()
        print(f"Successfully inserted {inserted_count} rows into database")
        
    def safe_int(self, value):
        """Safely convert to int"""
        try:
            return int(float(str(value).replace(',', ''))) if value and str(value).strip() else None
        except (ValueError, TypeError):
            return None
    
    def safe_float(self, value):
        """Safely convert to float"""
        try:
            return float(str(value).replace(',', '')) if value and str(value).strip() else None
        except (ValueError, TypeError):
            return None
    
    def show_stats(self):
        """Show database statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM dashboard_data")
        total_rows = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT project_code) FROM dashboard_data WHERE project_code != ''")
        unique_projects = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT install_status) FROM dashboard_data WHERE install_status != ''")
        unique_statuses = cursor.fetchone()[0]
        
        cursor.execute("SELECT install_status, COUNT(*) FROM dashboard_data WHERE install_status != '' GROUP BY install_status ORDER BY COUNT(*) DESC LIMIT 5")
        top_statuses = cursor.fetchall()
        
        print(f"\n=== Database Statistics ===")
        print(f"Total records: {total_rows:,}")
        print(f"Unique projects: {unique_projects:,}")
        print(f"Unique install statuses: {unique_statuses}")
        print(f"\nTop install statuses:")
        for status, count in top_statuses:
            print(f"  {status}: {count:,}")
        
        conn.close()
    
    def run_sync(self):
        """Run the complete sync process"""
        start_time = datetime.now()
        print(f"Starting data sync at {start_time}")
        
        try:
            # Create database
            self.create_database()
            
            # Fetch TSV data
            lines = self.fetch_tsv_data()
            
            # Parse and insert data
            self.parse_and_insert_data(lines)
            
            # Show statistics
            self.show_stats()
            
            end_time = datetime.now()
            duration = end_time - start_time
            print(f"\nSync completed successfully in {duration}")
            
        except Exception as e:
            print(f"Sync failed: {e}")
            raise

if __name__ == "__main__":
    sync = SQLiteDataSync()
    sync.run_sync()