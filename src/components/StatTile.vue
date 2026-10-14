<script setup lang="ts">
// 浅色图标 + 数值 + 环比，用于统计分析页 / 专题页
defineProps<{ icon: string, color: string, label: string, value: string | number, trend?: string }>()
</script>

<template>
  <div class="card stat-tile">
    <div class="stat-tile__icon" :style="{ background: `${color}22`, color }">
      <span :style="{ background: color }"><i :class="icon" /></span>
    </div>
    <div>
      <div class="stat-tile__label">
        {{ label }}
      </div>
      <div class="stat-tile__value">
        {{ value }}
      </div>
      <div v-if="trend" class="stat-tile__trend">
        <b>↑ {{ trend }}</b><span>较上期</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-tile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  min-width: 0;
}

.stat-tile__icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;

  span {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 20px;
  }
}

.stat-tile__label {
  color: var(--cv-text-2);
  font-size: 13px;
  white-space: nowrap;
}

.stat-tile__value {
  font-size: 24px;
  font-weight: 700;
  margin: 4px 0;
  color: #15233a;
}

.stat-tile__trend {
  font-size: 12px;

  b {
    color: var(--cv-red);
    margin-right: 10px;
  }

  span {
    color: var(--cv-text-3);
  }
}
</style>
