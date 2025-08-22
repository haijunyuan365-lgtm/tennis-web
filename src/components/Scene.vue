<template>
  <div id="container">
    <div ref="rendererContainer" id="canvas-container"></div>
    <Controls :receiveIsAnimating="receiveIsAnimating" />
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Controls from './Controls';

export default {
  components: {
    Controls,
  },

  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      clippingPlane: null,

      isAnimating: true,

      constants: {
        LIGHT_DIRECTION: new THREE.Vector3(15, 20, 10).normalize(),
      }
    };
  },
  mounted() {
    this.initScene();
  },

  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB);
      // this.scene.fog = new THREE.Fog(0x87CEEB, 15, 35);

      // 创建相机
      const container = this.$refs.rendererContainer;
      this.camera = new THREE.PerspectiveCamera(
        65,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.localClippingEnabled = true;
      container.appendChild(this.renderer.domElement);

      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.minDistance = 0.1;
      this.controls.maxDistance = 300;
      this.controls.target.set(0, 0, 10);

      // 初始化裁剪平面
      this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), -100);

      // 添加光源
      this.addLights();

      // // 添加云朵背景
      // this.addClouds();

      // 加载网球场模型
      this.loadTennisCourtModel();

      // 设置相机初始位置
      this.camera.position.set(0, 5, 15);

      //存入store中
      this.$store.commit("hawkeye/receiveSceneAll", {
        scene: this.scene,
        camera: this.camera,
        controls: this.controls,
        renderer: this.renderer,
        clippingPlane: this.clippingPlane,
      });

    },

    // 添加光源
    addLights() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x404040, 20.0);
      this.scene.add(ambientLight);

      // 方向光（主光源）
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.3);
      directionalLight.position.copy(this.constants.LIGHT_DIRECTION.clone().multiplyScalar(100));
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      this.scene.add(directionalLight);

      // 辅助光
      const fillLight = new THREE.DirectionalLight(0x88CCFF, 0.4);
      fillLight.position.set(-15, 20, -10);
      this.scene.add(fillLight);
    },

    // 添加云朵背景
    addClouds() {
      const cloudGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9
      });

      for (let i = 0; i < 8; i++) {
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
          -15 + Math.random() * 30,
          20 + Math.random() * 10,
          -40 + Math.random() * 20
        );
        cloud.scale.set(1 + Math.random() * 2, 0.8, 1);
        this.scene.add(cloud);
      }
    },

    loadTennisCourtModel() {
      // GLTF 加载器 - 网球场
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('/models/grd.glb', (gltf) => {
        const court = gltf.scene;
        court.position.set(0, 0, 0);
        court.rotation.x = -Math.PI / 2;
        this.scene.add(court);

        court.traverse((child) => {
          if (child.isMesh) {
            child.material.roughness = 0.7;
            child.receiveShadow = true;
            child.castShadow = false;
            child.material.needsUpdate = true;
          }
        });
      }, undefined, (error) => {
        console.error('网球场加载错误:', error);
      });

      // OBJ 加载器 - 球网
      const objLoader = new OBJLoader();
      objLoader.load('/models/tennisweb.obj', (object) => {
        object.position.set(1.5, 0, 0);
        object.scale.set(0.8, 0.45, 0.4);

        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x444444,
              side: THREE.DoubleSide
            });
            child.receiveShadow = true;
            child.castShadow = false;
            child.material.needsUpdate = true;
          }
        });

        this.scene.add(object);
      }, undefined, (error) => {
        console.error('球网加载错误:', error);
      });
    },

    receiveIsAnimating(isAnimating) {
      this.isAnimating = isAnimating
    },

    onWindowResize() {
      const container = this.$refs.rendererContainer;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },


  },

  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    // 清理资源
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
  },
};
</script>

<style scoped>
#container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>