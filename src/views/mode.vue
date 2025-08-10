<template>
  <div class="tennis-mode-selector">
    <div class="container">
      <div class="header">
        <h1>选择你的模式</h1>
        <p>根据您的需求选择合适的模式，享受不同的运动体验</p>
      </div>

      <div class="mode-container">
        <div class="mode-item enabled changda" @click="selectMode('畅打')">
          <div class="mode-color"></div>
          <div class="mode-content">
            <h3>畅打模式</h3>
            <p>自由击球，尽情畅玩，无时间和规则限制</p>
          </div>
        </div>

        <div class="mode-item enabled match" @click="selectMode('比赛')">
          <div class="mode-color"></div>
          <div class="mode-content">
            <h3>比赛模式</h3>
            <p>模拟真实比赛规则</p>
          </div>
        </div>

        <div class="mode-item disabled training" @click="selectMode('训练')">
          <div class="mode-color"></div>
          <div class="mode-content">
            <h3>训练模式</h3>
            <p>专业技能训练，提升你的网球水平</p>
            <span class="coming-soon">开发中</span>
          </div>
        </div>
      </div>

      <div class="help-btn" @click="showHelp = true">
        <i class="fa fa-info-circle mr-2"></i>模式说明
      </div>

      <div class="help-info" :class="{ active: showHelp }">
        <div class="help-content">
          <div class="help-header">
            <h3>模式说明</h3>
          </div>
          <div class="help-body">
            <div class="help-item">
              <div class="help-text">
                <h4>畅打模式</h4>
                <p>自由击球，尽情畅玩，无时间和规则限制，适合休闲娱乐</p>
              </div>
            </div>

            <div class="help-item">
              <div class="help-text">
                <h4>比赛模式</h4>
                <p>模拟真实的比赛规则，展现你的竞技实力</p>
              </div>
            </div>

            <div class="help-item">
              <div class="help-text">
                <h4>训练模式</h4>
                <p>专业技能训练，提升你的网球水平，该模式正在开发中，敬请期待</p>
              </div>
            </div>
          </div>
          <div class="help-footer">
            <button class="close-btn" @click="showHelp = false">关闭帮助</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TennisModeSelector',
  data() {
    return {
      showHelp: false
    }
  },
  methods: {
    selectMode(mode) {
      if (mode === '训练') {
        alert('训练模式为预留模块，暂未开放');
        return;
      }
      this.$router.push('/login')
      // alert(`你选择了${mode}模式，开始体验`)
    }
  }
}
</script>

<style scoped>
.tennis-mode-selector {
  min-height: 100vh;
  padding: 40px 20px;
  background-image: url('https://plus.unsplash.com/premium_photo-1707423388616-e0b0e5d79eb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzgzfHx0ZW5uaXN8ZW58MHx8MHx8fDA%3D');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

:root {
  --primary-color: #165DFF;
  --secondary-color: #FF7D00;
  --neutral-light: rgba(245, 247, 250, 0.9);
  --neutral-medium: #E4E6EB;
  --neutral-dark: #4E5969;
  --text-color: #272E3B;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --card-shadow-hover: 0 10px 30px rgba(22, 93, 255, 0.2);
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin: 0 auto 60px;
  padding: 15px 20px;
  background-color: rgba(245, 247, 250, 0.7);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 120px;
  max-width: 55%;
}

.header h1 {
  font-size: 1.75rem;
  color: var(--text-color);
  margin-bottom: 10px;
  width: 100%;
}

.header p {
  font-size: 1rem;
  color: var(--neutral-dark);
  max-width: 90%;
  margin: 0 auto;
  width: 100%;
}

.mode-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 60px;
}

@media (min-width: 768px) {
  .mode-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.mode-item {
  background-color: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  opacity: 0.95;
}

.mode-item:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-5px);
  opacity: 1;
}

.mode-color {
  height: 120px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.mode-item.enabled.changda .mode-color {
  background-image: url('https://plus.unsplash.com/premium_photo-1661607626631-edbff6804ae6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHRlbm5pc3xlbnwwfHwwfHx8MA%3D%3D');
}

.mode-item.enabled.match .mode-color {
  background-image: url('https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlbm5pc3xlbnwwfHwwfHx8MA%3D%3D');
}

.mode-item.disabled.training .mode-color {
  background-image: url('https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlbm5pc3xlbnwwfHwwfHx8MA%3D%3D');
}

.mode-item.enabled.match .mode-color {
  background-color: var(--primary-color);
}

.mode-content {
  padding: 25px;
}

.mode-content h3 {
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 10px;
}

.mode-content p {
  color: var(--neutral-dark);
  line-height: 1.5;
}

.mode-item.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mode-item.disabled.mode-color {
  background-color: var(--neutral-medium);
}

.mode-item.disabled h3,
.mode-item.disabled p {
  text-decoration: line-through;
}

.coming-soon {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 12px;
  background-color: var(--neutral-medium);
  color: var(--neutral-dark);
  border-radius: 20px;
  font-size: 0.9rem;
}

.help-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.help-info.active {
  opacity: 1;
  visibility: visible;
}

.help-btn {
  max-width: 300px;
  width: 100%;
  height: 50px;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 0 auto;
  font-size: 1.1rem;
}

.help-btn:hover {
  background-color: #E66F00;
  transform: translateY(-2px);
}

.help-content {
  background-color: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.help-info.active .help-content {
  transform: scale(1);
}

.help-header {
  padding: 20px 30px;
  border-bottom: 1px solid var(--neutral-medium);
  text-align: center;
}

.help-header h3 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0;
}

.help-body {
  padding: 30px;
}

.help-item {
  margin-bottom: 25px;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-text h4 {
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 5px;
}

.help-text p {
  color: var(--neutral-dark);
  margin: 0;
}

.help-footer {
  padding: 20px 30px;
  background-color: var(--neutral-light);
  display: flex;
  justify-content: center;
}

.close-btn {
  padding: 10px 25px;
  /* background-color: var(--primary-color); */
  background-color: #0E42D2;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

/* .close-btn:hover {
  background-color: #0E42D2;
} */

@media (max-width: 768px) {
  .header {
    max-width: 90%;
    min-height: 100px;
    padding: 10px 15px;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .header p {
    font-size: 0.9rem;
  }
}
</style>