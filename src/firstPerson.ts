import * as three from "three";

let moveSpeed: number = 50; // movement units per second
let yaw: number = 0;
let pitch: number = 0;

export const pressedKeys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'shift': false,
};

export function setupPointerLock(
    camera: three.PerspectiveCamera,
    canvas: HTMLCanvasElement): void {
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock().then(r => r);
    }, false);

    const onPointerMove = (event: any) => {
        //    Note: movementX > 0 => move mouse to the right => yaw should decrease
        //          movementY > 0 => move mouse down => pitch should go down
        yaw -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;

        const halfPi = Math.PI / 2;
        pitch = Math.max(-halfPi, Math.min(halfPi, pitch));

        const euler = new three.Euler(pitch, yaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    };

    const onPointerLockChange = () => {
        document.pointerLockElement === canvas
            ? document.addEventListener('mousemove', onPointerMove, false)
            : document.removeEventListener('mousemove', onPointerMove, false);
    };

    document.addEventListener('pointerlockchange', onPointerLockChange, false);
}

export function handleWindowResizing(
    camera: three.PerspectiveCamera,
    renderer: three.WebGLRenderer
): void {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

export function setupKeyListeners(): void {
    window.addEventListener(
        'keydown',
        (event: KeyboardEvent) => pressedKeys[event.key.toLowerCase()] = true
    );
    window.addEventListener(
        'keyup',
        (event: KeyboardEvent) => pressedKeys[event.key.toLowerCase()] = false
    );
}

export function handleMovement(camera: three.Camera, clock: three.Clock) {
    const delta = clock.getDelta(); // seconds since last frame

    const forwardVector = new three.Vector3(0, 0, -1);
    const rightVector = new three.Vector3(1, 0, 0);
    forwardVector.applyQuaternion(camera.quaternion);
    rightVector.applyQuaternion(camera.quaternion);

    if (pressedKeys.shift) {
        moveSpeed = 250;
    } else {
        moveSpeed = 50;
    }

    const actualSpeed = moveSpeed * delta;
    if (pressedKeys.w) {
        camera.position.addScaledVector(forwardVector, actualSpeed);
    }

    if (pressedKeys.s) {
        camera.position.addScaledVector(forwardVector, -actualSpeed);
    }

    if (pressedKeys.a) {
        camera.position.addScaledVector(rightVector, -actualSpeed);
    }

    if (pressedKeys.d) {
        camera.position.addScaledVector(rightVector, actualSpeed);
    }
}