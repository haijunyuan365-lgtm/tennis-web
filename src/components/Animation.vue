<template>

</template>

<script>
import * as THREE from 'three'
export default {
  data() {
    return {
      isAnimating: true,
      currentPosition: 0,
      movementSpeed: 0.004,
      lastBallPosition: null,
      showBackTrail: true,
      lastBallY: 0,
      shadowMarks: [],
      passedCoordinatesCount: 0,

      constants: {
        BALL_RADIUS: 0.03175,
      }
    }
  },

  props: ['trajectoryPoints', 'createDirectionalEllipse'],

  computed: {
    renderer() {
      return this.$store.getters['hawkeye/getRenderer'];
    }
  },

  watch: {
    renderer(renderer) {
      if (renderer) {
        this.animate();
      }
    }
  },

  mounted() {
    this.$bus.$on("animation", (animation) => {
      this.isAnimating = animation;
    })
  },

  methods: {
    animate() {
      try {
        requestAnimationFrame(this.animate.bind(this));

        // 确保所有必要对象都存在
        if (!this.$store.state.hawkeye.controls || !this.$store.state.hawkeye.renderer || !this.$store.state.hawkeye.scene || !this.$store.state.hawkeye.camera) {
          console.warn("Animation skipped: missing required objects");
          return;
        }

        this.$store.commit("hawkeye/updateControls");

        if (this.isAnimating && this.trajectoryPoints.length > 1) {
          // 保存上一帧位置（在更新前）
          const previousPosition = this.lastBallPosition
            ? this.lastBallPosition.clone()
            : this.$store.state.hawkeye.tennisBall.position.clone();


          this.currentPosition += this.movementSpeed;


          if (this.currentPosition >= 1) {
            // 到达终点
            this.currentPosition = 1;
            const lastPoint = this.trajectoryPoints[this.trajectoryPoints.length - 1];
            this.isAnimating = false;

            this.$store.commit("hawkeye/stopTennisBall", lastPoint)
            // this.tennisBall.position.copy(lastPoint);
            // // 重置旋转
            // this.tennisBall.rotation.set(0, 0, 0);

            // 触发完成事件
            this.$emit('animation-complete');
          } else {
            // 计算当前点和进度
            const pointIndex = Math.floor(this.currentPosition * (this.trajectoryPoints.length - 1));
            const progress = (this.currentPosition * (this.trajectoryPoints.length - 1)) % 1;

            // 确保索引在有效范围内
            if (pointIndex >= this.trajectoryPoints.length - 1) {
              console.warn("Invalid point index:", pointIndex);
              return;
            }

            // 获取当前点和下一个点
            const p1 = this.trajectoryPoints[pointIndex];
            const p2 = this.trajectoryPoints[pointIndex + 1];


            // 改为传递单一payload对象
            this.$store.commit("hawkeye/updateTennisBall", {
              p1,           // THREE.Vector3 对象
              p2,           // THREE.Vector3 对象
              progress // 插值系数
            });
            // 更新网球位置
            // this.tennisBall.position.lerpVectors(p1, p2, progress);

            // 计算运动方向（用于旋转）
            const moveDirection = new THREE.Vector3().subVectors(p2, p1).normalize();

            // 计算旋转角度（基于运动方向）
            const rotationSpeed = 0.05;
            const rotationAxis = new THREE.Vector3();

            // 计算旋转轴（垂直于运动方向和上向量）
            rotationAxis.crossVectors(new THREE.Vector3(0, 1, 0), moveDirection).normalize();

            //应用球体旋转
            this.$store.commit("hawkeye/rotateTennisBall", {
              rotationAxis,
              rotationSpeed,
              pointIndex
            })

            // 更新阴影
            this.updateShadows();

            // 计算实际运动方向（从上一帧位置到当前位置）
            const actualDirection = new THREE.Vector3()
              .subVectors(this.$store.state.hawkeye.tennisBall.position, previousPosition)
              .normalize();

            const horizontalDirection = new THREE.Vector3(
              actualDirection.x,
              0,
              actualDirection.z
            ).normalize();

            // 更新裁剪平面
            this.updateClippingPlane(horizontalDirection);

            // 更新上一帧位置
            this.lastBallPosition = this.$store.state.hawkeye.tennisBall.position.clone();

            // 更新计数器
            if (pointIndex > this.passedCoordinatesCount) {
              this.passedCoordinatesCount = pointIndex;
              this.$emit('point-passed', pointIndex);
            }
          }
        }

        this.$store.commit("hawkeye/rendererScene");
      } catch (error) {
        console.error("Animation error:", error);
        this.isAnimating = false;
        this.$emit('animation-error', error);
      }
    },

    //更新裁剪平面
    updateClippingPlane(direction) {
      if (this.isAnimating && this.showBackTrail) {
        // 使用当前点作为基准，不使用历史路径点
        const currentPoint = this.$store.state.hawkeye.tennisBall.position.clone();

        // 设置裁剪平面位置
        const planePosition = new THREE.Vector3(
          currentPoint.x,
          currentPoint.y,
          currentPoint.z
        );
        // 反转法线方向
        const normal = direction.clone().negate().normalize();

        // 设置裁剪平面
        this.$store.commit("hawkeye/setClippingPlane", {
          normal,
          planePosition
        })
      }
    },

    // 更新阴影和碰撞检测
    updateShadows() {

      // 计算网球高度
      const ballHeight = this.$store.state.hawkeye.tennisBall.position.y - this.constants.BALL_RADIUS;

      // 计算垂直方向速度
      const verticalSpeed = this.$store.state.hawkeye.tennisBall.position.y - this.lastBallY;
      this.lastBallY = this.$store.state.hawkeye.tennisBall.position.y;

      // 更新阴影大小和不透明度
      const shadowScale = Math.max(0.5, 1.0 - ballHeight * 0.25);
      const shadowOpacity = Math.max(0.1, 0.3 - ballHeight * 0.1);


      // 更新阴影位置
      this.$store.commit("hawkeye/updateTennisBallShadow", {
        shadowOpacity,
        shadowScale,
      })

      // 检测碰撞并创建永久阴影
      if (ballHeight <= 0.001 && !this.$store.state.hawkeye.tennisBall.userData.hasCollided) {

        this.$store.commit("hawkeye/collidedTennisBall", true)
        // 使用上一帧位置计算方向
        const direction = new THREE.Vector3().subVectors(
          this.$store.state.hawkeye.tennisBall.position,
          this.lastBallPosition
        ).normalize();

        // 保存当前位置（移动前的原始位置）
        const originalPosition = this.$store.state.hawkeye.tennisBall.position.clone();

        // 打印调试信息
        console.log("球原始落地位置:", originalPosition);
        console.log("移动后位置:", this.$store.state.hawkeye.tennisBall.position);
        console.log("运动方向:", direction);

        // 创建带方向性的椭圆痕迹
        const directionalMark = this.createDirectionalEllipse(
          // 使用移动后的位置创建痕迹
          this.$store.state.hawkeye.tennisBall.position.x,
          this.$store.state.hawkeye.tennisBall.position.z,
          direction,
        );

        this.$store.commit("hawkeye/sceneAdd", directionalMark);
        this.shadowMarks.push(directionalMark);

        // // 保留原始位置（如果需要）
        // this.tennisBall.position.copy(originalPosition);
        // console.log("恢复原始位置:", this.tennisBall.position);
      } else if (ballHeight > 0.2) {
        // 重置碰撞状态
        this.$store.commit("hawkeye/collidedTennisBall", false)
      }
    },


  }
}
</script>

<style scoped></style>