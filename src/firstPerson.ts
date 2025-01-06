import * as three from "three";

// Store yaw & pitch in degrees or radians
let yaw = 0;
let pitch = 0;

export const pressedKeys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
};

export function setupPointerLock(
    camera: three.PerspectiveCamera,
    canvas: HTMLCanvasElement): void {
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    }, false);

    const onPointerMove = (event: any) => {
        // 1. Update yaw & pitch based on mouse movement
        //    Note: movementX > 0 => move mouse to the right => yaw should decrease
        //          movementY > 0 => move mouse down => pitch should go down
        yaw -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;

        // 2. Clamp the pitch between -90° and +90° (in radians)
        const halfPi = Math.PI / 2;
        pitch = Math.max(-halfPi, Math.min(halfPi, pitch));

        // 3. Reconstruct camera quaternion using Euler in 'YXZ' order
        const euler = new three.Euler(pitch, yaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
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