<template>
  <div style="display:none"></div>
</template>

<script>
export default {
  name: 'ServePlacement',
  mounted() {
    // 左侧球场数据 - 添加击球类型
    const points1 = [
      { x: 0.1, y: 0.95, type: 'forehand' },  // 正手发球
      { x: 0.4, y: 0.9, type: 'backhand' },   // 反手发球
      { x: 0.7, y: 0.88, type: 'forehand' }   // 正手发球
    ]
    
    // 右侧球场数据 - 添加击球类型
    const points2 = [
      { x: 0.2, y: 0.92, type: 'backhand' },  // 反手发球
      { x: 0.5, y: 0.87, type: 'forehand' },  // 正手发球
      { x: 0.8, y: 0.85, type: 'backhand' },  // 反手发球
      { x: 0.3, y: 0.78, type: 'forehand' }   // 正手发球
    ]
    
    this.$emit('update-points', points1, 1)
    this.$emit('update-points', points2, 2)
  }
}
</script>