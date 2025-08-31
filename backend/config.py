import os
try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except ImportError:
    # Minimal manual .env loader fallback
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line=line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k,v = line.split('=',1)
                os.environ.setdefault(k.strip(), v.strip())
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)