import * as three from 'three';
// @ts-ignore
import * as firstPerson from './src/firstPerson.ts'

const scene = new three.Scene();

const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.LineBasicMaterial({ color: 0xff0000 });
const line = new three.Line(geometry, material);
scene.add(line);
scene.add((new three.Line(geometry, material)).translateZ(1))
scene.add((new three.Line(geometry, material)).translateX(1))
scene.add((new three.Line(geometry, material)).translateY(1))

const clock = new three.Clock();
const moveSpeed = 5; // movement units per second

firstPerson.setupPointerLock(camera, canvas);
firstPerson.handleWindowResizing(camera, renderer);
firstPerson.setupKeyListeners();

renderer.setAnimationLoop(animate);

function animate() {
    const delta = clock.getDelta(); // seconds since last frame

    const forwardVector = new three.Vector3(0, 0, -1);
    const rightVector   = new three.Vector3(1, 0,  0);
    forwardVector.applyQuaternion(camera.quaternion);
    rightVector.applyQuaternion(camera.quaternion);

    // If you want typical FPS (no vertical movement), uncomment:
    // forwardVector.y = 0;
    // rightVector.y = 0;
    // forwardVector.normalize();
    // rightVector.normalize();

    const actualSpeed = moveSpeed * delta;
    if (firstPerson.pressedKeys.w) camera.position.addScaledVector(forwardVector,  actualSpeed);
    if (firstPerson.pressedKeys.s) camera.position.addScaledVector(forwardVector, -actualSpeed);
    if (firstPerson.pressedKeys.a) camera.position.addScaledVector(rightVector,   -actualSpeed);
    if (firstPerson.pressedKeys.d) camera.position.addScaledVector(rightVector,    actualSpeed);

    renderer.render(scene, camera);
}
