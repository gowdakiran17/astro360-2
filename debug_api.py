import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv("astro_app/backend/.env")

KEY = os.getenv("ASTROLOGY_API_IO_KEY")
BASE_URL = "https://api.astrology-api.io/api/v3"

async def main():
    print(f"Testing API with Key: {KEY[:5]}...")
    
    url = f"{BASE_URL}/insights/financial/market-timing"
    payload = {
        "day": 3,
        "month": 2,
        "year": 2026,
        "lat": 40.7128,
        "lon": -74.0060,
        "tzone": -5.0
    }
    
    headers = {"Authorization": f"Bearer {KEY}"}
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, json=payload, headers=headers)
            print("Status:", resp.status_code)
            print("Response:", resp.text)
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
