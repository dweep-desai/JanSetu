"""Quick test script to verify backend is working."""
import httpx
import asyncio

BASE_URL = "http://localhost:8000"

async def test_backend():
    """Test backend endpoints."""
    print("Testing JanSetu Backend...")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        # Test 1: Health check
        print("\n1. Testing health endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                print(f"   [OK] Health check passed: {response.json()}")
            else:
                print(f"   [FAIL] Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"   [FAIL] Error: {e}")
            return False
        
        # Test 2: Root endpoint
        print("\n2. Testing root endpoint...")
        try:
            response = await client.get(f"{BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                print(f"   [OK] Root endpoint works: {data.get('message')}")
            else:
                print(f"   [FAIL] Root endpoint failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"   [FAIL] Error: {e}")
            return False
        
        # Test 3: Login endpoint
        print("\n3. Testing login endpoint...")
        try:
            response = await client.post(
                f"{BASE_URL}/auth/login",
                json={"phone": "1234567890"}
            )
            if response.status_code == 200:
                data = response.json()
                print(f"   [OK] Login endpoint works!")
                print(f"   [OK] OTP ID: {data.get('otp_id')}")
                print(f"   [OK] Message: {data.get('message')}")
                print(f"\n   [INFO] IMPORTANT: Check the backend terminal for the OTP code!")
                print(f"   [INFO] It should print: 'OTP for 1234567890: XXXXXX'")
            else:
                print(f"   [FAIL] Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"   [FAIL] Error: {e}")
            return False
        
        # Test 4: API docs
        print("\n4. Testing API documentation...")
        try:
            response = await client.get(f"{BASE_URL}/docs")
            if response.status_code == 200:
                print(f"   [OK] API docs available at: {BASE_URL}/docs")
            else:
                print(f"   [WARN] API docs returned: {response.status_code}")
        except Exception as e:
            print(f"   [WARN] Could not check docs: {e}")
    
    print("\n" + "=" * 50)
    print("[SUCCESS] Backend is working! You can now:")
    print("   1. Open http://localhost:8000/docs in your browser")
    print("   2. Try logging in from the frontend")
    print("   3. Check backend terminal for OTP codes")
    return True

if __name__ == "__main__":
    asyncio.run(test_backend())
