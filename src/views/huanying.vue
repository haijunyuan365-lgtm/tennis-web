<template>
  <div class="container">
    <div class="content-wrapper">
      <div class="welcome-content">
        <div class="logo">
          <i class="fas fa-tennis-ball logo-icon"></i>
          <div class="logo-text">
            <h1>网球球场一体机</h1>
            <p>Tennis court all-in-one machine</p>
          </div>
        </div>

        <div class="welcome-message">
          <h2>欢迎来到网球场</h2>
          <p>我们为您提供专业标准的网球场地和卓越的服务体验。无论您是网球爱好者还是专业选手，这里都是您展现球技、享受运动的理想场所。</p>

          <button class="experience-btn" @click="startExperience">
            <i class="fas fa-play-circle"></i>开始体验
          </button>

          <div class="tennis-court">
            <div class="court-line baseline top"></div>
            <div class="court-line baseline bottom"></div>
            <div class="court-line doubles sideline left"></div>
            <div class="court-line doubles sideline right"></div>
            <div class="court-line singles sideline left"></div>
            <div class="court-line singles sideline right"></div>
            <div class="court-line service-line top"></div>
            <div class="court-line service-line bottom"></div>
            <div class="court-line center-line"></div>
            <div class="center-mark"></div>
            <div class="net"></div>
            <div class="net-pole left"></div>
            <div class="net-pole right"></div>
            <div class="net-pattern"></div>
          </div>

          <div class="opening-hours">
            <h3><i class="fas fa-clock">开放时间</i></h3>
            <p>周一至周五：上午8:00-晚上10:00</p>
            <p>周末及节假日：上午8:00-晚上11:00</p>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-hint" v-if="showScrollHint">
      <i class="fas fa-arrow-down"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TennisCourtWelcome',
  data() {
    return {
      showScrollHint: true
    }
  },
  methods: {
    startExperience() {
      // window.location.href = 'model.html'
      this.$router.push('/mode')
    }
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.showScrollHint = false
    })

    setTimeout(() => {
      this.showScrollHint = false
    }, 5000)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.container {
  background-image: url('../assets/image/huanying.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  color: #fff;
  min-height: 100vh;
  overflow: auto;
  position: relative;
  /* max-width: 1200px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  width: 100%;
  padding: 50px 0;
}

.welcome-content {
  text-align: center;
  max-width: 800px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeIn 1.5s ease-out;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #1a2a6c, #4CAF50, #1a2a6c);
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.logo-text h1 {
  font-size: 3.5rem;
  letter-spacing: 2px;
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
}

.logo-text p {
  font-size: 1.2rem;
  color: #ddd;
  letter-spacing: 3px;
  font-weight: 300;
}

.welcome-message {
  margin: 30px 0;
}

.welcome-message h2 {
  font-size: 2.8rem;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.welcome-message p {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #eee;
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.experience-btn {
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
  margin: 20px 0 30px;
}

.experience-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.6);
}

.experience-btn:active {
  transform: translateY(1px);
}

.tennis-court {
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: 40px auto;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  border: 8px solid #fff;
}

.court-line {
  position: absolute;
  background: #fff;
}

.baseline {
  height: 4px;
  left: 0;
  right: 0;
}

.baseline.top {
  top: 0;
}

.baseline.bottom {
  bottom: 0;
}

.doubles.sideline {
  width: 4px;
  top: 0;
  bottom: 0;
}

.doubles.sideline.left {
  left: 0;
}

.doubles.sideline.right {
  right: 0;
}

.singles.sideline {
  width: 4px;
  top: 0;
  bottom: 0;
}

.singles.sideline.left {
  left: 12%;
}

.singles.sideline.right {
  right: 12%;
}

.service-line {
  height: 4px;
  left: 12%;
  right: 12%;
}

.service-line.top {
  top: 21.5%;
}

.service-line.bottom {
  top: 78.5%;
}

.center-line {
  top: 21.5%;
  left: 50%;
  width: 4px;
  bottom: 21.5%;
  transform: translateX(-50%);
}

.center-mark {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.net {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #fff;
  transform: translateY(-50%);
  z-index: 2;
}

.net-pole {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 40px;
  background: #fff;
  transform: translateY(-50%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.net-pole.left {
  left: 0;
}

.net-pole.right {
  right: 0;
}

.net::before {
  content: "";
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 30px;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.net-pattern {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 30px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(transparent 0%, transparent 49%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 51%, transparent 52%, transparent 100%);
  background-size: 100% 6px;
  transform: translateY(-50%);
  z-index: 1;
}

.opening-hours {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border-left: 4px solid #4CAF50;
}

.opening-hours h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #4CAF50;
}

.opening-hours p {
  font-size: 1.2rem;
  color: #eee;
  margin-bottom: 10px;
}

.scroll-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 30px;
  animation: bounce 2s infinite;
  z-index: 100;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) translateX(-50%);
  }

  40% {
    transform: translateY(-20px) translateX(-50%);
  }

  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

@media (max-width: 768px) {
  .logo-text h1 {
    font-size: 2.5rem;
  }

  .welcome-message h2 {
    font-size: 2rem;
  }

  .welcome-message p {
    font-size: 1.1rem;
  }

  .tennis-court {
    height: 200px;
  }

  .service-line.top {
    top: 22%;
  }

  .service-line.bottom {
    top: 78%;
  }

  .center-line {
    top: 22%;
    bottom: 22%;
  }
}

@media (max-width: 480px) {
  .logo-text h1 {
    font-size: 2rem;
  }

  .logo-icon {
    font-size: 3rem;
  }

  .welcome-message h2 {
    font-size: 1.8rem;
  }

  .welcome-content {
    padding: 30px 20px;
  }

  .tennis-court {
    height: 180px;
  }

  .singles.sideline.left {
    left: 10%;
  }

  .singles.sideline.right {
    right: 10%;
  }

  .service-line {
    left: 10%;
    right: 10%;
  }
}
</style>