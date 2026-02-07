import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_solar_return():
    print("Testing Solar Return Implementation...")
    
    # 1. Login
    session = requests.Session()
    print("Logging in...")
    login_res = session.post(f"{BASE_URL}/auth/login", data={
        "username": "jaimini_test@example.com",
        "password": "password123"
    })
    
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        # Try registering if login fails
        reg_res = session.post(f"{BASE_URL}/auth/register", json={
            "email": "jaimini_test@example.com",
            "username": "jaimini_tester",
            "password": "password123",
            "full_name": "Jaimini Tester"
        })
        if reg_res.status_code == 200:
             # Login again
            login_res = session.post(f"{BASE_URL}/auth/login", data={
                "username": "jaimini_test@example.com",
                "password": "password123"
            })
        else:
            print("Registration failed too. Ensure user exists.")
            return

    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Call Solar Return Endpoint
    current_year = datetime.now().year
    target_year = current_year + 1
    
    payload = {
        "birth_details": {
            "date": "15/08/1947",
            "time": "00:00",
            "timezone": "+05:30",
            "latitude": 28.61,
            "longitude": 77.20,
            "name": "India"
        },
        "target_year": target_year
    }
    
    print(f"Requesting Solar Return for {target_year}...")
    try:
        response = session.post(f"{BASE_URL}/chart/solar-return", json=payload, headers=headers)
        
        if response.status_code != 200:
            print(f"Error fetching solar return: {response.status_code}")
            print(response.text)
            return
            
        data = response.json()
        
        # 3. Verify Data
        print("\n--- Solar Return Data Verification ---")
        
        # Check basic fields
        if data.get("year") == target_year:
            print(f"✅ Year matches: {data['year']}")
        else:
            print(f"❌ Year mismatch. Expected {target_year}, got {data.get('year')}")
            
        if "return_date" in data and "return_time" in data:
            print(f"✅ Return Time calculated: {data['return_date']} at {data['return_time']}")
        else:
            print("❌ Return Time missing.")
            
        # Check Chart
        chart = data.get("tajaka_chart")
        if chart and "planets" in chart:
            sun = next((p for p in chart["planets"] if p["name"] == "Sun"), None)
            if sun:
                print(f"✅ Tajaka Chart present. Sun Longitude: {sun['longitude']}")
            else:
                print("❌ Sun missing in Tajaka Chart.")
        else:
            print("❌ Tajaka Chart missing.")
            
        # Check Muntha
        muntha = data.get("muntha")
        if muntha:
            print(f"✅ Muntha present: {muntha}")
        else:
            print("❌ Muntha missing.")
            
        # Check Year Lord
        year_lord = data.get("year_lord")
        if year_lord:
            print(f"✅ Year Lord selected: {year_lord}")
        else:
            print("❌ Year Lord missing.")
            
        # Check Pancha Adhikaris
        adhikaris = data.get("pancha_adhikaris")
        if adhikaris:
            print(f"✅ Pancha Adhikaris present: {adhikaris}")
        else:
            print("❌ Pancha Adhikaris missing.")

    except Exception as e:
        print(f"Test failed with exception: {e}")

if __name__ == "__main__":
    test_solar_return()
