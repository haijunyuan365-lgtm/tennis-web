<template>
  <div id="container">
    <div class="control-buttons">
      <button @click="showShotPlacement" :class="{ active: activeButton === 'shot' }">击球落点</button>
      <button @click="showServePlacement" :class="{ active: activeButton === 'serve' }">发球落点</button>
      <button @click="showHitPlacement" :class="{ active: activeButton === 'hit' }">击球位置</button>
    </div>
    

    
    
    <div ref="rendererContainer" id="canvas-container"></div>
    
    <!-- 区域统计信息 -->
    <div class="area-stats">
      <div class="FinishingZone" style="border-left: 30px solid #A786B5FF;">
        <div class="stat-label">制胜区 (0-6.4m)</div>
        <div class="stat-value">{{ winningZonePercentage }}%</div>
        <div class="stat-count">{{ winningZoneCount }}/{{ totalShots }}</div>
      </div>
      <div class="AttackZone" style="border-left: 30px solid #828767FF;">
        <div class="stat-label">进攻区 (6.4-9.14m)</div>
        <div class="stat-value">{{ attackZonePercentage }}%</div>
        <div class="stat-count">{{ attackZoneCount }}/{{ totalShots }}</div>
      </div>
      <div class="NeutralZone" style="border-left: 30px solid #206419FF;">
        <div class="stat-label">防守区 (9.14-11.88m)</div>
        <div class="stat-value">{{ defenseZonePercentage }}%</div>
        <div class="stat-count">{{ defenseZoneCount }}/{{ totalShots }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export default {
  components:{

  },

  data() {
    return {
      tennisBall: null,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      clippingPlane: null,

      isAnimating: true,
      activeButton: null, // 当前激活的按钮
      shotPoints: [], // 击球落点数组
      servePoints: [], // 发球落点数组
      hitPoints: [], // 击球位置数组


      constants: {
        LIGHT_DIRECTION: new THREE.Vector3(15, 20, 10).normalize(),
      }
    };
  },
  
  computed: {
    // 根据当前激活的按钮获取对应的数据源
    currentPoints() {
      switch(this.activeButton) {
        case 'shot':
          return this.shotPoints;
        case 'serve':
          return this.servePoints;
        case 'hit':
          return this.hitPoints;
        default:
          return this.shotPoints;
      }
    },
    
    // 计算制胜区落点数量 (0-6.4m)
    winningZoneCount() {
      return this.currentPoints.filter(point => point.z >= 0 && point.z <= 6.4).length;
    },
    
    // 计算进攻区落点数量 (6.4-9.14m)
    attackZoneCount() {
      return this.currentPoints.filter(point => point.z > 6.4 && point.z <= 9.14).length;
    },
    
    // 计算防守区落点数量 (9.14-11.88m)
    defenseZoneCount() {
      return this.currentPoints.filter(point => point.z > 9.14 && point.z <= 11.88).length;
    },
    
    totalShots() {
      return this.currentPoints.length;
    },
    
    // 计算各区域百分比
    winningZonePercentage() {
      return this.totalShots > 0 ? Math.round((this.winningZoneCount / this.totalShots) * 100) : 0;
    },
    
    attackZonePercentage() {
      return this.totalShots > 0 ? Math.round((this.attackZoneCount / this.totalShots) * 100) : 0;
    },
    
    defenseZonePercentage() {
      return this.totalShots > 0 ? Math.round((this.defenseZoneCount / this.totalShots) * 100) : 0;
    }
  },


  mounted() {
    this.initScene();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', this.onWindowResize);
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB);
      this.scene.fog = new THREE.Fog(0x87CEEB, 10, 60);
      
      // 创建相机
      const container = this.$refs.rendererContainer;
      this.camera = new THREE.PerspectiveCamera(
        65,
        container.clientWidth / container.clientHeight,
        0.1,
        60000
      );
      
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
      });
      
      // 设置渲染器尺寸为容器尺寸，实现自适应
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      
      // 设置像素比例，限制最大值避免性能问题
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // 启用阴影渲染
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // 启用裁剪平面
      this.renderer.localClippingEnabled = true;
      
      // 设置背景色
      this.renderer.setClearColor(0x87CEEB, 1);
      
      // 将渲染器添加到容器中
      container.appendChild(this.renderer.domElement);
      
      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      // 启用阻尼效果，使相机移动更平滑
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      
      // 设置相机距离限制，确保球场始终可见
      this.controls.minDistance = 0.1;
      this.controls.maxDistance = 300;
      
      // 设置控制器目标点
      this.controls.target.set(0, 0, 10);
      
      // 启用缩放功能，允许用户缩放查看
      this.controls.enableZoom = true;
      
      // 启用平移功能，允许用户平移视角
      this.controls.enablePan = true;
      
      // 摄像机控制
      this.controls.enabled = false; // 启用摄像机交互控制
      

      
      // 添加光源
      this.addLights();
      
      // 添加云朵背景
      this.addClouds();
      
      // 加载网球场模型
      this.loadTennisCourtModel();
      
      // 设置相机初始位置
      // this.camera.position.set(0, 5.085, 14.296);

      this.camera.position.set(-0.049, 4.818, 14.252);

      this.controls.target.set(-0.033, 0.902, 8.772);
      this.createTennisBall();
      
      // 初始化落点数据
      this.initShotData();
      
      // 开始动画循环
      this.animate();
       

     },
     
     animate() {
       requestAnimationFrame(this.animate);
       
       if (this.controls) {
         this.controls.update();
       }
       
       if (this.renderer && this.scene && this.camera) {
         this.renderer.render(this.scene, this.camera);
       }
     },
    
    // 添加光源
    addLights() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x404040, 60.0);
      this.scene.add(ambientLight);
      
      // 方向光（主光源）
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
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
    //创建网球
      createTennisBall() {
        // 如果已有网球，从场景中移除
        if (this.tennisBall) {
            this.scene.remove(this.tennisBall);
        }

        const geometry = new THREE.SphereGeometry(0.03175, 32, 32);
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

        this.scene.add(this.tennisBall);
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
       gltfLoader.load('/model/grdFinal.glb', (gltf) => {
        const court = gltf.scene;
        court.position.set(0, 0, 0);
        court.rotation.x = -Math.PI / 2;
        this.scene.add(court);
        // console.log('网球场模型加载成功');
        
        court.traverse((child) => {
          if (child.isMesh) {
            child.material.roughness = 0.7;
            child.receiveShadow = true;
            child.castShadow = false;
            child.material.needsUpdate = true;
          }
        });
      }, (progress) => {
        // console.log('网球场加载进度:', (progress.loaded / progress.total * 100) + '%');
      }, (error) => {
        // console.error('网球场加载错误:', error);
      });
      
             // OBJ 加载器 - 球网
       const objLoader = new OBJLoader();
              objLoader.load('/model/tennisweb.obj', (object) => {
         object.position.set(1.5, 0, 0); // 放在球场中央
         object.scale.set(0.8, 0.45, 0.4);
        //  console.log('球网模型加载成功');
        
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
      }, (progress) => {
        // console.log('球网加载进度:', (progress.loaded / progress.total * 100) + '%');
      }, (error) => {
        // console.error('球网加载错误:', error);
      });
    },
    
    receiveIsAnimating(isAnimating){
      this.isAnimating=isAnimating
    },
    
    // 处理窗口大小变化，实现自适应缩放
    onWindowResize() {
      // 获取容器元素
      const container = this.$refs.rendererContainer;
      if (!container || !this.camera || !this.renderer) {
    window.location.reload(); // 强制刷新页面
    return;
  }
      
      // 更新相机宽高比
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      
      // 更新渲染器尺寸
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      
      // 更新像素比例，确保在高分辨率屏幕上清晰显示
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // 强制重新渲染一帧，确保显示正确
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    
    // 初始化落点数据
    initShotData() {
      // 模拟击球落点数据 (x, z坐标)
      this.shotPoints = [
        { x: 0, z: 6.4 },   // 前锋球
        { x: 0, z: 9.14 },
        { x: 0, z: 11.88 },
        { x: 2, z: 6 },
        { x: 2, z: 8.5 },
        { x: 2, z: 11 },
        { x: 4, z: 6 },
        { x: 4, z: 8.5 },
        { x: 4, z: 11 },
        { x: 3, z: 6 },
        { x: 2, z: 8.5 }   // 制胜球
      ];
      
      // 模拟发球落点数据
      this.servePoints = [
        { x: 2, z: 6 },  // 一发
        { x: 1.5, z: 8.5 },
      ];
      
      // 模拟击球位置数据
      this.hitPoints = [
        { x: -3, z: 10 },   // 击球位置
        { x: 3, z: 10 }
      ];
    },
    
    // 显示击球落点
    showShotPlacement() {
      this.activeButton = 'shot';
      this.clearAllPoints();
      this.drawPoints(this.shotPoints, 'shot');
    },
    
    // 显示发球落点
    showServePlacement() {
      this.activeButton = 'serve';
      this.clearAllPoints();
      this.drawPoints(this.servePoints, 'serve');
    },
    
    // 显示击球位置
    showHitPlacement() {
      this.activeButton = 'hit';
      this.clearAllPoints();
      this.drawPoints(this.hitPoints, 'hit');
    },
    
    // 清除所有落点
    clearAllPoints() {
      // 清除场景中所有标记为落点的球
      const pointsToRemove = [];
      this.scene.traverse((child) => {
        if (child.userData.isShotPoint) {
          pointsToRemove.push(child);
        }
      });
      
      pointsToRemove.forEach(point => {
        this.scene.remove(point);
        if (point.geometry) point.geometry.dispose();
        if (point.material) point.material.dispose();
      });
    },
    
    // 绘制落点
    drawPoints(points, type) {
      points.forEach((point, index) => {
        // 使用网球几何体和材质
        const geometry = new THREE.SphereGeometry(0.03175, 32, 32); // 标准网球尺寸
        
        // 创建网球纹理
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // 基础颜色（网球黄绿色）
        ctx.fillStyle = '#DFFF00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 添加绒毛/纹理效果
        for (let i = 0; i < 800; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 0.5 + 0.1;
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 添加白色缝合线
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // 曲线1
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2, canvas.height * 0.1);
        ctx.bezierCurveTo(
          canvas.width * 0.05, canvas.height * 0.5,
          canvas.width * 0.2, canvas.height * 0.9,
          canvas.width * 0.5, canvas.height * 0.9
        );
        ctx.stroke();

        // 曲线2（镜像）
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8, canvas.height * 0.1);
        ctx.bezierCurveTo(
          canvas.width * 0.95, canvas.height * 0.5,
          canvas.width * 0.8, canvas.height * 0.9,
          canvas.width * 0.5, canvas.height * 0.9
        );
        ctx.stroke();
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshStandardMaterial({ 
          map: texture, 
          roughness: 0.8, 
          metalness: 0.1 
        });
        const ball = new THREE.Mesh(geometry, material);
        ball.position.set(point.x, 0.03, point.z); // 球体底部接触球场表面
        ball.castShadow = true;
        ball.receiveShadow = true;
        ball.userData.isShotPoint = true;
        ball.userData.pointType = type;
        ball.userData.pointIndex = index;
        
        this.scene.add(ball);
      });
    },
  },
  
  beforeUnmount() {
    // 移除窗口大小变化监听器，避免内存泄漏
    window.removeEventListener('resize', this.onWindowResize);
    
    // 清理Three.js资源
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
  z-index: 1;
}

