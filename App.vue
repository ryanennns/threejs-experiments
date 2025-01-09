<script setup lang="ts">
import {onMounted, onUpdated, ref} from "vue";
import {Ref} from "vue";
import * as three from 'three';
import * as firstPerson from './src/firstPerson'
import * as utils from "./src/utils";

const clock = new three.Clock();

const threejsMountPoint: Ref<HTMLElement | null> = ref(null);
const noiseImage: Ref<HTMLImageElement | null> = ref(null);

const displacementScale: Ref<number> = ref(1)

const scene = utils.createSceneWithLightAndSkybox();
const camera = utils.createCamera();
const renderer = utils.createRenderer();

onMounted(() => {
  threejsMountPoint.value.appendChild(renderer.domElement);

  firstPerson.setupPointerLock(camera, renderer.domElement);
  firstPerson.handleWindowResizing(camera, renderer);
  firstPerson.setupKeyListeners();

  initGroundMesh()
  renderer.setAnimationLoop(animate);
})

onUpdated(() => {
  groundMaterial.displacementScale = displacementScale.value
})

const animate = (): void => {
  firstPerson.handleMovement(camera, clock);

  renderer.render(scene, camera);
}

const refreshDisplacementMap = (): void => {
  let displacementMap = utils.newDisplacementMap();
  groundMaterial.displacementMap = displacementMap
  // failed attempt at creating image
  // let s = URL.createObjectURL(
  //     new Blob([displacementMap.image.data.buffer],
  //         {type: 'image'})
  // );
  // noiseImage.value.src = s
}

const groundMaterial = new three.MeshStandardMaterial({
  color: 0x0,
  wireframe: true,
  displacementMap: utils.newDisplacementMap(),
})

const initGroundMesh = (): void => {
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
    <input type="range" min="-750" max="750" value="0" v-model="displacementScale">
    <input type="button" @click="refreshDisplacementMap" value="refresh">
  </div>
  <div ref="threejsMountPoint"></div>
</template>

<style scoped>

</style>