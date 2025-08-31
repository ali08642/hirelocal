from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import re
import requests
import traceback
from dotenv import load_dotenv
from routes.auth_routes import router as auth_router
from config import client

# Load environment variables
load_dotenv(override=True)

app = FastAPI(title="ServiceGPT API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add security headers middleware
from middleware.security import SecurityHeadersMiddleware
app.add_middleware(SecurityHeadersMiddleware)

# Mount auth routes
app.include_router(auth_router, prefix="/api")

# Model Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '').strip()
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash').strip()
GEMINI_ENDPOINT = os.getenv('GEMINI_ENDPOINT', '').strip()

if not GEMINI_ENDPOINT and GEMINI_MODEL:
    GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

# Print configuration
print(f"[CONFIG] OpenAI API KEY present: {bool(client.api_key)}")
print(f"[CONFIG] Gemini Fallback Configuration:")
print(f"[CONFIG] - GEMINI_MODEL: {GEMINI_MODEL}")
print(f"[CONFIG] - GEMINI_ENDPOINT: {GEMINI_ENDPOINT}")
print(f"[CONFIG] - GEMINI_API_KEY present: {bool(GEMINI_API_KEY)}")
if GEMINI_API_KEY:
    print(f"[CONFIG] - GEMINI_API_KEY preview: {GEMINI_API_KEY[:4]}...{GEMINI_API_KEY[-4:]}")

def _get_response_text(resp):
    """Extract text content from model response."""
    try:
        text = getattr(resp, 'output_text', None)
        if text:
            return text
            
        out = getattr(resp, 'output', None)
        if isinstance(out, list) and len(out) > 0:
            first = out[0]
            if isinstance(first, dict):
                content = first.get('content')
                if isinstance(content, list) and len(content) > 0 and isinstance(content[0], dict):
                    return content[0].get('text') or content[0].get('content') or json.dumps(content)
                return first.get('text') or json.dumps(first)
                
        return str(resp)
    except Exception:
        return ''

def _get_usage_info(resp):
    """Extract usage information from model response."""
    try:
        u = getattr(resp, 'usage', None)
        if u is None and isinstance(resp, dict):
            u = resp.get('usage')
        if not u:
            return {}

        def _g(o, *names):
            for n in names:
                if isinstance(o, dict) and n in o:
                    return o[n]
                if hasattr(o, n):
                    return getattr(o, n)
            return 0

        input_tokens = _g(u, 'input_tokens', 'prompt_tokens') or 0
        output_tokens = _g(u, 'output_tokens', 'completion_tokens') or 0
        total_tokens = (input_tokens or 0) + (output_tokens or 0)
        
        return {
            'model': getattr(resp, 'model', None) or (resp.get('model') if isinstance(resp, dict) else None),
            'input_tokens': input_tokens,
            'output_tokens': output_tokens,
            'total_tokens': total_tokens
        }
    except Exception:
        return {}

def _normalize_provider(provider):
    """Normalize a provider object with consistent fields and formats."""
    if not isinstance(provider, dict) or not provider.get('name'):
        return None
        
    # Normalize phone format
    phone = provider.get('phone', '')
    if not re.match(r'\d{3}-\d{3}-\d{4}', str(phone)):
        digits = re.findall(r'\d', str(phone))
        phone = 'XXX-XXX-XXXX' if len(digits) < 10 else f"{digits[:3]}-{digits[3:6]}-{digits[6:10]}"
    
    return {
        'name': str(provider.get('name', '')).strip(),
        'phone': phone,
        'details': str(provider.get('details', 'No details available')).strip(),
        'address': str(provider.get('address', 'Address not provided')).strip(),
        'location_note': str(provider.get('location_note', 'NEARBY')).upper(),
        'confidence': str(provider.get('confidence', 'LOW')).upper()
    }

def _invoke_model(model_name: str, input_text: str, use_search_tools: bool = False):
    """Invoke model with OpenAI->Gemini fallback."""
    if not input_text:
        raise ValueError("Empty input text")
        
    print(f"\n[DEBUG] Invoking model:")
    print(f"[DEBUG] - model_name: {model_name}")
    print(f"[DEBUG] - input_text: {input_text[:200]}...")
    print(f"[DEBUG] - use_search_tools: {use_search_tools}")

    # The prompt is now passed in via input_text parameter
    provider_prompt = input_text

    # Try OpenAI first
    try:
        print("[DEBUG] Attempting OpenAI API call...")
        response = client.responses.create(
            model=model_name,
            input=provider_prompt,
            tools=[{"type": "web_search"}] if use_search_tools else None
        )
        print("[DEBUG] OpenAI API call successful")
        return response
    except Exception as e:
        print(f"[WARNING] OpenAI API call failed: {str(e)}. Falling back to Gemini...")

        # Gemini fallback
    if not GEMINI_ENDPOINT or not GEMINI_API_KEY:
        raise RuntimeError('Gemini fallback failed: GEMINI_ENDPOINT or GEMINI_API_KEY not configured in .env')

    try:
        print(f"\n[GEMINI] Starting Gemini API call...")
        print(f"[GEMINI] Using endpoint: {GEMINI_ENDPOINT}")
        print(f"[GEMINI] Using model: {GEMINI_MODEL}")
        print(f"[GEMINI] Input prompt: {provider_prompt[:200]}...")

        # Use same prompt for Gemini
        gemini_text = provider_prompt        # Call Gemini API
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": gemini_text
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.8,
                "topK": 40,
                "maxOutputTokens": 2048
            }
        }

        print("[GEMINI] Sending request to Gemini API...")
        resp = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload, timeout=60)
        print(f"[GEMINI] Response status code: {resp.status_code}")
        resp_json = resp.json()

        print("[GEMINI] Raw response from API:")
        print(json.dumps(resp_json, indent=2)[:1000])  # Print first 1000 chars of formatted JSON

        if not resp_json.get('candidates'):
            print("[GEMINI ERROR] No response candidates in response")
            raise RuntimeError("No response candidates from Gemini")
            
        content = resp_json['candidates'][0].get('content', {})
        parts = content.get('parts', [])
        
        if not parts or 'text' not in parts[0]:
            print("[GEMINI ERROR] No text content in response parts")
            raise RuntimeError("No text content in Gemini response")
            
        print("[GEMINI] Successfully extracted text from response")

        raw_text = parts[0]['text']
        print(f"\n[GEMINI] Extracted text content:")
        print("-" * 80)
        print(raw_text[:1000])  # Print first 1000 chars of response
        print("-" * 80)
        
        usage_data = resp_json.get('usageMetadata', {})
        print(f"\n[GEMINI] Usage metadata:")
        print(json.dumps(usage_data, indent=2))
        
        # Create response object matching OpenAI format
        response = type('GeminiResponse', (), {
            'output_text': raw_text,
            'model': GEMINI_MODEL,
            'usage': usage_data
        })
        
        print("\n[GEMINI] Successfully created response object")
        return response

    except Exception as e:
        print(f"[GEMINI ERROR] API call failed: {str(e)}")
        print(f"[GEMINI ERROR] Stack trace: {traceback.format_exc()}")
        raise RuntimeError(f"Failed to call Gemini API: {str(e)}")

