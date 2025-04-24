from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import HistGradientBoostingRegressor



app = Flask(__name__)
CORS(app)

def convertDriveTime(drive_time):
    hours, minutes = 0, 0

    if 'hour' in drive_time:
        hours = int(drive_time.split('hour')[0].strip())
        drive_time = drive_time.split('hour')[1].strip()

    if 'min' in drive_time:
        minutes = int(drive_time.split('min')[0].strip())

    return hours * 60 + minutes

def stripDegree(data):
    if data is None:
        return np.nan
    if isinstance(data, str):
        data = data.replace('°', '').strip()
        return data
    return np.nan

def covertYesNo(data):
    if isinstance(data, str):
        data = data.strip().lower()
        if data == 'yes':
            return 1
        elif data == 'no':
            return 0
        else:
            return np.nan
    return data

def convertSeason(data):
    if isinstance(data, str):
        data = data.strip().lower()
        match data:
            case "winter":
                return 0
            case "spring":
                return 1
            case "summer":
                return 2
            case "fall":
                return 3
            case _:
                return np.nan
    return data

def convertPortraitLandscape(data):
    if isinstance(data, str):
        data = data.strip().lower()
        if data == 'portrait':
            return 0
        elif data == 'landscape':
            return 1
        elif data == 'both':
            return 2
    return data
            
def convertToOutput(ypred):
    l = []
    for pred in ypred:
        hours, minutes = pred // 1, (pred % 1) * 60
        l.append({"hours" : int(hours), "mins": int(minutes)})
    return l

