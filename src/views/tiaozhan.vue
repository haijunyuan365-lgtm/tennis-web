<template>
  <div id="app">
    <Test :receiveInitialTrajectoryPoints="receiveInitialTrajectoryPoints" :receiveRealOut="receiveRealOut"
      :receiveDistance="receiveDistance" />
    <Scene />
    <Physics :initialTrajectoryPoints="initialTrajectoryPoints" :realOut="realOut" :distance="distance"
      :receiveTrajectoryPoints="receiveTrajectoryPoints" @createDirectionalEllipse="receiveDirectionalEllipse" />
    <Animation :trajectoryPoints="trajectoryPoints" :createDirectionalEllipse="createDirectionalEllipse" />

  </div>
</template>

<script>
import Scene from '@/components/Scene'
import Physics from '@/components/Physics';
import Animation from '@/components/Animation';
import Test from '@/components/Test';

export default {
  name: 'App',
  components: {
    Scene,
    Physics,
    Animation,
    Test,
  },
  data() {
    return {
      trajectoryPoints: [],
      passedCoordinatesCount: 0,
      initialTrajectoryPoints: [],
      realOut: false,
      distance: 0,

      createDirectionalEllipse: null,

    }
  },
  methods: {
    receiveTrajectoryPoints(trajectoryPoints) {
      console.log('父组件接收到 trajectoryPoints 对象:', trajectoryPoints);
      this.trajectoryPoints = trajectoryPoints;
    },
    receiveDirectionalEllipse(method) {
      console.log('父组件接收到 method 对象:', method);
      this.createDirectionalEllipse = method
    },
    receiveInitialTrajectoryPoints(initialTrajectoryPoints) {
      console.log('父组件接收到 initialTrajectoryPoints 对象:', initialTrajectoryPoints);
      this.initialTrajectoryPoints = initialTrajectoryPoints;
    },
    receiveRealOut(realOut) {
      console.log('父组件接收到 realOut 对象:', realOut);
      this.realOut = realOut;
    },
    receiveDistance(distance) {
      console.log('父组件接收到 distance 对象:', distance);
      this.distance = distance;
    },

  }
}
</script>

<style>
#app{
  width: 100%;
}
</style>
