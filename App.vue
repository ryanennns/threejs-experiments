<script setup lang="ts">
import {onMounted, onUpdated, ref} from "vue";
import {Ref} from "vue";
import * as three from 'three';
import * as firstPerson from './src/firstPerson'
import * as utils from "./src/utils";
import GUI from "lil-gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const ui = new GUI()

const clock = new three.Clock();

const threejsMountPoint: Ref<HTMLElement | null> = ref(null);
const noiseImage: Ref<HTMLImageElement | null> = ref(null);
const displacementMapReference: Ref<three.DataTexture | null> = ref(null)

const displacementScale: Ref<number> = ref(1)

const scene = utils.createSceneWithLightAndSkybox();
const camera = utils.createCamera();
const renderer = utils.createRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.dampingFactor = 0.01;
orbitControls.enableDamping = true;
onMounted(() => {
  threejsMountPoint.value.appendChild(renderer.domElement);

  firstPerson.handleWindowResizing(camera, renderer);

  initGroundMesh()
  renderer.setAnimationLoop(animate);
})

onUpdated(() => {
  groundMaterial.displacementScale = displacementScale.value
})

const animate = (): void => {
  orbitControls.update()

  renderer.render(scene, camera);
}

const refreshDisplacementMap = (): void => {
  let displacementMap = utils.newDisplacementMap();
  displacementMapReference.value = displacementMap;
  groundMaterial.displacementMap = displacementMap
  // failed attempt at creating image
  // let s = URL.createObjectURL(
  //     new Blob([displacementMap.image.data.buffer],
  //         {type: 'image'})
  // );
  // noiseImage.value.src = s
}

let map = utils.newDisplacementMap();
displacementMapReference.value = map
const groundMaterial = new three.MeshStandardMaterial({
  color: 0x0,
  wireframe: true,
  displacementMap: map,
})

const initGroundMesh = (): void => {
  const groundGeometry = new three.PlaneGeometry(500, 500, 100, 100);

  const groundMesh = new three.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;
  scene.add(groundMesh)
}

ui.add(groundMaterial, 'displacementScale', -1000, 1000);
ui.add(displacementMapReference.value.repeat, 'x', -1, 1);
ui.add(displacementMapReference.value.repeat, 'y', -1, 1);

</script>

<template>
  <div style="position: fixed;">
    <input type="button" @click="refreshDisplacementMap" value="refresh">
  </div>
  <div ref="threejsMountPoint"></div>
</template>

<style scoped>

</style>