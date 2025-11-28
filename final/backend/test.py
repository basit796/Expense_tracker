from google import genai
GOOGLE_API_KEY='AIzaSyCGolAvZ6qXUh4JTLEtCwL9nkLVKVGBjTE'
import warnings
warnings.filterwarnings(
    "ignore",
    message=r"Field name .* shadows an attribute in parent .*"
)



# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client(api_key=GOOGLE_API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="hi"
)
print(response.text)