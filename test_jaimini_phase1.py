import requests
import json

BASE_URL = "http://localhost:8000/api"
# Assuming we need a token, but for now let's try to hit the public endpoint or login first if needed.
# Actually /birth endpoint usually requires auth.
# Let's assume we can use the same pattern as previous tests or just login.

def test_jaimini_phase1():
    print("Testing Jaimini Phase 1 Implementation...")
    
    # 1. Login to get token
    login_payload = {
        "username": "testuser", # Assuming testuser exists from previous context or seed
        "password": "testpassword"
    }
    # If testuser doesn't exist, we might need to register. 
    # Let's try to register first, if fails then login.
    
    register_payload = {
        "email": "jaimini_test@example.com",
        "username": "jaimini_tester",
        "password": "password123",
        "full_name": "Jaimini Tester"
    }
    
    session = requests.Session()
    
    # Try Register
    try:
        reg_res = session.post(f"{BASE_URL}/auth/register", json=register_payload)
        if reg_res.status_code == 200:
            print("Registered new user.")
            token = reg_res.json()["access_token"]
        else:
            # Try Login
            print("User might exist, trying login...")
            login_res = session.post(f"{BASE_URL}/auth/login", data={
                "username": "jaimini_test@example.com", # Login usually takes email as username in OAuth2PasswordRequestForm
                "password": "password123"
            })
            if login_res.status_code == 200:
                print("Logged in successfully.")
                token = login_res.json()["access_token"]
            else:
                print(f"Login failed: {login_res.text}")
                return
    except Exception as e:
        print(f"Auth error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Call Birth Chart Endpoint
    payload = {
        "date": "15/08/1947",
        "time": "00:00",
        "timezone": "+05:30",
        "latitude": 28.61,
        "longitude": 77.20,
        "name": "India"
    }
    
    try:
        # Corrected endpoint from /calculations/birth to /chart/birth
        response = session.post(f"{BASE_URL}/chart/birth", json=payload, headers=headers)
        if response.status_code != 200:
            print(f"Error fetching chart: {response.status_code} - {response.text}")
            return
            
        data = response.json()
        
        # 3. Verify Jaimini Data
        jaimini = data.get("jaimini")
        if not jaimini:
            print("FAIL: No 'jaimini' key in response.")
            return
            
        print("\n--- Jaimini Data Verification ---")
        
        # Karakas
        karakas = jaimini.get("karakas")
        if karakas and "AK" in karakas:
            print(f"✅ Karakas present. Atmakaraka (AK): {karakas['AK']['name']}")
        else:
            print("❌ Karakas missing or incomplete.")
            
        # Karakamsa
        karakamsa = jaimini.get("karakamsa")
        if karakamsa and karakamsa.get("sign"):
            print(f"✅ Karakamsa present. Sign: {karakamsa['sign']} (Chart: {karakamsa.get('chart')})")
        else:
            print("❌ Karakamsa missing.")
            
        # Arudha Padas
        padas = jaimini.get("arudha_padas") # Updated key
        if padas and "AL" in padas and "UL" in padas:
            print(f"✅ Arudha Padas present. AL: {padas['AL']}, UL: {padas['UL']}")
        else:
            print(f"❌ Arudha Padas missing or incomplete. Keys: {padas.keys() if padas else 'None'}")
            
        # Chara Dasha
        dasha = jaimini.get("chara_dasha")
        if dasha and len(dasha) > 0:
            print(f"✅ Chara Dasha present. First period: {dasha[0]['sign_name']} ({dasha[0]['duration']} years)")
        else:
            print("❌ Chara Dasha missing.")
            
        # Aspects
        aspects = jaimini.get("aspects")
        if aspects:
             print(f"✅ Jaimini Aspects present.")
        else:
             print("❌ Jaimini Aspects missing.")

    except Exception as e:
        print(f"Test Execution Error: {e}")

if __name__ == "__main__":
    test_jaimini_phase1()
