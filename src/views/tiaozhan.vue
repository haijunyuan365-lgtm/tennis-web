<template>
  <div id="app">
    <Test :receiveInitialTrajectoryPoints="receiveInitialTrajectoryPoints" :receiveRealOut="receiveRealOut" />

    <Scene :receiveScene="receiveScene" :receiveCamera="receiveCamera" :receiveControls="receiveControls"
      :receiveRenderer="receiveRenderer" :receiveClippingPlane="receiveClippingPlane" />
    <Physics :scene="scene" :controls="controls" :camera="camera" :clippingPlane="clippingPlane"
      :passedCoordinatesCount="passedCoordinatesCount" :initialTrajectoryPoints="initialTrajectoryPoints"
      :realOut="realOut" :receiveTrajectoryPoints="receiveTrajectoryPoints" :receiveTennisBall="receiveTennisBall"
      :receiveFullTrajectoryMesh="receiveFullTrajectoryMesh" :receiveTennisBallShadow="receiveTennisBallShadow"
      @createDirectionalEllipse="receiveDirectionalEllipse" />
    <Animation :trajectoryPoints="this.trajectoryPoints" :tennisBall="this.tennisBall" :renderer="this.renderer"
      :scene="this.scene" :controls="this.controls" :camera="this.camera" :fullTrajectoryMesh="this.fullTrajectoryMesh"
      :clippingPlane="this.clippingPlane" :tennisBallShadow="this.tennisBallShadow"
      :createDirectionalEllipse="createDirectionalEllipse"
      :receivePassedCoordinatesCount="receivePassedCoordinatesCount" />

  </div>
</template>

<script>
import Scene from '@/components/Scene'
import Physics from '@/components/Physics';
import Animation from '@/components/Animation';
import Test from '@/components/Test';

export default {
  name: 'TiaoZhuan',
  components: {
    Scene,
    Physics,
    Animation,
    Test,
  },
  data() {
    return {
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      trajectoryPoints: [],
      tennisBall: null,
      fullTrajectoryMesh: null,
      clippingPlane: null,
      tennisBallShadow: null,
      passedCoordinatesCount: 0,
      initialTrajectoryPoints: [],
      realOut: false,

      createDirectionalEllipse: null,

    }
  },
  methods: {
    receiveScene(scene) {
      console.log('父组件接收到 scene 对象:', scene);
      this.scene = scene;
    },
    receiveCamera(camera) {
      console.log('父组件接收到 camera 对象:', camera);
      this.camera = camera;
    },
    receiveControls(controls) {
      console.log('父组件接收到 Controls 对象:', controls);
      this.controls = controls;
    },
    receiveTrajectoryPoints(trajectoryPoints) {
      console.log('父组件接收到 trajectoryPoints 对象:', trajectoryPoints);
      this.trajectoryPoints = trajectoryPoints;
    },
    receiveTennisBall(tennisBall) {
      console.log('父组件接收到 tennisBall 对象:', tennisBall);
      this.tennisBall = tennisBall;
    },
    receiveRenderer(renderer) {
      console.log('父组件接收到 renderer 对象:', renderer);
      this.renderer = renderer;
    },
    receiveFullTrajectoryMesh(fullTrajectoryMesh) {
      console.log('父组件接收到 fullTrajectoryMesh 对象:', fullTrajectoryMesh);
      this.fullTrajectoryMesh = fullTrajectoryMesh;
    },
    receiveClippingPlane(clippingPlane) {
      console.log('父组件接收到 clippingPlane 对象:', clippingPlane);
      this.clippingPlane = clippingPlane;
    },
    receiveTennisBallShadow(tennisBallShadow) {
      console.log('父组件接收到 tennisBallShadow 对象:', tennisBallShadow);
      this.tennisBallShadow = tennisBallShadow;
    },
    receiveDirectionalEllipse(method) {
      console.log('父组件接收到 method 对象:', method);
      this.createDirectionalEllipse = method
    },
    receivePassedCoordinatesCount(passedCoordinatesCount) {
      console.log('父组件接收到 passedCoordinatesCount 对象:', passedCoordinatesCount);
      this.passedCoordinatesCount = passedCoordinatesCount
    },
    receiveInitialTrajectoryPoints(initialTrajectoryPoints) {
      console.log('父组件接收到 initialTrajectoryPoints 对象:', initialTrajectoryPoints);
      this.initialTrajectoryPoints = initialTrajectoryPoints;
    },
    receiveRealOut(realOut) {
      console.log('父组件接收到 realOut 对象:', realOut);
      this.realOut = realOut;
    },

  }
}
</script>

<style>
#app {
  width: 100%;
}
</style>
