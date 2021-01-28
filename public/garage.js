//Variables for setup
let models = ["plane","truck","toy","hover","blue","ghost","white","black"];
const url = new URL(document.URL);
param = url.searchParams.get("model");
currentModel = undefined;
for (let i = 0; i<models.length; i++){
  if (param == models[i]){
    currentModel = i;
  }
}

let container;
let camera;
let renderer;
let scene;
let model;
let controls;


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

//Load Model
let loader = new THREE.GLTFLoader();
loader.load("models/" + param + "/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  model = gltf.scene.children[0];
  model.rotation.z = 5 / 6 * Math.PI;
  animate();
});

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


document.addEventListener("keydown", next);
function next(e) {
  if (e.key == 'ArrowRight') {
    let rotation = model.rotation.z;
    remove();
      loader.load("models/" + models[++currentModel%models.length] + "/scene.gltf", function (gltf) {
        scene.add(gltf.scene);
        model = gltf.scene.children[0];
        model.rotation.z = rotation;
      });   
}
}

document.addEventListener("keydown", prev);
function prev(e) {
  if (e.key == 'ArrowLeft') {
    let rotation = model.rotation.z;
    remove();
      loader.load("models/" + models[--currentModel%models.length] + "/scene.gltf", function (gltf) {
        scene.add(gltf.scene);
        model = gltf.scene.children[0];
        model.rotation.z = rotation;
      });   
}
}


const stop = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}




