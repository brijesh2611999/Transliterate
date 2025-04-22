from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
from fastapi.middleware.cors import CORSMiddleware
import re
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def transliterate_word(word: str):
    """Transliterate a single word using indic-transliteration"""
    try:
        return transliterate(
            word.lower(),
            sanscript.ITRANS,
            sanscript.DEVANAGARI
        )
    except Exception:
        return word
def transliterate_sentence(sentence: str):
    """Process a sentence word by word without returning spaces as separate words"""
    if not sentence.strip():
        raise ValueError("Input text cannot be empty")

    # Split into words while preserving their original form
    words = re.findall(r"(\S+|\s)", sentence)
    word_results = []
    hindi_parts = []

    for word in words:
        if word.isspace():
            # Add spaces to the final sentence but not as separate words
            hindi_parts.append(word)
        elif word.isalpha():
            # Transliterate alphabetic words
            try:
                hindi = transliterate(
                    word.lower(),
                    sanscript.ITRANS,
                    sanscript.DEVANAGARI
                )
                word_results.append({
                    "english": word,
                    "hindi": hindi
                })
                hindi_parts.append(hindi)
            except Exception:
                word_results.append({
                    "english": word,
                    "hindi": word
                })
                hindi_parts.append(word)
        else:
            # Handle numbers/punctuation (don't transliterate)
            word_results.append({
                "english": word,
                "hindi": word
            })
            hindi_parts.append(word)

    return {
        "word_results": word_results,  # This won't contain space-only entries
        "full_sentence": {
            "english": sentence,
            "hindi": ''.join(hindi_parts)  # But spaces are preserved here
        }
    }
@app.post("/transliterate")
async def api_transliterate(request: Request):
    try:
        data = await request.json()
        text = data.get('text')
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        result = transliterate_sentence(text)
        return JSONResponse({
            "success": True,
            "data": result
        })
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transliteration error: {str(e)}")

@app.get("/")
async def home():
    return {"message": "English to Hindi Transliterator API is running"}

# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000)