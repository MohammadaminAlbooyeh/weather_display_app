from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Weather API is running!"

@app.route('/weather')
def weather():
    # This is a mock response. In a real application, you would fetch this data from a weather API.
    return jsonify({
        "city": "Tehran",
        "temperature": 32,
        "condition": "Sunny"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)