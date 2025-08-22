export default {
  namespaced:true,
  mutations :{
    receiveSceneAll(state, payload) {
      const { scene, camera, controls, clippingPlane, renderer } = payload;
      state.scene = scene;
      state.camera = camera;
      state.controls = controls;
      state.clippingPlane = clippingPlane;
      state.renderer = renderer;
    },

    sceneAdd(state, physics) {
      state.scene.add(physics)
    },

    sceneRemove(state, physics) {
      state.scene.remove(physics)
    },

    addaTennisBall(state, tennisBall) {
      state.tennisBall = tennisBall;
      state.scene.add(tennisBall);
    },

    stopTennisBall(state, lastPoint) {
      state.tennisBall.position.copy(lastPoint);
      // 重置旋转
      state.tennisBall.rotation.set(0, 0, 0);
    },

    updateTennisBall(state, payload) {
      const { p1, p2, progress } = payload;
      state.tennisBall.position.lerpVectors(p1, p2, progress);
    },

    rotateTennisBall(state, payload) {
      const { rotationAxis, rotationSpeed, pointIndex } = payload;
      // 应用旋转
      state.tennisBall.rotateOnWorldAxis(rotationAxis, rotationSpeed);

      // 添加额外旋转效果
      state.tennisBall.rotation.y += 0.01;
      state.tennisBall.rotation.x += 0.005;

      // 特殊区域添加Z轴旋转
      if (pointIndex >= 10 && pointIndex <= 15) {
        state.tennisBall.rotation.z += 0.02;
      }

      // 限制旋转角度（防止过度旋转）
      state.tennisBall.rotation.x = state.tennisBall.rotation.x % (Math.PI * 2);
      state.tennisBall.rotation.y = state.tennisBall.rotation.y % (Math.PI * 2);
      state.tennisBall.rotation.z = state.tennisBall.rotation.z % (Math.PI * 2);
    },

    collidedTennisBall(state, isCollided) {
      state.tennisBall.userData.hasCollided = isCollided;
    },

    updateControls(state) {
      state.controls.update();
    },

    setClippingPlane(state, payload) {
      const { normal, planePosition } = payload;
      state.clippingPlane.setFromNormalAndCoplanarPoint(normal, planePosition);
    },

    receiveTennisBallShadow(state, tennisBallShadow) {
      state.tennisBallShadow = tennisBallShadow;
    },

    updateTennisBallShadow(state, payload) {
      const { shadowOpacity, shadowScale } = payload;
      state.tennisBallShadow.position.x = state.tennisBall.position.x;
      state.tennisBallShadow.position.z = state.tennisBall.position.z;
      state.tennisBallShadow.material.opacity = shadowOpacity;
      state.tennisBallShadow.scale.set(shadowScale, shadowScale, shadowScale);
    },

    updateControlsByTarget(state, landingPoint) {
      state.controls.target.copy(landingPoint);
      state.controls.update();
    },

    updateCameraByTarget(state, payload) {
      const { basePosition, landingPoint } = payload;
      state.camera.position.copy(basePosition);
      state.camera.lookAt(landingPoint);
    },

    rendererScene(state) {
      state.renderer.render(state.scene, state.camera);
    },
  },

  getters : {
    getScene(state) {
      return state.scene
    },

    getRenderer(state) {
      return state.renderer
    },
  },

  state : {
    scene: null,
    tennisBall: null,
    controls: null,
    renderer: null,
    camera: null,
    clippingPlane: null,
    tennisBallShadow: null,
  }

}