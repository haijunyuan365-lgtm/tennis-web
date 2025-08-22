<template>
  <div id="hawkeye-challenge">
    <div class="hawkeye-card" v-show="cardShow">
      <div class="hawkeye-logo">鹰眼挑战</div>
      <div id="judgment-result">{{ out }}</div>
      <div class="hawkeye-footer">Tennis Tracker System</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { gsap } from "gsap";
export default {
  data() {
    return {
      trajectoryPoints: [],
      interpolatedTrajectoryPoints: [], // 新增，用于存储插值后的点
      fullTrajectoryMesh: null,
      tennisBall: null,
      tennisBallShadow: null,
      out: "WAIT",
      cardShow: false,
      constants: {
        BALL_RADIUS: 0.03175,
        GROUND_HEIGHT: 0.01,
        LIGHT_DIRECTION: new THREE.Vector3(15, 20, 10).normalize(),
        targetPoint: [],
        directionToMinPoint: [],

        // 固定视角参数
        FIXED_DISTANCE: 0.4162316538926026,
        FIXED_HORIZONTAL_ANGLE: 0.1904596125688998,
        FIXED_VERTICAL_ANGLE: 0.280336107411985,
      }
    }
  },

  props: ['initialTrajectoryPoints', 'realOut', 'distance', 'receiveTrajectoryPoints'],

  computed: {
    scene() {
      return this.$store.getters['hawkeye/getScene'];
    }
  },

  watch: {
    scene(newScene) {
      if (newScene) {
        this.createTennisBall();
        this.loadInitialTrajectory();
      }
    }
  },

  mounted() {
    this.$emit('createDirectionalEllipse', this.createDirectionalEllipse);
  },

  methods: {
    loadInitialTrajectory() {
      // 初始化最低点，设置一个非常大的y值，确保第一个点能更新它
      let minY = Number.MAX_VALUE;
      let minPoint = null;
      let minIndex = -1; // 记录最低点的索引

      // 转换并找出最低点
      this.trajectoryPoints = this.initialTrajectoryPoints.map((pointObj, index) => {
        // 从对象中提取x,y,z值
        const x = pointObj.x || 0;
        const y = pointObj.y || 0;
        const z = pointObj.z || 0;

        const point = new THREE.Vector3(x, y, z);

        // 检查当前点的y坐标是否比之前的最低点还低
        if (point.y < minY) {
          minY = point.y;
          minPoint = point.clone();
          minIndex = index;
        }

        return point;
      });

      // 如果找到了最低点，将最低点的坐标保存到this上
      if (minPoint) {
        this.constants.targetPoint = minPoint.clone();

      } else {
        // 如果没有点，则初始化为0
        this.constants.targetPoint = new THREE.Vector3(0, 0, 0);

      }

      // 调整摄像头
      this.configureCameraToLandingPoint(this.constants.targetPoint);

      // 生成完整轨迹
      this.generateFullTrajectory();

      console.log("*****************trajectoryPoints:", this.trajectoryPoints)
      this.receiveTrajectoryPoints(this.trajectoryPoints);

      this.$store.commit("hawkeye/receiveTennisBallShadow", this.tennisBallShadow);
    },

    // // 1.根据水平方向分量来设置摄像头位置
    // configureCameraToLandingPoint(landingPoint) {
    //   // 2. 提取水平方向分量（忽略Y轴）
    //   const horizontalDirection = new THREE.Vector3(
    //     this.constants.directionToMinPoint.x,
    //     0,
    //     this.constants.directionToMinPoint.z
    //   ).normalize();

    //   // 3. 计算基础摄像机位置（保持Y轴不变）
    //   const basePosition = landingPoint.clone()
    //     .add(horizontalDirection.multiplyScalar(this.constants.FIXED_DISTANCE));

    //   console.log("最低点的坐标:",basePosition.y)
    //   // // 4. 设置固定高度（保持Y轴不变）
    //   basePosition.y = landingPoint.y + this.constants.FIXED_VERTICAL_ANGLE;
    //   basePosition.x += this.constants.FIXED_HORIZONTAL_ANGLE;

    //   // 5. 更新摄像机位置
    //   this.camera.position.copy(basePosition);
    //   this.camera.lookAt(landingPoint);
    //   this.controls.update();
    //   // console.log("landingPoint:", landingPoint);
    //   // console.log("Camera reconfigured for landing point:", basePosition);
    //   // console.log("horizontalDirection:", horizontalDirection);
    // },

    //2.固定摄像头在落点的后方的某个位置
    configureCameraToLandingPoint(landingPoint) {

      const basePosition = landingPoint.clone();
      basePosition.z += this.constants.FIXED_DISTANCE
      basePosition.y += 0.1

      //更新摄像头位置
      this.$store.commit("hawkeye/updateCameraByTarget", {
        basePosition,
        landingPoint,
      })

      // 5. 更新控制器目标点
      this.$store.commit("hawkeye/updateControlsByTarget", landingPoint);
    },

    generateFullTrajectory() {
      // 清理现有轨迹
      if (this.fullTrajectoryMesh) {
        this.$store.commit("hawkeye/sceneRemove", this.fullTrajectoryMesh)
      }

      // 获取轨迹点
      const points = this.trajectoryPoints;
      if (points.length < 2) return;

      // 插值处理
      const interpolatedPoints = interpolatePath(points, 2);
      const curve = new THREE.CatmullRomCurve3(interpolatedPoints);

      // 计算分段数
      const totalLength = curve.getLength();
      const minSegments = 100;
      const tubularSegments = Math.max(minSegments, Math.floor(totalLength / 0.05));
      const radialSegments = 24;

      // 定义半径
      const baseRadius = this.constants.BALL_RADIUS * 0.8;
      const startRadius = 0.001;
      const endRadius = baseRadius;
      const useNonLinear = false;

      // 安全创建 Frenet 坐标系
      let frames;
      try {
        frames = curve.computeFrenetFrames(tubularSegments, true);
      } catch (e) {
        console.error('Frenet 坐标系计算失败:', e);
        frames = { tangents: [], normals: [], binormals: [] };
        for (let i = 0; i <= tubularSegments; i++) {
          frames.tangents.push(new THREE.Vector3(0, 1, 0));
          frames.normals.push(new THREE.Vector3(1, 0, 0));
          frames.binormals.push(new THREE.Vector3(0, 0, 1));
        }
      }

      // 创建数组
      const vertexCount = (tubularSegments + 1) * radialSegments;
      const positions = new Float32Array(vertexCount * 3);
      const normals = new Float32Array(vertexCount * 3);
      const indices = new Uint32Array(tubularSegments * radialSegments * 6);

      const P = new THREE.Vector3();
      let positionIndex = 0;
      let normalIndex = 0;
      let index = 0;

      // 生成顶点和法线
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments;
        curve.getPointAt(u, P);

        // 确保点为有效值
        if (isNaN(P.x) || isNaN(P.y) || isNaN(P.z)) {
          console.warn('曲线点无效，重置为零点', { u, P });
          P.set(0, 0, 0);
        }

        const T = frames.tangents[i] || new THREE.Vector3(0, 1, 0);
        const N = frames.normals[i] || new THREE.Vector3(1, 0, 0);
        const B = frames.binormals[i] || new THREE.Vector3(0, 0, 1);

        // 计算半径
        let currentRadius;
        if (useNonLinear) {
          const easeProgress = 1 - Math.pow(1 - u, 2);
          currentRadius = startRadius + (endRadius - startRadius) * easeProgress;
        } else {
          currentRadius = startRadius + (endRadius - startRadius) * u;
        }

        for (let j = 0; j < radialSegments; j++) {
          const v = j * 2 * Math.PI / radialSegments;
          const sin = Math.sin(v);
          const cos = Math.cos(v);

          // 顶点位置（基于球心位置）
          positions[positionIndex++] = P.x + currentRadius * (cos * N.x + sin * B.x);
          positions[positionIndex++] = P.y + currentRadius * (cos * N.y + sin * B.y);
          positions[positionIndex++] = P.z + currentRadius * (cos * N.z + sin * B.z);

          // 法线
          const normalX = cos * N.x + sin * B.x;
          const normalY = cos * N.y + sin * B.y;
          const normalZ = cos * N.z + sin * B.z;

          normals[normalIndex++] = normalX;
          normals[normalIndex++] = normalY;
          normals[normalIndex++] = normalZ;
        }
      }

      // 安全生成索引
      const maxVertexIndex = positions.length / 3 - 1;
      for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = i * radialSegments + j;
          const b = (i + 1) * radialSegments + j;
          const nextJ = (j + 1) % radialSegments;
          const c = i * radialSegments + nextJ;
          const d = (i + 1) * radialSegments + nextJ;

          // 确保索引有效
          const validIndices = [a, b, c, d].every(idx => idx <= maxVertexIndex);
          if (validIndices) {
            // 三角形1: a, b, d
            indices[index++] = a;
            indices[index++] = b;
            indices[index++] = d;

            // 三角形2: a, d, c
            indices[index++] = a;
            indices[index++] = d;
            indices[index++] = c;
          }
        }
      }

      // 创建几何体
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

      // 仅设置有效的索引
      if (index > 0) {
        const validIndices = indices.slice(0, index);
        geometry.setIndex(new THREE.BufferAttribute(validIndices, 1));
      }

      // 尝试计算边界球
      try {
        geometry.computeBoundingSphere();
      } catch (e) {
        console.error('计算边界球失败:', e);

        // 手动设置边界球
        geometry.boundingSphere = new THREE.Sphere(
          new THREE.Vector3(0, 0, 0),
          10 // 默认半径
        );
      }

      // 创建材质
      const solidYellow = new THREE.Color(0xFFFF00);
      const material = new THREE.MeshPhongMaterial({
        color: solidYellow,
        emissive: solidYellow,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        clippingPlanes: [this.$store.state.hawkeye.clippingPlane],
        wireframe: false
      });

      this.fullTrajectoryMesh = new THREE.Mesh(geometry, material);
      this.$store.commit("hawkeye/sceneAdd", this.fullTrajectoryMesh)

      // 内插函数
      function interpolatePath(originalPoints, pointsPerSegment) {
        const interpolated = [];
        for (let i = 0; i < originalPoints.length - 1; i++) {
          interpolated.push(originalPoints[i]);
          for (let j = 1; j <= pointsPerSegment; j++) {
            const t = j / (pointsPerSegment + 1);
            const interpolatedPoint = new THREE.Vector3().lerpVectors(
              originalPoints[i],
              originalPoints[i + 1],
              t
            );
            interpolated.push(interpolatedPoint);
          }
        }
        interpolated.push(originalPoints[originalPoints.length - 1]);
        return interpolated;
      }
    },

    createTennisBall() {
      // 如果已有网球，从场景中移除
      if (this.tennisBall) {
        this.$store.commit("hawkeye/sceneRemove", this.tennisBall)
      }

      const geometry = new THREE.SphereGeometry(this.constants.BALL_RADIUS, 32, 32);
      let ballMaterial;

      // 使用canvas创建高级网球纹理
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // 绘制基础颜色（网球绿色）
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, size, size);

      // 添加绒毛效果
      ctx.beginPath();
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 3 + 1;
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();

      // 添加缝合线
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 20)';
      ctx.lineWidth = 16;

      // 顶部缝合线
      ctx.moveTo(size * 0.2, size * 0.5);
      ctx.bezierCurveTo(
        size * 0.25, size * 0.3,
        size * 0.75, size * 0.3,
        size * 0.8, size * 0.5
      );

      // 底部缝合线
      ctx.moveTo(size * 0.2, size * 0.5);
      ctx.bezierCurveTo(
        size * 0.25, size * 0.7,
        size * 0.75, size * 0.7,
        size * 0.8, size * 0.5
      );
      ctx.stroke();

      // 创建纹理
      const texture = new THREE.CanvasTexture(canvas);

      ballMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.05,
        bumpScale: 0.2,
        // transparent: true,   // 新增
        // opacity: 0         // 新增，设置透明度为0.5
      });

      this.tennisBall = new THREE.Mesh(geometry, ballMaterial);
      this.tennisBall.castShadow = true;

      // 转换初始点为 Vector3
      this.trajectoryPoints = this.initialTrajectoryPoints.map(point =>
        new THREE.Vector3(...point)
      );
      if (this.trajectoryPoints.length > 0) {
        this.tennisBall.position.copy(this.trajectoryPoints[0]);
      }

      this.$store.commit("hawkeye/addaTennisBall", this.tennisBall);

      // 更新阴影
      this.updateTennisBallShadow();
    },

    // 更新网球阴影
    updateTennisBallShadow() {
      // 移除旧的阴影
      if (this.tennisBallShadow) {
        this.$store.commit("hawkeye/sceneRemove", this.tennisBallShadow)
      }

      this.tennisBallShadow = this.createEllipticalShadow(
        this.tennisBall.position.x,
        this.tennisBall.position.z,
        0.3
      );
      this.$store.commit("hawkeye/sceneAdd", this.tennisBallShadow)
      // this.$store.state.scene.add(this.tennisBallShadow);
    },

    // 创建椭圆形阴影
    createEllipticalShadow(x, z, opacity) {
      const lightDirXZ = new THREE.Vector2(
        this.constants.LIGHT_DIRECTION.x,
        this.constants.LIGHT_DIRECTION.z
      ).normalize();

      // 计算椭圆的主轴和副轴长度
      const majorAxis = this.constants.BALL_RADIUS * 1.0;
      const minorAxis = this.constants.BALL_RADIUS * 0.8;

      // 创建椭圆形阴影
      const shadowGeometry = new THREE.EllipseCurve(
        0, 0,             // 中心点坐标
        majorAxis,        // x轴半径
        minorAxis,        // y轴半径
        0, Math.PI * 2,   // 起始角度和结束角度
        false,            // 是否逆时针
        0                 // 旋转角度
      );

      const points = shadowGeometry.getPoints(32);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);

      const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        depthTest: false
      });

      const shadow = new THREE.Mesh(geometry, shadowMaterial);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(x, this.constants.GROUND_HEIGHT, z);

      // 旋转阴影使其与光源方向对齐
      const angle = Math.atan2(lightDirXZ.y, lightDirXZ.x);
      shadow.rotation.z = angle;

      return shadow;
    },

    //根据方向向量创建碰撞痕迹
    createDirectionalEllipse(x, z, direction) {
      // 检查方向有效性
      if (direction.length() < 0.001) {
        direction = new THREE.Vector3(1, 0, 0);
      }

      // 计算椭圆尺寸
      const majorAxis = this.constants.BALL_RADIUS * 1.0;
      const minorAxis = this.constants.BALL_RADIUS * 0.8;

      // 创建椭圆形阴影
      const shadowGeometry = new THREE.EllipseCurve(
        0, 0, majorAxis, minorAxis, 0, Math.PI * 2, false, 0
      );

      const points = shadowGeometry.getPoints(32);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);

      // 计算旋转角度
      const angle = Math.atan2(direction.z, direction.x);
      const rotationAngle = -angle + Math.PI;

      // 更新界面状态
      const judgmentElement = document.getElementById('judgment-result');
      this.out = !this.realOut ? 'IN' : 'OUT';
      judgmentElement.textContent = this.out;
      judgmentElement.className = this.out.toLowerCase();

      // 创建材质
      const shadowMaterial = new THREE.MeshBasicMaterial({
        color: this.realOut ? 0xFF0000 : 0x000000,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        depthTest: false
      });

      // 创建阴影对象
      const shadow = new THREE.Mesh(geometry, shadowMaterial);

      // 设置位置和旋转
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(x, 0.001, z);
      shadow.rotation.z = rotationAngle;

      setTimeout(() => {
        // 触发相机动画
        this.animateCameraToTopView(x, z);
        //在这里消除轨迹
        if (this.fullTrajectoryMesh) {
          this.$store.commit("hawkeye/sceneRemove", this.fullTrajectoryMesh)
          this.fullTrajectoryMesh = null;
        }
      }, 500);


      return shadow;
    },

    //摄像机落点动画
    animateCameraToTopView(collisionPoint_x, collisionPoint_z) {
      console.log("this.distance:", this.distance)
      let distance = this.distance
      if (distance * 10 < 0.2) {
        distance = 0.115
      } else if (distance * 10 > 0.5) {
        distance = 0.2
      } else {
        distance *= 5
      }
      // 目标位置：落点正上方偏高一点
      const startPos = this.$store.state.hawkeye.camera.position.clone();
      const toPos = new THREE.Vector3(
        collisionPoint_x,
        distance, // 你可以调整高度(0.2/0.5)
        collisionPoint_z
      );
      console.log("distance:", distance)
      const startAngle = 0;
      let animObj = { t: 0 };
      gsap.to(animObj, {
        t: 1,
        duration: 1.5,
        onUpdate: () => {
          // 插值摄像机位置
          this.$store.state.hawkeye.camera.position.lerpVectors(startPos, toPos, animObj.t);
          // 插值视角角度
          const angle = startAngle;
          const lookX = collisionPoint_x;//-0.1防止90°，cos为0
          const lookZ = collisionPoint_z;//-1防止90°，x偏移1
          this.$store.state.hawkeye.camera.lookAt(lookX, 0.001, lookZ);
          this.$store.state.hawkeye.controls.target.set(lookX, 0.001, lookZ);
          this.$store.state.hawkeye.controls.update();
        },
      });
      setTimeout(() => {
        this.cardShow = true
      }, 1600);
    },

  },
}
</script>

