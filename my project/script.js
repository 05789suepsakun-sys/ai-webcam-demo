const URL = "./mp/";

let model, webcam, labelContainer, maxPredictions;

document.getElementById("startBtn").addEventListener("click", init);

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(240, 240, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  const webcamContainer = document.getElementById("webcam-container");
  webcamContainer.innerHTML = "";
  webcamContainer.appendChild(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const percent = (prediction[i].probability * 100).toFixed(1);
    labelContainer.childNodes[i].innerHTML =
      `${prediction[i].className} : ${percent}%`;
  }
}
