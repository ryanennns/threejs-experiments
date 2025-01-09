<script setup lang="ts">
import {markRaw, onMounted, onUpdated, ref} from "vue";
import {Ref} from "vue";
import * as three from 'three';
import * as firstPerson from './src/firstPerson'
import {NoiseGenerator} from "./src/NoiseGenerator";

const clock = new three.Clock();
const threejsMountPoint: Ref<HTMLElement | null> = ref(null);
const noiseImage: Ref<HTMLImageElement | null> = ref(null);
let scene = markRaw(new three.Scene());
let camera = markRaw(new three.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
));
camera.position.z = 5;
camera.position.y = 250
const renderer = markRaw(new three.WebGLRenderer({antialias: true}));

const displacementScale: Ref<number> = ref(1)

onMounted(() => {
  scene.add(new three.AmbientLight(0xffffff, 1))
  scene.background = new three.CubeTextureLoader().load([
    'assets/skyboxes/day/Daylight_Box_Right.png',  // +X
    'assets/skyboxes/day/Daylight_Box_Left.png',   // -X
    'assets/skyboxes/day/Daylight_Box_Top.png',     // +Y
    'assets/skyboxes/day/Daylight_Box_Bottom.png',   // -Y
    'assets/skyboxes/day/Daylight_Box_Front.png',  // +Z
    'assets/skyboxes/day/Daylight_Box_Back.png',   // -Z
  ]);

  renderer.setSize(window.innerWidth, window.innerHeight);
  threejsMountPoint.value.appendChild(renderer.domElement);

  createGroundMesh()

  firstPerson.setupPointerLock(camera, renderer.domElement);
  firstPerson.handleWindowResizing(camera, renderer);
  firstPerson.setupKeyListeners();

  renderer.setAnimationLoop(animate);
})

onUpdated(() => {
  groundMaterial.displacementScale = displacementScale.value * 5
})

function animate(): void {
  firstPerson.handleMovement(camera, clock);

  renderer.render(scene, camera);
}

const refreshDisplacementMap = () => {
  let displacementMap = newDisplacementMap();
  groundMaterial.displacementMap = displacementMap
  let s = URL.createObjectURL(
      new Blob([displacementMap.image.data.buffer],
          {type: 'image'}));
  noiseImage.value.src = s
}

const newDisplacementMap = () => {
  let displacementMap = (new NoiseGenerator()).generateTexture();
  displacementMap.wrapS = displacementMap.wrapT = three.RepeatWrapping;
  displacementMap.repeat.set(1, 1)

  return displacementMap
}

const groundMaterial = new three.MeshStandardMaterial({
  color: 0x0,
  wireframe: true,
  displacementMap: newDisplacementMap(),
  displacementScale: 0
})

const createGroundMesh = () => {
  const groundGeometry = new three.PlaneGeometry(500, 500, 100, 100);

  const groundMesh = new three.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;
  scene.add(groundMesh)
}

</script>

<template>
  <div style="position: fixed;">
    <img ref="noiseImage" alt="noise"/>
    <input type="range" v-model="displacementScale">
    <input type="button" @click="refreshDisplacementMap">
  </div>
  <div ref="threejsMountPoint"></div>
</template>

<style scoped>

</style>