class ChatRequest(BaseModel):
    service: str
    location: str
    count: int = 3
    existing: list[str] = []

class NlpRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    providers: list
    usage_report: dict

class NlpResponse(BaseModel):
    valid: bool
    providers: list = []
    usage_report: dict = {}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Process chat requests and return business providers."""
    try:
        # Format the prompt with request parameters
        prompt = f'''Find the top {request.count} "{request.service}" specialists in "{request.location}".
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
No extra commentary, only JSON.'''

        print(f"[DEBUG] Formatted prompt: {prompt[:200]}...")

        # Get providers with error handling
        try:
            response = _invoke_model("gpt-4", prompt, use_search_tools=True)
            if not response:
                raise ValueError("No response from model")

            text = _get_response_text(response)
            if not text:
                raise ValueError("Empty response text from model")
                
        except Exception as e:
            print(f"[ERROR] Model invocation failed: {str(e)}")
            print(f"[ERROR] Stack trace: {traceback.format_exc()}")
            raise HTTPException(
                status_code=500,
                detail="Failed to process request"
            )

        try:
            # Clean and parse JSON response
            text = re.sub(r'```json\s*|\s*```|`', '', text.strip())
            try:
                data = json.loads(text)
            except json.JSONDecodeError as e:
                print(f"[ERROR] Invalid JSON response: {str(e)}")
                print(f"[DEBUG] Raw text: {text[:500]}")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from model"
                )
            
            # Validate response structure
            if not data:
                print("[WARNING] Empty data after JSON parsing")
                return ChatResponse(providers=[], usage_report={})
                
            if isinstance(data, dict):
                data = [data]
            elif not isinstance(data, list):
                print(f"[ERROR] Unexpected data type: {type(data)}")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from model"
                )

            # Process providers with duplicate detection
            providers = []
            seen = set(name.lower().strip() for name in (request.existing or []))
            
            for provider in data:
                try:
                    normalized = _normalize_provider(provider)
                    if normalized:
                        name = normalized['name'].lower()
                        if name not in seen:
                            providers.append(normalized)
                            seen.add(name)
                except Exception as e:
                    print(f"[WARNING] Failed to normalize provider: {str(e)}")

            # Calculate usage metrics and costs
            usage_info = _get_usage_info(response)
            input_tokens = max(usage_info.get('input_tokens', 0) or 0, 0)
            output_tokens = max(usage_info.get('output_tokens', 0) or 0, 0)
            total_tokens = max(usage_info.get('total_tokens', input_tokens + output_tokens), 0)
            
            # Calculate costs based on model
            model_name = usage_info.get('model') or getattr(response, 'model', '')
            if 'gpt-4' in str(model_name).lower():
                input_cost_per_1k = 0.005
                output_cost_per_1k = 0.015
            else:  # Default to GPT-3.5 pricing
                input_cost_per_1k = 0.0005
                output_cost_per_1k = 0.0015
            
            cost = (input_tokens / 1000 * input_cost_per_1k) + (output_tokens / 1000 * output_cost_per_1k)
            
            usage_report = {
                "model": model_name or "unknown",
                "input_tokens": int(input_tokens),
                "output_tokens": int(output_tokens),
                "total_tokens": int(total_tokens),
                "estimated_cost_usd": round(cost, 6),
                "providers_found": len(providers)
            }

            print(f"[INFO] Found {len(providers)} providers, returning top {request.count}")
            return ChatResponse(
                providers=providers[:request.count],
                usage_report=usage_report
            )

        except json.JSONDecodeError as e:
            print(f"[ERROR] Failed to parse JSON response: {str(e)}")
            print(f"[ERROR] Raw text: {text[:200]}")
            return ChatResponse(providers=[], usage_report={})

        except Exception as e:
            print(f"[ERROR] Error processing providers: {str(e)}")
            print(f"[ERROR] Stack trace: {traceback.format_exc()}")
            return ChatResponse(providers=[], usage_report={})

    except Exception as e:
        print(f"[ERROR] Unhandled error in chat endpoint: {str(e)}")
        print(f"[ERROR] Stack trace: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred processing your request: {str(e)}"
        )

@app.post("/api/nlp", response_model=NlpResponse)
async def nlp_endpoint(request: NlpRequest):
    """Process natural language queries to find service providers."""
    if not request or not request.query:
        return NlpResponse(valid=False)

    try:
        # First validate if query is service-related
        validation_prompt = (
            f'Analyze this query: "{request.query}"\n\n'
            'Is this query asking for local service providers like electricians, plumbers, handymen, '
            'cleaners, mechanics, barbers, or similar home/personal services?\n\n'
            'Return ONLY "VALID" or "INVALID" - nothing else.\n\n'
            'Examples of VALID queries:\n'
            '- "I need an electrician to fix my wiring"\n'
            '- "Looking for a plumber in Chicago"\n'
            '- "Find me a handyman near me"\n\n'
            'Examples of INVALID queries:\n'
            '- "What\'s the weather like?"\n'
            '- "How to cook pasta?"\n'
            '- "Tell me about AI"\n'
        )

        # Validate query
        try:
            response = _invoke_model("gpt-4o", validation_prompt, use_search_tools=False)
            if not response:
                print("[ERROR] Empty validation response")
                return NlpResponse(valid=False)

            text = _get_response_text(response).strip().upper()
            if "VALID" not in text:
                print(f"[INFO] Query marked as invalid: {request.query}")
                return NlpResponse(valid=False)

        except Exception as e:
            print(f"[ERROR] Query validation failed: {str(e)}")
            return NlpResponse(valid=False)

        # Extract service info
        extraction_prompt = (
            f'From this service request: "{request.query}"\n\n'
            'Extract the service type, location, and find relevant providers (default 3).\n\n'
            'Use web search to find REAL service providers. Return ONLY valid JSON:\n'
            '{\n'
            '  "service": "extracted service type",\n'
            '  "location": "extracted location or \'not specified\'",\n'
            '  "count": 3,\n'
            '  "providers": [\n'
            '    {\n'
            '      "name": "real business name",\n'
            '      "phone": "XXX-XXX-XXXX format",\n'
            '      "details": "brief description",\n'
            '      "address": "full address",\n'
            '      "location_note": "EXACT or NEARBY",\n'
            '      "confidence": "HIGH or LOW"\n'
            '    }\n'
            '  ]\n'
            '}\n\n'
            'Guidelines:\n'
            '- Search in provided location first\n'
            '- If no location specified, search broadly\n'
            '- Include country-specific results for non-US locations\n'
            '- Return clean JSON only, no commentary'
        )

        try:
            # Get providers
            response = _invoke_model("gpt-4o", extraction_prompt, use_search_tools=True)
            if not response:
                return NlpResponse(valid=False)

            text = _get_response_text(response)
            if not text:
                return NlpResponse(valid=False)

            # Parse and normalize response
            text = re.sub(r'```json\s*|\s*```|`', '', text.strip())
            data = json.loads(text)

            # Process providers
            providers = []
            for provider in data.get('providers', []):
                normalized = _normalize_provider(provider)
                if normalized:
                    providers.append(normalized)

            # Calculate usage and costs
            usage_info = _get_usage_info(response)
            input_tokens = usage_info.get('input_tokens', 0) or 0
            output_tokens = usage_info.get('output_tokens', 0) or 0
            total_tokens = usage_info.get('total_tokens', input_tokens + output_tokens)
            
            cost = (input_tokens / 1000 * 0.005) + (output_tokens / 1000 * 0.015)  # GPT-4 pricing
            
            usage_report = {
                "model": usage_info.get('model') or getattr(response, 'model', None),
                "input_tokens": int(input_tokens),
                "output_tokens": int(output_tokens),
                "total_tokens": int(total_tokens),
                "estimated_cost_usd": round(cost, 6)
            }

            return NlpResponse(
                valid=True,
                providers=providers,
                usage_report=usage_report
            )

        except json.JSONDecodeError as e:
            print(f"[ERROR] Failed to parse JSON response: {str(e)}")
            print(f"[ERROR] Raw text: {text[:200]}")
            return NlpResponse(valid=False)

        except Exception as e:
            print(f"[ERROR] Provider lookup failed: {str(e)}")
            print(f"[ERROR] Stack trace: {traceback.format_exc()}")
            return NlpResponse(valid=False)

    except Exception as e:
        print(f"[ERROR] Unhandled error in NLP endpoint: {str(e)}")
        print(f"[ERROR] Stack trace: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred processing your request: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    """Basic health check endpoint."""
    try:
        openai_available = bool(client.api_key)
        gemini_available = bool(GEMINI_API_KEY and GEMINI_ENDPOINT)
        
        return {
            "status": "healthy",
            "message": "ServiceGPT API is running",
            "models": {
                "openai": "available" if openai_available else "unavailable",
                "gemini": "available" if gemini_available else "unavailable"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
