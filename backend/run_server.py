"""Run the FastAPI server with better error handling."""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def safe_print(message: str):
    """Print message safely handling Unicode encoding issues on Windows."""
    try:
        print(message)
    except UnicodeEncodeError:
        # Fallback to ASCII-safe version
        safe_message = message.encode('ascii', 'replace').decode('ascii')
        print(safe_message)

def check_dependencies():
    """Check if required services are available."""
    import socket
    
    print("Checking dependencies...")
    
    # Check PostgreSQL
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', 5432))
        sock.close()
        if result == 0:
            safe_print("[OK] PostgreSQL is running on port 5432")
        else:
            safe_print("[WARN] PostgreSQL is NOT running on port 5432")
            print("  Start it with: docker-compose up -d postgres")
    except Exception as e:
        safe_print(f"[WARN] Could not check PostgreSQL: {e}")
    
    # Check Redis
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', 6379))
        sock.close()
        if result == 0:
            safe_print("[OK] Redis is running on port 6379")
        else:
            safe_print("[WARN] Redis is NOT running on port 6379")
            print("  Start it with: docker-compose up -d redis")
    except Exception as e:
        safe_print(f"[WARN] Could not check Redis: {e}")
    
    print()

if __name__ == "__main__":
    check_dependencies()
    
    try:
        import uvicorn
        print("Starting server on http://localhost:8000")
        print("API docs available at http://localhost:8000/docs")
        print("Press Ctrl+C to stop\n")
        
        uvicorn.run(
            "jansetu_platform.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except ImportError:
        print("[ERROR] uvicorn not installed. Run: pip install uvicorn[standard]")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Error starting server: {e}")
        sys.exit(1)