.control-buttons {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
  pointer-events: auto;
}

.control-buttons button {
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid #FFA800;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  min-width: 120px;
}

.control-buttons button:hover {
  background: rgba(255, 168, 0, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 168, 0, 0.3);
}

.control-buttons button.active {
  background: #FFA800;
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 168, 0, 0.5);
}

/* 区域统计信息样式 */
.area-stats {
  position: absolute;
  top: 150px;
  right: 20px;
  padding: 20px;
  z-index: 10;
  min-width: 200px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.area-stats {
  margin-bottom: 15px; 
  border-radius: 8px;
}
.FinishingZone,.AttackZone,.NeutralZone {
  margin-bottom: 60px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}


.area-stats {
  margin-bottom: 0;
}

.area-stats .stat-label {
  font-size: 14px;
  font-weight: bold;
  color: #FFA800;
  margin-bottom: 5px;
}

.area-stats .stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #00FF00;
  margin-bottom: 3px;
}

.area-stats .stat-count {
  font-size: 12px;
  color: #CCCCCC;
  opacity: 0.8;
}






</style>
/**
// 网球场尺寸常量 (ITF标准)
const COURT = {
    totalLength: 23.77,   // 球场总长度
    doublesWidth: 10.97,  // 双打宽度
    singlesWidth: 8.23,    // 单打宽度
    netHeightCenter: 0.914,// 球网中心高度
    netZPosition: 0,      // 球网中心Z坐标（模型位置）
    baselineOffset: 0      // 基线偏移量
};

// 底线坐标
const baselines = [
  {
    name: "B端底线",
    xRange: [-COURT.doublesWidth/2, COURT.doublesWidth/2], // -5.485 到 5.485
    z: COURT.totalLength/2 // 11.885
  },
  {
    name: "A端底线",
    xRange: [-COURT.doublesWidth/2, COURT.doublesWidth/2], // -5.485 到 5.485
    z: -COURT.totalLength/2 // -11.885
  }
];

// 边线坐标
const sidelines = [
  {
    name: "左双打边线",
    x: -COURT.doublesWidth/2, // -5.485
    zRange: [-COURT.totalLength/2, COURT.totalLength/2] // -11.885 到 11.885
  },
  {
    name: "右双打边线",
    x: COURT.doublesWidth/2, // 5.485
    zRange: [-COURT.totalLength/2, COURT.totalLength/2] // -11.885 到 11.885
  },
  {
    name: "左单打边线",
    x: -COURT.singlesWidth/2, // -4.115
    zRange: [-COURT.totalLength/2, COURT.totalLength/2] // -11.885 到 11.885
  },
  {
    name: "右单打边线",
    x: COURT.singlesWidth/2, // 4.115
    zRange: [-COURT.totalLength/2, COURT.totalLength/2] // -11.885 到 11.885
  }
];
 */