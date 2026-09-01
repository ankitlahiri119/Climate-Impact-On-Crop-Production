const form = document.getElementById("predictionForm");
const result = document.getElementById("result");

const areaSelect = document.getElementById("area");
const cropSelect = document.getElementById("crop");


// LOAD AREA AND CROP

async function loadOptions() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/options"
        );

        const data = await response.json();


        // Area dropdown

        areaSelect.innerHTML = "";

        const areaDefault = document.createElement("option");

        areaDefault.value = "";
        areaDefault.textContent = "Select area";

        areaSelect.appendChild(areaDefault);


        data.areas.forEach(function(area) {

            const option = document.createElement("option");

            option.value = area;
            option.textContent = area;

            areaSelect.appendChild(option);

        });


        // Crop dropdown

        cropSelect.innerHTML = "";

        const cropDefault = document.createElement("option");

        cropDefault.value = "";
        cropDefault.textContent = "Select crop";

        cropSelect.appendChild(cropDefault);


        data.crops.forEach(function(crop) {

            const option = document.createElement("option");

            option.value = crop;
            option.textContent = crop;

            cropSelect.appendChild(option);

        });

    }

    catch (error) {

        console.error("Error loading options:", error);

        areaSelect.innerHTML =
            '<option value="">Unable to load areas</option>';

        cropSelect.innerHTML =
            '<option value="">Unable to load crops</option>';

    }

}


// Load dropdowns when page opens

loadOptions();


// PREDICTION

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const area =
        document.getElementById("area").value;

    const crop =
        document.getElementById("crop").value;

    const rainfall =
        document.getElementById("rainfall").value;

    const pesticides =
        document.getElementById("pesticides").value;

    const temperature =
        document.getElementById("temperature").value;


    result.innerHTML = "Predicting...";


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    area: area,

                    crop: crop,

                    rainfall: Number(rainfall),

                    pesticides: Number(pesticides),

                    temperature: Number(temperature)

                })

            }
        );


        const data = await response.json();


        if (response.ok) {

            result.innerHTML =
                "Predicted Yield: " +
                data.predicted_yield.toFixed(2) +
                " hg/ha";

        }

        else {

            result.innerHTML =
                "Error: " + data.error;

        }

    }

    catch (error) {

        result.innerHTML =
            "Unable to connect to the backend.";

        console.error(error);

    }

});