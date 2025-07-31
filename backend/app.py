from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "✅ Weather API is running!"

@app.route('/weather')
def weather():
    data = {
        "city": "Tehran",
        "temperature": 32,
        "condition": "Sunny"
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