@app.route('/process', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    temp_file_path = os.path.join('temp', file.filename)

    # Save the uploaded file to a temporary location
    os.makedirs('temp', exist_ok=True)
    file.save(temp_file_path)

    try:
        
        # Call your Python processing logic here
        # Replace this with your actual processing logic
        with open (temp_file_path, 'r') as f:
            data = pd.read_excel(temp_file_path, sheet_name=0, engine='openpyxl')  # Read the first sheet
            # Convert to CSV
            csv_file_path = temp_file_path.replace('.xlsx', '.csv')
            data.to_csv(csv_file_path, index=False, encoding='utf-8')  # Write CSV with UTF-8 encoding


            # Continue processing the CSV file if needed
            data = pd.read_csv(csv_file_path, encoding='utf-8')

        # Convert categorical variables to numeric encoding
        categorical_cols = ["Inverter Manufacturer", "Array Type",
                            "Truss / Rafter", "Interconnection Type",
                            "Roof Type", "Attachment Type"]

        encoder = OneHotEncoder(sparse_output=False, drop='first')
        encoded_cats = encoder.fit_transform(data[categorical_cols])
        encoded_df = pd.DataFrame(encoded_cats, columns=encoder.get_feature_names_out(categorical_cols))

        # Drop original categorical columns
        data.drop(columns=categorical_cols, inplace=True)

        # Merge encoded data back
        data = pd.concat([data, encoded_df], axis=1)

        data["Drive Time"] = data["Drive Time"].apply(convertDriveTime)


        data["Azimuth"] = data["Azimuth"].astype(str)
        azimuth_split = data["Azimuth"].str.split("/", expand=True)

        # Assign the split values to new columns
        data["Azimuth1"] = azimuth_split[0]
        try:
            data["Azimuth2"] = azimuth_split[1]
        except Exception as e:
            data["Azimuth2"] = np.nan

        try:
            data["Azimuth3"] = azimuth_split[2]
        except Exception as e:
            data["Azimuth3"] = np.nan

        # Drop the original Azimuth column
        data.drop(columns=["Azimuth"], inplace=True)

        data["Tilt"] = data["Tilt"].astype(str)
        tilt_split = data["Tilt"].str.split("/", expand=True)

        # Assign the split values to new columns
        data["Tilt1"] = tilt_split[0]
        try:
            data["Tilt2"] = tilt_split[1]
        except Exception as e:  
            data["Tilt2"] = np.nan


        # Drop the original Tilt column
        data.drop(columns=["Tilt"], inplace=True)

        data["Tilt1"] = data["Tilt1"].apply(stripDegree)

        data["Tilt2"] = data["Tilt2"].apply(stripDegree)

        data["Azimuth1"] = data["Azimuth1"].apply(stripDegree)

        data["Azimuth2"] = data["Azimuth2"].apply(stripDegree)

        data["Azimuth3"] = data["Azimuth3"].apply(stripDegree)

        data["Consumption Monitoring"] = data["Consumption Monitoring"].apply(covertYesNo)

        data["Squirrel Screen"] = data["Squirrel Screen"].apply(covertYesNo)

        data["Reinforcements"] = data["Reinforcements"].apply(covertYesNo)

        data["Rough Electrical Inspection"] = data["Rough Electrical Inspection"].apply(covertYesNo)

        data["Install Season"] = data["Install Season"].apply(convertSeason)

        data["Portrait / Landscape"] = data["Portrait / Landscape"].apply(convertPortraitLandscape) 

        features_names = ['Drive Time',
                        'Panel QTY',
                        'System Rating (kW DC)',
                        'Squirrel Screen',
                        'Consumption Monitoring',
                        'Reinforcements',
                        'Rough Electrical Inspection',
                        'Module Length',
                        'Module Width',
                        'Module Weight',
                        '# of Arrays',
                        '# of reinforcement',
                        'Portrait / Landscape',
                        '# of Stories',
                        'Install Season',
                        'Inverter Manufacturer_GoodWe',
                        'Inverter Manufacturer_SMA',
                        'Inverter Manufacturer_SolarEdge',
                        'Inverter Manufacturer_nan',
                        'Array Type_Roof Mount',
                        'Truss / Rafter_Purlin',
                        'Truss / Rafter_Rafter',
                        'Truss / Rafter_TJI',
                        'Truss / Rafter_Truss',
                        'Interconnection Type_A1',
                        'Interconnection Type_A2',
                        'Interconnection Type_A3',
                        'Interconnection Type_A4',
                        'Interconnection Type_B*',
                        'Interconnection Type_B1',
                        'Interconnection Type_B2',
                        'Interconnection Type_C*',
                        'Interconnection Type_C1',
                        'Interconnection Type_C2',
                        'Interconnection Type_C3',
                        'Roof Type_Asphalt Shingles',
                        'Roof Type_EPDM (Flat Roof)',
                        'Roof Type_Ground Mount',
                        'Roof Type_Standing Seam Metal Roof',
                        'Attachment Type_Flashfoot 2',
                        'Attachment Type_Flashloc RM',
                        'Attachment Type_Flashview',
                        'Attachment Type_Ground Mount',
                        'Attachment Type_Hugs',
                        'Attachment Type_RT Mini',
                        'Attachment Type_S-5!',
                        'Attachment Type_Unk0wn',
                        'Azimuth1',
                        'Azimuth2',
                        'Azimuth3',
                        'Tilt1',
                        'Tilt2']


        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Construct the full path to the model file
        model_path = os.path.join(script_dir, "finalized_model.sav")
        scaler_path = os.path.join(script_dir, "scaler.pkl")

        # Load the model and scaler
        model = pickle.load(open(model_path, 'rb'))
        scaler = pickle.load(open(scaler_path, 'rb'))

        fill_zeros = ['Inverter Manufacturer_GoodWe',
                        'Inverter Manufacturer_SMA',
                        'Inverter Manufacturer_SolarEdge',
                        'Inverter Manufacturer_nan',
                        'Array Type_Roof Mount',
                        'Truss / Rafter_Purlin',
                        'Truss / Rafter_Rafter',
                        'Truss / Rafter_TJI',
                        'Truss / Rafter_Truss',
                        'Interconnection Type_A1',
                        'Interconnection Type_A2',
                        'Interconnection Type_A3',
                        'Interconnection Type_A4',
                        'Interconnection Type_B*',
                        'Interconnection Type_B1',
                        'Interconnection Type_B2',
                        'Interconnection Type_C*',
                        'Interconnection Type_C1',
                        'Interconnection Type_C2',
                        'Interconnection Type_C3',
                        'Roof Type_Asphalt Shingles',
                        'Roof Type_EPDM (Flat Roof)',
                        'Roof Type_Ground Mount',
                        'Roof Type_Standing Seam Metal Roof',
                        'Attachment Type_Flashfoot 2',
                        'Attachment Type_Flashloc RM',
                        'Attachment Type_Flashview',
                        'Attachment Type_Ground Mount',
                        'Attachment Type_Hugs',
                        'Attachment Type_RT Mini',
                        'Attachment Type_S-5!',
                        'Attachment Type_Unk0wn']
        
        for col in fill_zeros:
            if col not in data.columns:
                data[col] = 0
            elif data[col].isnull().any():
                data[col] = data[col].fillna(0)
        
        for col in features_names:
            if col not in data.columns:
                data[col] = np.nan
            elif data[col].isnull().any():
                data[col] = np.nan


        features = scaler.transform(data[features_names])


        ypred = model.predict(features)
        result = convertToOutput(ypred)
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if os.path.exists(csv_file_path):
            os.remove(csv_file_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == '__main__':
    app.run(debug=True)