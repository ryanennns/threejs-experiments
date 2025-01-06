import * as three from 'three';
import * as firstPerson from './src/firstPerson'
import {Block, Dirt} from './src/types'
import {AmbientLight} from "three";
import {handleMovement} from "./src/firstPerson";

const scene = new three.Scene();
scene.add(new AmbientLight(0xffffff, 1))

const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const cubeTexture = new three.CubeTextureLoader().load([
    'assets/skyboxes/day/Daylight_Box_Right.png',  // +X
    'assets/skyboxes/day/Daylight_Box_Left.png',   // -X
    'assets/skyboxes/day/Daylight_Box_Top.png',     // +Y
    'assets/skyboxes/day/Daylight_Box_Bottom.png',   // -Y
    'assets/skyboxes/day/Daylight_Box_Front.png',  // +Z
    'assets/skyboxes/day/Daylight_Box_Back.png',   // -Z
]);
console.log(cubeTexture)
scene.background = cubeTexture;

const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

const block = new Dirt();
for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
        scene.add((block.getInstance()).translateZ(i).translateX(j).translateY(-5))
    }
}

const clock = new three.Clock();

firstPerson.setupPointerLock(camera, canvas);
firstPerson.handleWindowResizing(camera, renderer);
firstPerson.setupKeyListeners();

renderer.setAnimationLoop(animate);

function animate() {
    handleMovement(camera, clock);

    renderer.render(scene, camera);
}
