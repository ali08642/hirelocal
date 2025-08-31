import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
api_key = os.getenv('GEMINI_API_KEY')
model = os.getenv('GEMINI_MODEL')
endpoint = os.getenv('GEMINI_ENDPOINT')

def test_gemini():
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': api_key
    }

    data = {
        "contents": [{
            "parts": [{
                "text": "Explain how AI works in a few words"
            }]
        }]
    }

    print(f"Using endpoint: {endpoint}")
    print(f"Using API key (first 4 chars): {api_key[:4]}")
    
    try:
        response = requests.post(
            endpoint,
            headers=headers,
            json=data
        )
        
        print(f"\nStatus code: {response.status_code}")
        if response.ok:
            print("\nResponse:")
            print(json.dumps(response.json(), indent=2))
        else:
            print("\nError response:")
            print(response.text)
            
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    test_gemini()
