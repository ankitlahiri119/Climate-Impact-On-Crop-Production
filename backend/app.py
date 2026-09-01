from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)

CORS(app)

model = joblib.load("../model/yield_model.pkl")
area_encoder = joblib.load("../model/area_encoder.pkl")
item_encoder = joblib.load("../model/item_encoder.pkl")


@app.route("/")
def home():
    return "Climate Crop ML Backend is Running"


@app.route("/options", methods=["GET"])
def options():

    areas = area_encoder.classes_.tolist()
    crops = item_encoder.classes_.tolist()

    return jsonify({
        "areas": areas,
        "crops": crops
    })


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    area = data["area"]
    crop = data["crop"]
    rainfall = data["rainfall"]
    pesticides = data["pesticides"]
    temperature = data["temperature"]

    area = area_encoder.transform([area])[0]
    crop = item_encoder.transform([crop])[0]

    input_data = [[
        area,
        crop,
        rainfall,
        pesticides,
        temperature
    ]]

    prediction = model.predict(input_data)

    return jsonify({
        "predicted_yield": float(prediction[0])
    })


if __name__ == "__main__":
    app.run(debug=True)