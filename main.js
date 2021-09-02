import "./style.css";
import * as THREE from "three";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { Camera } from "three";

/*Loading Screen
var loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
  box: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x4444ff })
  ),
};
var loadingManager = null;
var RESOURCES_LOADED = false;
*/

//Set-Up
const scene = new THREE.Scene();
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 400000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const canvas = document.querySelector("#bg");

const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.setZ(-5);
camera.position.setX(1300);

/*loadingScreen.box.position.set(0, 0, 5);
loadingScreen.camera.lookAt(loadingScreen.box.position);
loadingScreen.scene.add(loadingScreen.box);
*/

const onTransitionEnd = (event) => {
  event.target.remove();
};

const loadingManager = new THREE.LoadingManager(() => {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.add("fade-out");

  // optional: remove loader from DOM via event listener
  loadingScreen.addEventListener("transitionend", onTransitionEnd);
});

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//Lights
const pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadow.bias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const light = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(pointLight, light);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;
controls.update();

//Solar System
const spaceTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/nasa.jpg"
);
scene.background = spaceTexture;

//Sun
const sunTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/sun.jpg"
);
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1000, 100, 100),
  new THREE.MeshStandardMaterial({ map: sunTexture })
);

sun.position.set(0, 0, 0);
scene.add(sun);

//Mercury
const mercuryTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/mercury.jpg"
);
const normalTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/normal.jpg"
);
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({
    map: mercuryTexture,
    normalMap: normalTexture,
  })
);

const mercuryDistance = 4100;

mercury.position.setX(mercuryDistance);
scene.add(mercury);

//Venus
const venusTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/venus.jpg"
);
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(8.6, 32, 32),
  new THREE.MeshStandardMaterial({
    map: venusTexture,
    normalMap: normalTexture,
  })
);

const venusDistance = 7700;

venus.position.setX(venusDistance);
scene.add(venus);

//Earth
const earthTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/earth.jpg"
);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(9, 62, 62),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);

const earthDistance = 10600;

earth.position.setX(earthDistance);
earth.rotation.x = -0.3;
scene.add(earth);

//Moon
const moonTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/moon.jpg"
);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

moon.receiveShadow = true;
moon.castShadow = true;
moon.layers.set(0);

const moonDistance = 27;

moon.position.setX(moonDistance);
scene.add(moon);

const moonPivot = new THREE.Object3D();
earth.add(moonPivot);
moonPivot.add(moon);

//Mars
const marsTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/mars.jpg"
);
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(4.8, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  })
);

const marsDistance = 16200;

mars.position.setX(marsDistance);
scene.add(mars);

//Jupiter
const jupiterTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/jupiter.jpg"
);
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(102, 32, 32),
  new THREE.MeshStandardMaterial({
    map: jupiterTexture,
  })
);

jupiter.position.set(55000, 0, 0);
scene.add(jupiter);

//Saturn
const saturnTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/saturn.jpg"
);
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(85, 32, 32),
  new THREE.MeshStandardMaterial({
    map: saturnTexture,
  })
);

const ringTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/rings.jpg"
);
const aRing = new THREE.Mesh(
  new THREE.RingGeometry(95, 110, 200),
  new THREE.MeshStandardMaterial({ map: ringTexture, side: THREE.DoubleSide })
);

const bRing = new THREE.Mesh(
  new THREE.RingGeometry(111, 125, 200),
  new THREE.MeshStandardMaterial({ map: ringTexture, side: THREE.DoubleSide })
);

saturn.position.set(102000, 0, 0);
aRing.position.set(102000, 0, 0);
aRing.rotation.x = 1.5;
bRing.position.set(102000, 0, 0);
bRing.rotation.x = 1.5;
scene.add(saturn, aRing, bRing);

//Uranus
const uranusTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/uranus.jpg"
);
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(36, 32, 32),
  new THREE.MeshStandardMaterial({
    map: uranusTexture,
  })
);

uranus.position.set(205000, 0, 0);
scene.add(uranus);

//Neptune
const neptuneTexture = new THREE.TextureLoader(loadingManager).load(
  "./resources/neptune.jpg"
);
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(35, 32, 32),
  new THREE.MeshStandardMaterial({
    map: neptuneTexture,
  })
);

neptune.position.set(320000, 0, 0);
scene.add(neptune);

//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//On Click Functions

const cameraPivot = new THREE.Object3D();
sun.add(cameraPivot);
cameraPivot.add(camera);

document.getElementById("sun").addEventListener("click", (e) => {
  e.preventDefault();
  sun.add(cameraPivot);
  camera.position.setX(2000);
  camera.position.setZ(-5);
});

document.getElementById("mercury").addEventListener("click", (e) => {
  e.preventDefault();
  mercury.add(cameraPivot);
  camera.position.setX(8);
  camera.position.setZ(-2);
});

document.getElementById("venus").addEventListener("click", (e) => {
  e.preventDefault();
  venus.add(cameraPivot);
  camera.position.setX(17.2);
  camera.position.setZ(-5);
});

document.getElementById("earth").addEventListener("click", (e) => {
  e.preventDefault();
  earth.add(cameraPivot);
  camera.position.setX(18);
  camera.position.setZ(-5);
});

document.getElementById("mars").addEventListener("click", (e) => {
  e.preventDefault();
  mars.add(cameraPivot);
  camera.position.setX(9.6);
  camera.position.setZ(-2);
});

document.getElementById("jupiter").addEventListener("click", (e) => {
  e.preventDefault();
  jupiter.add(cameraPivot);
  camera.position.setX(204);
  camera.position.setZ(-10);
});

document.getElementById("saturn").addEventListener("click", (e) => {
  e.preventDefault();
  saturn.add(cameraPivot);
  camera.position.setX(170);
  camera.position.setZ(-10);
});

document.getElementById("uranus").addEventListener("click", (e) => {
  e.preventDefault();
  uranus.add(cameraPivot);
  camera.position.setX(72);
  camera.position.setZ(-15);
});

document.getElementById("neptune").addEventListener("click", (e) => {
  e.preventDefault();
  neptune.add(cameraPivot);
  camera.position.setX(70);
  camera.position.setZ(-15);
});

//Animate
const animate = () => {
  /*if (RESOURCES_LOADED == false) {
    requestAnimationFrame(animate);

    loadingScreen.box.position.x -= 0.05;
    if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
    loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

    renderer.render(loadingScreen.scene, loadingScreen.camera);
    return;
  }
  */
  requestAnimationFrame(animate);

  cameraPivot.rotation.y += 0.001;

  sun.rotation.y += 0.01;
  sun.rotation.x += 0.01;

  mercury.rotation.y += 0.005;

  venus.rotation.y += 0.003;

  earth.rotation.y += 0.003;

  moonPivot.rotation.y -= 0.004;
  moonPivot.rotation.x += 0.0001;

  mars.rotation.y += 0.001;

  jupiter.rotation.y += 0.002;

  saturn.rotation.y += 0.002;

  uranus.rotation.y += 0.002;

  neptune.rotation.y += 0.002;

  bloomComposer.render();
  renderer.render(scene, camera);
};

animate();
