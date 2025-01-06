import * as three from 'three';

const scene = new three.Scene();

// ----- Camera -----
const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// ----- Renderer -----
const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

// ----- Scene Objects -----
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.LineBasicMaterial({color: 0xff0000});
const line = new three.Line(geometry, material);
scene.add(line);

let counter = 0;
let direction = true;

const clock = new three.Clock();
const moveSpeed = 5; // movement units per second

const pressedKeys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
};

setupPointerLock();
handleWindowResizing();
setupKeyListeners();

renderer.setAnimationLoop(animate);

function animate() {
    const delta = clock.getDelta(); // seconds since last frame

    // 1. Build forward/right vectors from camera orientation (each frame)
    const forwardVector = new three.Vector3(0, 0, -1);
    const rightVector = new three.Vector3(1, 0, 0);
    forwardVector.applyQuaternion(camera.quaternion);
    rightVector.applyQuaternion(camera.quaternion);

    // forwardVector.y = 0;
    // rightVector.y = 0;
    // forwardVector.normalize();
    // rightVector.normalize();

    const actualSpeed = moveSpeed * delta;
    if (pressedKeys.w) camera.position.addScaledVector(forwardVector, actualSpeed);
    if (pressedKeys.s) camera.position.addScaledVector(forwardVector, -actualSpeed);
    if (pressedKeys.a) camera.position.addScaledVector(rightVector, -actualSpeed);
    if (pressedKeys.d) camera.position.addScaledVector(rightVector, actualSpeed);

    if (counter % 250 === 0) {
        direction = !direction;
    }
    counter++;

    // 4. Render
    renderer.render(scene, camera);
}

function setupPointerLock() {
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    }, false);

    const onPointerMove = (event) => {
        // Rotate camera based on relative mouse movement
        const {movementX, movementY} = event;
        camera.rotation.y -= movementX * 0.002;
        camera.rotation.x -= movementY * 0.002;
    };

    const onPointerLockChange = () => {
        if (document.pointerLockElement === canvas) {
            document.addEventListener('mousemove', onPointerMove, false);
        } else {
            document.removeEventListener('mousemove', onPointerMove, false);
        }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange, false);
}

// ----- Window Resizing -----
function handleWindowResizing() {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

function setupKeyListeners() {
    window.addEventListener('keydown', (event) => pressedKeys[event.key.toLowerCase()] = true)
    window.addEventListener('keyup', (event) => pressedKeys[event.key.toLowerCase()] = false);
}
