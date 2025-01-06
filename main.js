import * as three from 'three';

const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new three.BoxGeometry(1, 1, 1);
const lineBasicMaterial = new three.LineBasicMaterial({color: 0xff0000})
const line = new three.Line(geometry, lineBasicMaterial);
scene.add(line)

let counter = 0;
let direction = true;

function animate() {
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;

    if (counter % 250 === 0) {
        direction = !direction;
    }

    // direction ? line.position.y += 0.01 : line.position.y -= 0.01;

    counter++;

    renderer.render(scene, camera);
}

const onKeyDown = (event) => {
    const keyCode = event.keyCode;
    switch (keyCode) {
        case 87:
            camera.position.z -= 1;
            break;
        case 65:
            camera.position.x -= 1;
            break;
        case 83:
            camera.position.z += 1;
            break;
        case 68:
            camera.position.x += 1;
            break;
    }
}
window.addEventListener("keydown", onKeyDown, false);
