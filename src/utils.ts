import * as three from "three";
import {NoiseGenerator} from "./NoiseGenerator";

export const createCamera = (): three.PerspectiveCamera => {
    let camera = new three.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    camera.position.z = 250;
    camera.position.y = 250

    return camera;
}

export const createRenderer = (): three.WebGLRenderer => {
    const renderer = new three.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}

export const createSceneWithLightAndSkybox = (): three.Scene => {
    let scene = new three.Scene();
    scene.add(new three.AmbientLight(0xffffff, 1))
    scene.background = new three.CubeTextureLoader().load([
        'assets/skyboxes/day/Daylight_Box_Right.png',  // +X
        'assets/skyboxes/day/Daylight_Box_Left.png',   // -X
        'assets/skyboxes/day/Daylight_Box_Top.png',     // +Y
        'assets/skyboxes/day/Daylight_Box_Bottom.png',   // -Y
        'assets/skyboxes/day/Daylight_Box_Front.png',  // +Z
        'assets/skyboxes/day/Daylight_Box_Back.png',   // -Z
    ]);
    return scene;
}

export const newDisplacementMap = (): three.DataTexture => {
    let displacementMap = (new NoiseGenerator()).generateTexture();
    displacementMap.wrapS = displacementMap.wrapT = three.ClampToEdgeWrapping;
    displacementMap.repeat.set(1, 1)

    return displacementMap
}

// export const initGroundMesh = (scene: three.Scene,): void => {
//     const groundGeometry = new three.PlaneGeometry(500, 500, 100, 100);
//
//     const groundMesh = new three.Mesh(groundGeometry, groundMaterial)
//     groundMesh.rotation.x = -Math.PI / 2;
//     groundMesh.position.y = -0.5;
//     scene.add(groundMesh)
// }