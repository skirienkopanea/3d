//Homie!
const hotline = new Audio("sounds/elevator.mp3");

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
camera.position.set(0, 5, 30);

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(50, 50, 100);
scene.add(light);

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
  param = url.searchParams.get("model") != undefined ? url.searchParams.get("model") : models[Math.floor(Math.random() * models.length)];
  currentModel = undefined;
  for (let i = 0; i < models.length; i++) {
    if (param == models[i]) {
      currentModel = i;
    }
  }

  loader.load("models/" + param + "/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene.children[0];
    model.rotation.z = 5 / 6 * Math.PI; // (cool) starting pose angle
    animate();
  });
}



//Rotate model
let animate = function () {
  requestAnimationFrame(animate);
  model.rotation.z += 0.002;
  renderer.render(scene, camera);
}

const go = animate;

//Resize window
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

document.addEventListener("mousedown", freeze);
function freeze() {
  animate = stop;
}

document.addEventListener("mouseup", unfreeze);
function unfreeze() {
  animate = go;
}


const remove = function () {
  scene.remove(scene.children[2]);
}


//Music controls
document.addEventListener("keydown", audioUp);
function audioUp(e) {
  if (e.key == 'ArrowUp') {
    hotline.play();
    if (hotline.volume <= 0.9) {
      hotline.volume += 0.1;
      console.log('volume: ' + Math.round(hotline.volume * 10) / 10);
    }
  }
}

document.addEventListener("keydown", audioDown);
function audioDown(e) {
  if (e.key == 'ArrowDown') {
    hotline.play();
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

document.addEventListener("keydown", next);
function next(e) {
  if (e.key == 'ArrowRight') {
    let rotation = model.rotation.z;
    loader.load("models/" + models[Math.abs(++currentModel) % models.length] + "/scene.gltf", function (gltf) {
      scene.add(gltf.scene);
      remove();
      model = gltf.scene.children[0];
      model.rotation.z = rotation;

    });
  }
}


document.addEventListener("keydown", prev);
function prev(e) {
  if (e.key == 'ArrowLeft') {
    let rotation = model.rotation.z;
    loader.load("models/" + models[Math.abs(--currentModel) % models.length] + "/scene.gltf", function (gltf) {
      scene.add(gltf.scene);
      remove();
      model = gltf.scene.children[0];
      model.rotation.z = rotation;
    });
  }
}


const stop = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}




