import { useEffect, useState } from "react";

function App() {
  const [areas, setAreas] = useState([]);
  const [crops, setCrops] = useState([]);

  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [pesticides, setPesticides] = useState("");
  const [temperature, setTemperature] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [recommendation, setRecommendation] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  // LOAD AREA AND CROP OPTIONS
  useEffect(() => {
    async function loadOptions() {
      try {
        const response = await fetch("http://127.0.0.1:5000/options");
        const data = await response.json();
        setAreas(data.areas);
        setCrops(data.crops);
      } catch (err) {
        console.error(err);
        setError("Unable to load areas and crops.");
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  // PREDICTION
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setPrediction(null);
    setRecommendation("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area,
          crop,
          rainfall: Number(rainfall),
          pesticides: Number(pesticides),
          temperature: Number(temperature),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setPrediction(data.predicted_yield);
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the prediction server.");
    } finally {
      setLoading(false);
    }
  }

  // CLEAR FORM
  function clearForm() {
    setArea("");
    setCrop("");
    setRainfall("");
    setPesticides("");
    setTemperature("");
    setPrediction(null);
    setRecommendation("");
    setError("");
  }

  // STATUS
  function getStatus(value) {
    if (value < 19919) {
      return {
        text: "LOW YIELD",
        className: "bg-red-500/15 text-red-300 border-red-400/30",
        icon: "⚠️",
      };
    }
    if (value <= 104677) {
      return {
        text: "NORMAL YIELD",
        className: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
        icon: "🌱",
      };
    }
    return {
      text: "HIGH YIELD",
      className: "bg-green-500/15 text-green-300 border-green-400/30",
      icon: "🌾",
    };
  }

  const inputClass =
    "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition mb-5";

  const labelClass = "block text-sm text-gray-300 mb-2";

  const statCardClass =
    "card-glow rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition";

  return (
    <div className="min-h-screen bg-[#06130d] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute right-0 top-1/3 w-96 h-96 bg-emerald-400/[0.06] rounded-full blur-3xl" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-500/20 border border-green-400/20 flex items-center justify-center text-2xl">
              🌱
            </div>
            <div>
              <h1 className="font-bold text-lg">Yield Predictor</h1>
              <p className="text-xs text-gray-400">Climate Based Prediction</p>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <a
              href="#predict"
              className="hover:text-green-400 transition-colors"
            >
              Prediction
            </a>
            <a
              href="#climate"
              className="hover:text-green-400 transition-colors"
            >
              Climate
            </a>
            <a href="#model" className="hover:text-green-400 transition-colors">
              ML Model
            </a>
          </div>

          <div className="px-4 py-2 rounded-full border border-green-400/20 bg-green-500/10 text-green-300 text-xs">
            ● ML System Online
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-70 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#06130d]/20 via-[#06130d]/50 to-[#06130d]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-green-400/20 bg-green-500/10 backdrop-blur-md text-green-400 text-sm">
            🌍 Climate + Agriculture + ML
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Understand Climate.
            <br />
            <span className="text-green-400">Predict Crop Yield.</span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-gray-300 text-lg">
            A machine learning based system that analyzes agricultural and
            climate conditions to estimate crop yield.
          </p>

          <a
            href="#predict"
            className="inline-block mt-9 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/20 hover:shadow-green-400/40 hover:-translate-y-1 transition-all duration-300"
          >
            Start Prediction →
          </a>
        </div>
      </section>

      {/* MAIN */}
      <main id="predict" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {/* SECTION TITLE */}
        <div className="mb-10">
          <p className="text-green-400 text-sm font-semibold">
            PREDICTION SYSTEM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Crop Yield Prediction
          </h2>
          <p className="text-gray-400 mt-3">
            Enter agricultural and climate conditions to generate a prediction.
          </p>
        </div>

        {/* TWO CARDS */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* INPUT CARD */}
          <div className="card-glow group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 shadow-2xl hover:border-green-400/30 hover:shadow-green-500/10 transition-colors duration-500">
            <div className="absolute -top-32 -right-32 w-72 h-10 rounded-full bg-green-400/10 blur-3xl group-hover:bg-green-400/20 transition-colors duration-700" />

            <div className="relative">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h3 className="text-2xl font-bold">Prediction Inputs</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Provide field conditions
                  </p>
                </div>
                <div className="text-3xl">🌾</div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* AREA */}
                <label className={labelClass}>Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="" className="bg-gray-900">
                    {loadingOptions ? "Loading areas..." : "Select area"}
                  </option>
                  {areas.map((item) => (
                    <option key={item} value={item} className="bg-gray-900">
                      {item}
                    </option>
                  ))}
                </select>

                {/* CROP */}
                <label className={labelClass}>Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="" className="bg-gray-900">
                    {loadingOptions ? "Loading crops..." : "Select crop"}
                  </option>
                  {crops.map((item) => (
                    <option key={item} value={item} className="bg-gray-900">
                      {item}
                    </option>
                  ))}
                </select>

                {/* RAINFALL */}
                <label className={labelClass}>
                  🌧️ Average Rainfall{" "}
                  <span className="text-gray-500">(mm/year)</span>
                </label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  placeholder="Example: 1200"
                  required
                  className={inputClass}
                />

                {/* PESTICIDES */}
                <label className={labelClass}>
                  🧪 Pesticides <span className="text-gray-500">(tonnes)</span>
                </label>
                <input
                  type="number"
                  value={pesticides}
                  onChange={(e) => setPesticides(e.target.value)}
                  placeholder="Example: 50"
                  required
                  className={inputClass}
                />

                {/* TEMPERATURE */}
                <label className={labelClass}>
                  🌡️ Average Temperature{" "}
                  <span className="text-gray-500">(°C)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="Example: 24.5"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition"
                />

                {/* BUTTONS */}
                <div className="flex gap-3 mt-7">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-bold hover:from-green-400 hover:to-emerald-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/20 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? "⏳ Predicting..." : "🌾 Predict Yield"}
                  </button>

                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>

          {/* RESULT CARD */}
          <div className="card-glow group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 shadow-2xl hover:border-emerald-400/30 hover:shadow-emerald-500/10 transition-colors duration-500">
            <div className="absolute -bottom-32 -left-32 w-80 h-10 rounded-full bg-emerald-400/10 blur-3xl group-hover:bg-emerald-400/20 transition-colors duration-700" />

            <div className="relative">
              <div className="flex justify-between items-center mb-7">
                <div>
                  <h3 className="text-2xl font-bold">Prediction Result</h3>
                  <p className="text-gray-500 text-sm mt-1">ML model output</p>
                </div>
                <div className="text-3xl">🤖</div>
              </div>

              {!prediction && !loading && (
                <div className="card-glow min-h-[300px] flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-black/10">
                  <div className="text-6xl mb-5">🌱</div>
                  <h4 className="text-xl font-bold">Ready for prediction</h4>
                  <p className="text-gray-500 mt-2 max-w-sm">
                    Enter the required conditions and click Predict Yield.
                  </p>
                </div>
              )}

              {loading && (
                <div className="min-h-[300px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin" />
                  <p className="text-green-300 mt-5">Analyzing conditions...</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Random Forest is generating the prediction.
                  </p>
                </div>
              )}

              {prediction && !loading && (
                <div>
                  {/* MAIN RESULT */}
                  <div className="card-glow rounded-2xl p-7 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-400/10">
                    <div className="text-5xl mb-4">🌾</div>
                    <p className="text-gray-400 text-sm">
                      Predicted Crop Yield
                    </p>
                    <div className="text-4xl md:text-5xl font-black text-green-400 mt-2">
                      {prediction.toFixed(2)}
                    </div>
                    <p className="text-gray-500 mt-2">hg/ha</p>
                  </div>

                  {/* STATUS */}
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Yield Status
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatus(prediction).className}`}
                    >
                      {getStatus(prediction).icon} {getStatus(prediction).text}
                    </div>
                  </div>

                  {/* RECOMMENDATION */}
                  <div className="card-glow mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/10">
                    <h4 className="font-bold text-emerald-300 mb-3">
                      💡 Agricultural Recommendation
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>

                  {/* SELECTED VALUES */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="rounded-xl bg-black/20 border border-white/5 p-3 text-center">
                      <p className="text-xs text-gray-500">Rainfall</p>
                      <p className="font-bold mt-1">{rainfall}</p>
                      <p className="text-xs text-gray-600">mm/year</p>
                    </div>

                    <div className="rounded-xl bg-black/20 border border-white/5 p-3 text-center">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="font-bold mt-1">{temperature}</p>
                      <p className="text-xs text-gray-600">°C</p>
                    </div>

                    <div className="rounded-xl bg-black/20 border border-white/5 p-3 text-center">
                      <p className="text-xs text-gray-500">Pesticides</p>
                      <p className="font-bold mt-1">{pesticides}</p>
                      <p className="text-xs text-gray-600">tonnes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CLIMATE SECTION */}
        <section id="climate" className="mt-20">
          <div className="mb-8">
            <p className="text-green-400 text-sm font-semibold">
              CLIMATE OVERVIEW
            </p>
            <h2 className="text-3xl font-bold mt-2">Climate Conditions</h2>
            <p className="text-gray-500 mt-2">
              Visual overview of the values supplied to the model.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* RAINFALL */}
            <div
              className={`${statCardClass} hover:bg-green-500/[0.05] hover:border-green-400/20`}
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl">🌧️</span>
                <span className="text-xs text-gray-500">RAINFALL</span>
              </div>
              <p className="text-3xl font-bold mt-6">{rainfall || "--"}</p>
              <p className="text-gray-500 text-sm">mm/year</p>
              <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${Math.min(Number(rainfall) / 20, 100)}%` }}
                />
              </div>
            </div>

            {/* TEMPERATURE */}
            <div
              className={`${statCardClass} hover:bg-orange-500/[0.05] hover:border-orange-400/20`}
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl">🌡️</span>
                <span className="text-xs text-gray-500">TEMPERATURE</span>
              </div>
              <p className="text-3xl font-bold mt-6">{temperature || "--"}</p>
              <p className="text-gray-500 text-sm">°C</p>
              <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all"
                  style={{
                    width: `${Math.min(Number(temperature) * 2, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* PESTICIDES */}
            <div
              className={`${statCardClass} hover:bg-purple-500/[0.05] hover:border-purple-400/20`}
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl">🧪</span>
                <span className="text-xs text-gray-500">PESTICIDES</span>
              </div>
              <p className="text-3xl font-bold mt-6">{pesticides || "--"}</p>
              <p className="text-gray-500 text-sm">tonnes</p>
              <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{
                    width: `${Math.min(Number(pesticides) / 10, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* MODEL SECTION */}

        <section id="model" className="mt-20">
          <div
            className="card-glow rounded-3xl border border-white/10
                  bg-gradient-to-br from-green-500/[0.08]
                  to-transparent
                  p-8 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* LEFT SIDE - MODEL INFORMATION */}

              <div>
                <p className="text-green-400 text-sm font-semibold">
                  MACHINE LEARNING
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">
                  Random Forest Regression
                </h2>
                <p className="text-gray-400 leading-relaxed mt-5">
                  The system uses a Random Forest Regression model trained on
                  agricultural and climate-related data to estimate crop yield.
                </p>

                {/* MODEL TAGS */}

                <div className="flex flex-wrap gap-3 mt-6">
                  <span
                    className="px-4 py-2 rounded-full
                           bg-green-500/10
                           border border-green-400/20
                           text-green-300 text-sm"
                  >
                    Random Forest
                  </span>
                  <span
                    className="px-4 py-2 rounded-full
                           bg-blue-500/10
                           border border-blue-400/20
                           text-blue-300 text-sm"
                  >
                    Regression
                  </span>
                  <span
                    className="px-4 py-2 rounded-full
                           bg-purple-500/10
                           border border-purple-400/20
                           text-purple-300 text-sm"
                  >
                    Label Encoding
                  </span>
                </div>
                {/* MODEL EXPLANATION */}

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div
                    className="rounded-2xl
                          bg-black/20
                          border border-white/10
                          p-5"
                  >
                    <div className="text-2xl">🌳</div>
                    <p className="font-bold mt-3">Ensemble Model</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Multiple decision trees work together.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl
                          bg-black/20
                          border border-white/10
                          p-5"
                  >
                    <div className="text-2xl">📈</div>
                    <p className="font-bold mt-3">Regression</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Predicts a continuous crop yield value.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl
                          bg-black/20
                          border border-white/10
                          p-5"
                  >
                    <div className="text-2xl">🧹</div>
                    <p className="font-bold mt-3">Preprocessed Data</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Data is cleaned and encoded before training.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl
                          bg-black/20
                          border border-white/10
                          p-5"
                  >
                    <div className="text-2xl">⚡</div>
                    <p className="font-bold mt-3">Fast Prediction</p>
                    <p className="text-sm text-gray-500 mt-2">
                      The trained model generates predictions quickly.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - MODEL PERFORMANCE */}

              <div className="relative">
                {/* Glow */}

                <div
                  className="absolute
                        -top-10
                        -right-10
                        w-40
                        h-40
                        bg-green-500/10
                        rounded-full
                        blur-3xl"
                ></div>
                <div
                  className="relative
                        rounded-2xl
                        border border-white/10
                        bg-black/20
                        backdrop-blur-xl
                        p-6
                        hover:border-green-400/30
                        hover:shadow-lg
                        hover:shadow-green-500/10
                        transition duration-300"
                >
                  {/* HEADER */}

                  <div
                    className="flex items-center
                          justify-between mb-6"
                  >
                    <div>
                      <p
                        className="text-xs
                            text-gray-500
                            uppercase
                            tracking-widest"
                      >
                        Model Performance
                      </p>
                      <h3
                        className="text-xl
                             font-bold
                             mt-1"
                      >
                        Evaluation Metrics
                      </h3>
                    </div>
                    <div
                      className="w-10 h-10
                            rounded-xl
                            bg-green-500/10
                            border border-green-400/20
                            flex items-center
                            justify-center"
                    >
                      🎯
                    </div>
                  </div>
                  {/* R2 SCORE */}
                  <div
                    className="rounded-xl
                          bg-green-500/10
                          border border-green-400/10
                          p-4 mb-4"
                  >
                    <div
                      className="flex items-center
                            justify-between"
                    >
                      <div>
                        <p className="text-sm text-gray-400">R² Score</p>
                        <p
                          className="text-2xl
                              font-bold
                              text-green-400
                              mt-1"
                        >
                          0.9729
                        </p>
                      </div>
                      <div className="text-green-400 text-2xl">✓</div>
                    </div>
                    {/* R2 PROGRESS */}

                    <div
                      className="mt-3
                            h-2
                            bg-black/30
                            rounded-full
                            overflow-hidden"
                    >
                      <div
                        className="h-full
                           bg-green-400
                           rounded-full"
                        style={{ width: "97.29%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      97.29% model fit
                    </p>
                  </div>
                  {/* MAE + RMSE */}

                  <div className="grid grid-cols-2 gap-4">
                    {/* MAE */}

                    <div
                      className="rounded-xl
                            bg-blue-500/10
                            border border-blue-400/10
                            p-4"
                    >
                      <p className="text-sm text-gray-400">MAE</p>

                      <p
                        className="text-xl
                            font-bold
                            text-blue-300
                            mt-2"
                      >
                        5,626.01
                      </p>

                      <p className="text-xs text-gray-500 mt-1">hg/ha</p>
                    </div>

                    {/* RMSE */}

                    <div
                      className="rounded-xl
                            bg-purple-500/10
                            border border-purple-400/10
                            p-4"
                    >
                      <p className="text-sm text-gray-400">RMSE</p>

                      <p
                        className="text-xl
                            font-bold
                            text-purple-300
                            mt-2"
                      >
                        14,018.35
                      </p>

                      <p className="text-xs text-gray-500 mt-1">hg/ha</p>
                    </div>
                  </div>

                  {/* METRIC EXPLANATION */}

                  <div
                    className="mt-5
                          rounded-xl
                          bg-white/[0.03]
                          border border-white/5
                          p-4"
                  >
                    <p
                      className="text-xs
                          text-gray-500
                          uppercase
                          tracking-wider
                          mb-2"
                    >
                      What these metrics mean
                    </p>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      R² shows how well the model explains the variation in crop
                      yield. MAE (Mean Absolute Error) & RMSE (Root Mean Squared
                      Error) measure the prediction error of the trained model.
                    </p>
                  </div>

                  {/* FOOTNOTE */}

                  <p
                    className="text-xs
                        text-gray-500
                        mt-5
                        text-center"
                  >
                    Evaluation results from the trained Random Forest regression
                    model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <p className="text-green-400 text-sm font-semibold">WORKFLOW</p>
            <h2 className="text-3xl font-bold mt-2">How The System Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                n: "01",
                title: "Input Data",
                desc: "Enter agricultural and climate conditions.",
              },
              {
                n: "02",
                title: "Encode",
                desc: "Categorical values are converted using encoders.",
              },
              {
                n: "03",
                title: "ML Prediction",
                desc: "Random Forest predicts crop yield.",
              },
              {
                n: "04",
                title: "Recommendation",
                desc: "The system provides agricultural guidance.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="card-glow text-center p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center text-xl">
                  {step.n}
                </div>
                <h3 className="font-bold mt-4">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">🌱 Climate Impact On Crop Production</p>
          <p className="text-gray-600 text-sm mt-2">Machine Learning Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
