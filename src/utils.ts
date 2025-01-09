import * as three from "three";
import {markRaw} from "vue";
import {NoiseGenerator} from "./NoiseGenerator";

export const createCamera = (): three.PerspectiveCamera => {
    let camera = new three.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    camera.position.y = 250

    return camera;
}

export const createRenderer = (): three.WebGLRenderer => {
    const renderer = new three.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}

export const createSceneWithLightAndSkybox = (): three.Scene => {
    let scene = markRaw(new three.Scene());
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