<style scoped>
/* 新增鹰眼挑战样式 */
#hawkeye-challenge {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.hawkeye-card {
  position: relative;
  width: 300px;
  height: 200px;
  background: rgba(0, 20, 40, 0.85);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.1),
    inset 0 0 30px rgba(0, 150, 255, 0.3);
  border: 1px solid rgba(100, 200, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hawkeye-logo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 40, 80, 0.7);
  font-size: 0.9rem;
  text-align: center;
  padding: 5px 0;
  color: #4fc3f7;
  text-shadow: 0 0 8px rgba(79, 195, 247, 0.8);
}

#judgment-result {
  font-size: 5rem;
  font-weight: bold;
  margin: 15px 0;
  text-shadow: 0 0 20px currentColor;
  transition: all 0.8s ease;
  color: #4fc3f7;
  /* 添加这行 - 您原有的蓝色主题色 */
}

#judgment-result.in {
  color: #4caf50;
  /* 界内颜色 */
  animation: scale-pulse-in 0.8s ease-in-out;
}

#judgment-result.out {
  color: #f44336;
  /* 出界颜色 */
  animation: scale-pulse-out 0.8s ease-in-out;
}

@keyframes scale-pulse-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-pulse-out {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.hawkeye-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 0.7rem;
  text-align: center;
  padding: 5px 0;
  color: #81d4fa;
  background: rgba(0, 30, 60, 0.7);
}
</style>