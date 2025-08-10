<template>
<div id="ui-container">
  <h1>网球轨迹可视化系统</h1>
  <div class="control-group">
    <h2>控制</h2>
    <div class="btn-group">
      <button id="startBtn" @click="startAnimation">开始</button>
      <button id="pauseBtn" @click="togglePause">暂停/继续</button>
      <button id="resetBtn" @click="resetAnimation">重置</button>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      return{
        isAnimating:true,
      }
    },
    methods:{
      startAnimation() {
        this.isAnimating=true;
        this.sendAnimation();
      },
      
      togglePause() {
        this.isAnimating=!this.isAnimating;
        this.sendAnimation();
      },
      
      resetAnimation() {
        this.isAnimating=true;
      },

      sendAnimation(){
        this.$bus.$emit("animation",this.isAnimating);
      },

    }
  }
</script>

<style scoped>
#ui-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 20, 40, 0.85);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 25px rgba(0, 150, 255, 0.4);
  z-index: 10;
  max-width: 320px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(100, 200, 255, 0.2);
}

h1 {
  margin-bottom: 15px;
  font-size: 1.8rem;
  text-align: center;
  color: #4fc3f7;
  text-shadow: 0 0 10px rgba(79, 195, 247, 0.7);
}

.control-group {
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 30, 60, 0.6);
}

h2 {
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: #81d4fa;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  background: linear-gradient(to bottom, #2196F3, #0d47a1);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-width: 120px;
  z-index: 20;
}

button:hover {
  background: linear-gradient(to bottom, #42a5f5, #1e88e5);
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3);
}
</style>