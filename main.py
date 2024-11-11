from flask import Flask, render_template, request, jsonify
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import requests  # For making requests to the Gemini API

# Initialize Flask app
app = Flask(__name__)

# Google Sheets setup for product queries
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
]
creds = ServiceAccountCredentials.from_json_keyfile_name("H:\Personal\Je\Project\credentials.json", scope)
client = gspread.authorize(creds)
sheet = client.open_by_url("https://docs.google.com/spreadsheets/d/1X3Kp6m9X67v6O_Bzk3Ww7noehy45bYBH7BlZJPXZwCI/edit?gid=1856852934#gid=1856852934").sheet1

# Define a simple template for conversation
template = """
The following is a conversation between a user and an AI assistant. The AI assistant is helpful, creative, clever, and very friendly.

User: {question}
AI:"""

# Initialize the Ollama model
model = OllamaLLM(model="llama3.2:1b")

# Create a prompt template for conversation
prompt = ChatPromptTemplate.from_template(template)

# Define the LLMChain to handle prompt and model interaction
chain = prompt | model

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyBgfvqOq4DQg-whvmYZcJk4NTchy3tzGwQ"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBgfvqOq4DQg-whvmYZcJk4NTchy3tzGwQ"  # Replace with the actual endpoint

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<page>')
def render_page(page):
    try:
        return render_template(f'{page}')
    except:
        return "Page not found", 404

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    print("inside endpoint",user_input)
    
    # Check if the request is for product information
    if "show products" in user_input.lower() or "available products" in user_input.lower():
        products = sheet.get_all_records()
        filtered_products = [p for p in products if p.get('Condition') and "Refurbished" in p['Condition']]
        print("Products data:", products)  # Add this line to debug


        product_list = "\n".join(
            f"Product: {p['Product Name']}, Price: ${p['Price']}, Condition: {p['Condition']}, Description: {p['Description']}"
            for p in filtered_products
        )
        
        return jsonify({"response": products})
    
    # If Gemini-specific query
    elif "gemini" in user_input.lower():
        try:
            gemini_response = requests.get(
                GEMINI_API_URL,
                headers={"Authorization": f"Bearer {GEMINI_API_KEY}"}
            )
            if gemini_response.status_code == 200:
                gemini_data = gemini_response.json()
                return jsonify({"response": f"Gemini data: {gemini_data}"})
            else:
                return jsonify({"response": "Failed to fetch Gemini data"})
        except Exception as e:
            return jsonify({"response": f"Error fetching Gemini data: {e}"})

    # For regular conversation, use the AI response
    result = chain.invoke({"question": user_input})
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(debug=True)
