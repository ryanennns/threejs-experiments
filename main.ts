import * as three from 'three';
import * as firstPerson from './src/firstPerson'
import {Block, Dirt} from './src/types'
import {AmbientLight, DirectionalLight} from "three";
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

const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

const block = new Dirt();
const thing = block.getInstance();
console.log(thing)
scene.add(thing);
scene.add((block.getInstance()).translateZ(1))
scene.add((block.getInstance()).translateX(1))
scene.add((block.getInstance()).translateY(1))

const clock = new three.Clock();

firstPerson.setupPointerLock(camera, canvas);
firstPerson.handleWindowResizing(camera, renderer);
firstPerson.setupKeyListeners();

renderer.setAnimationLoop(animate);

function animate() {
    handleMovement(camera, clock);

    renderer.render(scene, camera);
}
