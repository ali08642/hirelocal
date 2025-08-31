import json
from config import client

# --- Step 1: Take user input ---
service = input("What service do you want? (e.g., plumber, electrician): ")
location = input("Where do you want it? (e.g., Lahore, Bahria Town Karachi): ")
count = input("How many specialists do you want? (e.g., 3): ")

# --- Step 2: Build prompt ---
query = f"""
Find the top {count} "{service}" specialists in "{location}".
If exact matches are not found, expand outward to the nearest areas and add a field "location_note": "NEARBY".
If information is sparse, still include it but mark with "confidence": "LOW".
Return ONLY valid JSON in this format:

[
  {{
    "name": "...",
    "phone": "...",
    "details": "...",
    "address": "...",
    "location_note": "EXACT or NEARBY",
    "confidence": "HIGH or LOW"
  }}
]
No extra commentary, only JSON.
"""

# --- Step 3: Call Responses API with Web Search ---
response = client.responses.create(
    model="gpt-4o",
    input=query,
    tools=[{"type": "web_search"}]
)

# --- Step 4: Parse and pretty print main output ---
try:
    data = json.loads(response.output_text)
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception:
    print("Raw output:", response.output_text)

# --- Step 5: Tokens + Cost in JSON ---
usage = response.usage
input_tokens = usage.input_tokens
output_tokens = usage.output_tokens
total_tokens = input_tokens + output_tokens

# Pricing for gpt-4o
input_cost_per_1k = 0.005
output_cost_per_1k = 0.015

cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)

usage_report = {
    "model": response.model,
    "input_tokens": input_tokens,
    "output_tokens": output_tokens,
    "total_tokens": total_tokens,
    "estimated_cost_usd": round(cost, 6)
}

print("\n--- Usage Report ---")
print(json.dumps(usage_report, indent=2, ensure_ascii=False))
