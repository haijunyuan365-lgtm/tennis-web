<template>
  <div id="building" :style="{ backgroundImage: `url(${currentBackgroundUrl})` }">
      <div class="area area2">
        <div class="header">
          <div class="match-type-controls">
            <button @click="switchMatchType('best-of-3')" :class="{ active: matchType === 'best-of-3' }">3盘2胜</button>
            <button @click="switchMatchType('best-of-5')" :class="{ active: matchType === 'best-of-5' }">5盘3胜</button>
            <button @click="switchServingTeam()" :class="{ active: servingTeam === 'team1' }">队伍1发球</button>
            <button @click="switchServingTeam()" :class="{ active: servingTeam === 'team2' }">队伍2发球</button>
            <button @click="setDefaultTemplate()" :class="{ active: $store.getters['app/getBackgroundTemplate'] === 'default' }">默认背景</button>
            <label class="upload-button">
              <input type="file" accept="image/*" @change="uploadSponsorBackground" style="display: none;">
              上传背景
            </label>
          </div>

        </div>
        <div class="center">
          <div class="competitor">
          <div class="competitor-team1-image">
            <div class="competitor-team1-image 1">
              <img :src="require('@/assets/image/player1.jpg')"/>
            </div>
            <div class="competitor-team1-image 2">
              <img :src="require('@/assets/image/player2.jpg')"/>
            </div>
          </div>
          <div class="competitor-team2-image">
            <div class="competitor-team2-image 3">
              <img :src="require('@/assets/image/player3.jpg')"/>
            </div>
            <div class="competitor-team2-image 4">
              <img :src="require('@/assets/image/player4.jpg')"/>
            </div>
          </div>
        </div>
            <div class="competitor-name">
    <div class="competitor-team1">
      <div class="competitor-team1-name">梓墨无人机</div>
      <div class="competitor-team1-names">
        <div class="competitor-team1-names name1">藏云飞</div>
        <div class="competitor-team1-names name2">杨舒凯</div>
      </div>
    </div>
    <div class="competitor-team2">
      <div class="competitor-team2-name">秦皇岛银行</div>
      <div class="competitor-team2-names">
        <div class="competitor-team2-names name3">王绍忠</div>
        <div class="competitor-team2-names name4">王金禹</div>
      </div>
    </div>
  </div>
  <div class="previous-team">
    <div class="previous-team1" :class="{ active: servingTeam === 'team1' }">
      <img :src="require('@/assets/image/网球.png')" alt="Team 1"/>
    </div>
    <div class="previous-team2" :class="{ active: servingTeam === 'team2' }">
      <img :src="require('@/assets/image/网球.png')" alt="Team 2"/>
    </div>
  </div>
  <div class="game score" :class="scoreContainerClass">
    
      <div class="score-team1">
        <div
          v-for="(slot, i) in team1ScoreSlots"
          :key="'score-team1-' + i"
          :class="getScoreClass(slot, 'team1')"
        >
          <span v-if="slot.type === 'score'">{{ slot.idx }}</span>
          <span v-else-if="slot.type === 'current-game'">{{ slot.team1 }}</span>
        </div>
      </div>
      <div class="score-team2">
        <div
          v-for="(slot, i) in team2ScoreSlots"
          :key="'score-team2-' + i"
          :class="getScoreClass(slot, 'team2')"
        >
          <span v-if="slot.type === 'score'">{{ slot.idx }}</span>
          <span v-else-if="slot.type === 'current-game'">{{ slot.team2 }}</span>
        </div>
      </div>
    </div>
</div>
 <div class="footer">
                <div class="gametime-row">
  <div class="game-time">比赛时间:</div>
  <div class="gametime">00:00:00</div>
  </div>
         <div class="speed-row">
         <div class="speed-number">100</div>
         <div class="speed-unit">km/h</div>
         </div>
         
