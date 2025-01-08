import * as three from 'three';
import {AmbientLight} from 'three';
import * as firstPerson from './src/firstPerson'
import {NoiseGenerator} from "./src/NoiseGenerator";

const scene = new three.Scene();
scene.add(new AmbientLight(0xffffff, 1))

const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.position.y = 250

const cubeTexture = new three.CubeTextureLoader().load([
    'assets/skyboxes/day/Daylight_Box_Right.png',  // +X
    'assets/skyboxes/day/Daylight_Box_Left.png',   // -X
    'assets/skyboxes/day/Daylight_Box_Top.png',     // +Y
    'assets/skyboxes/day/Daylight_Box_Bottom.png',   // -Y
    'assets/skyboxes/day/Daylight_Box_Front.png',  // +Z
    'assets/skyboxes/day/Daylight_Box_Back.png',   // -Z
]);
scene.background = cubeTexture;

const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ground geometry
const groundGeometry = new three.PlaneGeometry(500, 500, 100, 100);
let displacementMap = (new NoiseGenerator()).generateTexture();

displacementMap.wrapS = displacementMap.wrapT = three.RepeatWrapping;
displacementMap.repeat.set(1, 1)
const groundMaterial = new three.MeshStandardMaterial({
    color: 0x0,
    wireframe: true,
    displacementMap: displacementMap,
    displacementScale: 500
})
const groundMesh = new three.Mesh(groundGeometry, groundMaterial)
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -0.5;
scene.add(groundMesh)
// =============================

firstPerson.setupPointerLock(camera, renderer.domElement);
firstPerson.handleWindowResizing(camera, renderer);
firstPerson.setupKeyListeners();

renderer.setAnimationLoop(animate);

const clock = new three.Clock();

function animate(): void {
    firstPerson.handleMovement(camera, clock);

    renderer.render(scene, camera);
}
