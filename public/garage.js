//Homie!
const hotline = new Audio("sounds/elevator.mp3");

//Model info
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const source = document.querySelector("#source");
const share = document.querySelector("#share");
const tooltip = document.getElementById("myTooltip");

let modelInfo = ["No title", "No author", "No source"];

//Share copy to clipboard
function copy() {
  /* Select the text field */
  share.select();
  share.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
  tooltip.innerHTML = "Copied!";
}

function copied() {
  tooltip.innerHTML = "Copy to clipboard";
}



let updateStats = function () {
  let link = window.location.origin + "/?model=" + folder;
  share.innerHTML = link;
  share.value = link;

  const http = new XMLHttpRequest();
  const path = "models/" + folder + "/scene.gltf";
  http.open('GET', path, true);
  http.send();
  http.onload = function () {
    modelInfo = JSON.parse(http.response)["asset"]["extras"];
    title.innerHTML = modelInfo["title"];
    author.innerHTML = modelInfo["author"].substr(0, modelInfo["author"].indexOf(" "));
    source.href = modelInfo["source"];
  }
}

let models = [];

//request model list
const http = new XMLHttpRequest();
const path = '/modelList';
http.open('GET', path, true);
http.send();

//Variables for setup
let container;
let camera;
let renderer;
let scene;
let model;

container = document.querySelector(".scene");

//Create scene
scene = new THREE.Scene();
const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1000;

//Camera setup
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
let cameraX = 0;
let cameraY = 3;
let cameraZ = 30;
camera.position.set(cameraX, cameraY, cameraZ);

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(50, 50, 100);
scene.add(light);

//Resize window
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

//Renderer
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

//Load Model (after retreiving list of models)
let loader = new THREE.GLTFLoader();
http.onload = function () {
  models = JSON.parse(http.response);

  //select a custom starting model
  const url = new URL(document.URL);
  folder = url.searchParams.get("model") != undefined ? url.searchParams.get("model") : models[Math.floor(Math.random() * models.length)];
  currentModel = undefined;
  for (let i = 0; i < models.length; i++) {
    if (folder == models[i]) {
      currentModel = i;
    }
  }

  loader.load("models/" + folder + "/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene.children[0];
    model.rotation.z = 5 / 6 * Math.PI; // (cool) starting pose angle
    render(); //render without rotating animation
    updateStats();
  });
}

//Render and rotate model
let render = function () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

let animate = function () {
  requestAnimationFrame(render);
  model.rotation.z += 0.002;
  renderer.render(scene, camera);
}

const freeze = render;
let isRoatationToggled = false;

document.addEventListener("keydown", toggleRotation);
function toggleRotation(e) {
  if (e.code == 'Space') {
    render = (render == freeze) ? animate : freeze;
    isRoatationToggled = !isRoatationToggled;
    hotline.play();
  }
}

//info widget
const info = document.querySelector("#icon");
const instructions = document.querySelector("#instructions");
const closeButton = document.querySelector("#close");

info.addEventListener("click", showInstructions);
function showInstructions() {
  instructions.style.display = "flex";
  info.style.display = "none";
}

closeButton.addEventListener("click", closeInstructions);
function closeInstructions() {
  instructions.style.display = "none";
  info.style.display = "block";
}

//zoom
let scale = 1.0;

const zoom = function (e) {
  if (e.deltaY < 0) {
    if (scale <= 2.9) {
      scale += 0.1
    }

  } else {
    if (scale >= 0.2) {
      scale -= 0.1
    }
  }
  camera.position.set(cameraX / scale, cameraY / scale, cameraZ / scale);
  console.log(scale);
}

container.addEventListener("wheel", zoom);

//Orbit controls
let isClicking = false;
let x = 0;
let y = 0;

container.addEventListener("mousedown", stopRotation);
function stopRotation(e) {
  info.style.display = "none";
  render = freeze;
  isClicking = true;
  x = e.offsetX;
  y = e.offsetY;
}

container.addEventListener("mouseup", startRotation);
function startRotation(e) {
  info.style.display = "block";
  render = isRoatationToggled ? animate : freeze;
  isClicking = false;
  x = 0;
  y = 0;
}

let sensitivity = 100;
container.addEventListener("mousemove", rotateXZ);
function rotateXZ(e) {
  if (isClicking === true) {
    model.rotation.x += (e.offsetY - y) / sensitivity;
    model.rotation.z += (e.offsetX - x) / sensitivity;
    y = e.offsetY;
    x = e.offsetX;
  }
}

document.addEventListener("keydown", adjustSensitivity);
function adjustSensitivity(e) {
  if (e.key == '-') {
    if (sensitivity <= 450) {
      sensitivity += 50;
      console.log('sensitivity: ' + sensitivity);
    }
  }
  if (e.key == '+') {
    if (sensitivity >= 100) {
      sensitivity -= 50;
      console.log('sensitivity: ' + sensitivity);
    }
  }
}


//Music controls
document.addEventListener("keydown", audioUp);
function audioUp(e) {
  if (e.key == 'ArrowUp') {
    if (hotline.volume <= 0.9) {
      hotline.volume += 0.1;
      console.log('volume: ' + Math.round(hotline.volume * 10) / 10);
    }
  }
}

document.addEventListener("keydown", audioDown);
function audioDown(e) {
  if (e.key == 'ArrowDown') {
    if (hotline.volume >= 0.1) {
      hotline.volume -= 0.1;
      console.log('volume: ' + Math.round(hotline.volume * 10) / 10);
    }
  }
}

let lastVolume = hotline.volume;
document.addEventListener("keydown", audioMute);
function audioMute(e) {
  if (e.key == 'm') {
    if (hotline.volume > 0) {
      lastVolume = hotline.volume;
      hotline.volume = 0;
    } else {
      hotline.volume = lastVolume;
    }
  }
}

//Model navigation controls
const remove = function () {
  scene.remove(scene.children[2]);
}
document.addEventListener("keydown", next);
function next(e) {
  if (e.key == 'ArrowRight') {
    let rotationZ = model.rotation.z;
    let rotationX = model.rotation.x;
    let rotationY = model.rotation.y;
    folder = models[Math.abs(++currentModel) % models.length];
    console.log(currentModel);
    loader.load("models/" + folder + "/scene.gltf", function (gltf) {
      scene.add(gltf.scene);
      remove();
      model = gltf.scene.children[0];
      model.rotation.z = rotationZ;
      model.rotation.x = rotationX;
      model.rotation.y = rotationY;
    });
    updateStats();
  }
}

document.addEventListener("keydown", prev);
function prev(e) {
  if (e.key == 'ArrowLeft') {
    let rotationZ = model.rotation.z;
    let rotationX = model.rotation.x;
    let rotationY = model.rotation.y;

    if (currentModel > 0) {
      folder = models[--currentModel % models.length];
      console.log(currentModel);
    } else {
      currentModel = models.length - 1;
      folder = models[currentModel];
      console.log(currentModel);
    }

    loader.load("models/" + folder + "/scene.gltf", function (gltf) {
      scene.add(gltf.scene);
      remove();
      model = gltf.scene.children[0];
      model.rotation.z = rotationZ;
      model.rotation.x = rotationX;
      model.rotation.y = rotationY;
    });
    updateStats();
  }
}