</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TennisScore',
  data() {
    return {
      matchType: 'best-of-3', // 'best-of-3' 或 'best-of-5'
      team1Scores: [6, 4], // 队伍1的比分
      team2Scores: [4, 6], // 队伍2的比分
      currentGameScore: { team1: 30, team2: 15 }, // 当前局比分
      servingTeam: 'team1', // 'team1' 或 'team2' - 当前发球方
      defaultBackgroundUrl: require('@/assets/image/网球场背景图.png') // 默认背景图片
    }
  },
  computed: {
    team1ScoreSlots() {
      return this.generateScoreSlots(this.team1Scores, this.matchType)
    },
    team2ScoreSlots() {
      return this.generateScoreSlots(this.team2Scores, this.matchType)
    },
    scoreContainerClass() {
      return {
        'best-of-3': this.matchType === 'best-of-3',
        'best-of-5': this.matchType === 'best-of-5'
      }
    },
    currentBackgroundUrl() {
      const backgroundTemplate = this.$store.getters['app/getBackgroundTemplate']
      const sponsorBackgroundUrl = this.$store.getters['app/getSponsorBackgroundUrl']
      return backgroundTemplate === 'sponsor' && sponsorBackgroundUrl 
        ? sponsorBackgroundUrl 
        : this.defaultBackgroundUrl
    }
  },
  methods: {
    generateScoreSlots(scores, matchType) {
      const maxSets = matchType === 'best-of-5' ? 5 : 3
      const slots = []
      
      // 添加局内大比分
      slots.push({ 
        type: 'current-game', 
        team1: this.currentGameScore.team1, 
        team2: this.currentGameScore.team2 
      })
      
      // 添加间隔
      slots.push({ type: 'gap' })
      
      // 根据比赛类型添加小比分框
      for (let i = 0; i < maxSets; i++) {
        if (i < scores.length) {
          slots.push({ type: 'score', idx: scores[i] })
        } else {
          slots.push({ type: 'score', idx: 0 })
        }
      }
      
      return slots
    },
    getScoreClass(slot, team) {
      if (slot.type === 'score') {
        return `score-${team} number${slot.idx}`
      } else if (slot.type === 'current-game') {
        return `current-game-${team}`
      } else if (slot.type === 'gap') {
        return `team1-gap` // 或 team2-gap
      }
      return `previous-${team}`
    },
    switchMatchType(type) {
      this.matchType = type
    },
    switchServingTeam() {
      this.servingTeam = this.servingTeam === 'team1' ? 'team2' : 'team1'
    },
    setDefaultTemplate() {
      this.$store.dispatch('app/resetBackground')
    },
    uploadSponsorBackground(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.$store.dispatch('app/setSponsorBackgroundUrl', e.target.result)
          this.$store.dispatch('app/setBackgroundTemplate', 'sponsor')
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style scoped>
#building {
  width: 100vw;
  height: 100vh;
  min-width: 320px;
  min-height: 480px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.score-container {
  width: 96vw;
  height: 92vh;
  display: flex;
  flex-direction: row;
  gap: 0vw;
}
.area2 {
  display: flex;
  height: 100%;
  box-sizing: border-box;
}
.area2 {
  height: 100%;
  flex: 1 1 0;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* padding: 3vh 2vw 3vh 0vw; */
  position: relative;
}
.competitor {
  /* width: 100%; */
  margin-left: 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* flex: 1;  */
  margin-top: 0vh;
  gap:2vh;
}
.competitor-team1-image, .competitor-team2-image {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1vw;
  width: 100%;
}
.competitor-team1-image > div,
.competitor-team2-image > div {
  aspect-ratio: 3/4;
  width: 10vw;
  height: 30vh;
  min-width: 80px;
  min-height: 100px;
  background: #eee;
  border-radius: 1vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.competitor-team1-image img,
.competitor-team2-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;   /* 关键：让图片裁剪填满父容器 */
  border-radius: 1vw;  /* 保持圆角一致 */
  display: block;
}
.gametime-row {
  height: 100%;
  width: 65%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1vw;
}
.game-time {
  color: #FFA800;
  font-weight: 400;
  font-size: 3vw;
}
.gametime {
  font-weight: 400;
  font-size: 3vw;
  color: #fff;
}
.header {
  height: 100%;
  width: 100%;
}
.center {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin-bottom: 0vh;
}
.competitor-name {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2vh;
  min-width: 180px;
}

.competitor-team1-name, .competitor-team2-name {
  font-size: 2.4vw;
  font-weight: bold;
  color: #FFA800;
}
.competitor-team1-names, .competitor-team2-names {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}
.competitor-team1-names > div, .competitor-team2-names > div {
  font-size: 2.5vw;
  color: #fff;
  font-weight: 500;
}
.previous-team{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2vh;
}
.game.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  /* flex: 1 1 0; */
  margin-right: 2vw;
  transition: all 0.3s ease;
}
.score-team1, .score-team2 {
  display: flex;
  flex-direction: row;
  gap: 0.8vw;
  transition: all 0.3s ease;
}
.score-team1 > div, .score-team2 > div {
  background: rgba(30,60,100,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  transition: all 0.3s ease;
}

/* 三局两胜时的比分框样式 */
.game.score.best-of-3 .score-team1 > div,
.game.score.best-of-3 .score-team2 > div {
  width: 9vw;
  height: 30vh;
  min-width: 60px;
  min-height: 60px;
  font-size: 5vw;
}

/* 五局三胜时的比分框样式 */
.game.score.best-of-5 .score-team1 > div,
.game.score.best-of-5 .score-team2 > div {
  width: 8vw;
  height: 30vh;
  min-width: 40px;
  min-height: 60px;
  font-size: 5vw;
}

.team1-gap, .team2-gap {
  width: 1vw !important;
  height: 30vh !important;
  min-width: 1vw !important;
  min-height: 30vh !important;
  background: #000 !important;
  color: #fff;
}

.current-game-team1, .current-game-team2 {
  font-weight: bold;
}
.previous-team1, .previous-team2 {
  width: 4vw;
  height: 30vh;
  min-width: 60px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.previous-team1 img, .previous-team2 img {
  width: 70%;
  object-fit: cover;
  border-radius: 0.8vw;
  display: block;
  transition: opacity 0.3s ease;
}

.previous-team1, .previous-team2 {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.previous-team1.active, .previous-team2.active {
  opacity: 1;
}

/* 三局两胜时的间距调整 */
.game.score.best-of-3 .score-team1 > div:nth-child(2),
.game.score.best-of-3 .score-team2 > div:nth-child(2) {
  margin-right: -0.2vw;
  margin-left: -0.2vw;
}

/* 五局三胜时的间距调整 */
.game.score.best-of-5 .score-team1 > div:nth-child(2),
.game.score.best-of-5 .score-team2 > div:nth-child(2) {
  margin-right: -0.2vw;
  margin-left: -0.2vw;
}

.footer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.speed-row{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  height: 100%;
  width: 100%;
}
.speed-number {
  font-size: 7vw;
  color: #FFA800;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}

.match-type-controls {
  display: flex;
  gap: 1vw;
  margin-top: 1vh;
}

.match-type-controls button {
  padding: 0.5vh 1vw;
  background: rgba(255, 168, 0, 0.3);
  border: 1px solid #FFA800;
  color: #FFA800;
  border-radius: 0.5vw;
  cursor: pointer;
  font-size: 1vw;
  transition: all 0.3s ease;
}

.match-type-controls button.active {
  background: #FFA800;
  color: #fff;
}

.match-type-controls button:hover {
  background: rgba(255, 168, 0, 0.5);
  transform: scale(1.05);
}

.upload-button {
  padding: 0.5vh 1vw;
  background: rgba(255, 168, 0, 0.3);
  border: 1px solid #FFA800;
  color: #FFA800;
  border-radius: 0.5vw;
  cursor: pointer;
  font-size: 1vw;
  transition: all 0.3s ease;
  display: inline-block;
}

.upload-button:hover {
  background: rgba(255, 168, 0, 0.5);
  transform: scale(1.05);
}

.speed-unit {
  font-size: 5vw;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}
   @media (max-width: 900px) {
    .area1, .area2 {
      padding: 1vh 1vw;
      min-width: 0;
    }
    .competitor-team1-name, .competitor-team2-name {
      font-size: 3vw;
    }
    /* 其他字体、图片、间距等缩小 */
  }
</style>
