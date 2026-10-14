<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '~/components/AppLogo.vue'
import PageHead from '~/components/PageHead.vue'
import { districts, organizations, projects } from '~/mock'

const router = useRouter()
const region = ref('')
const keyword = ref('')
const rows = computed(() => organizations.filter(o => (!region.value || o.region === region.value) && (!keyword.value || o.name.includes(keyword.value))))
const current = ref<(typeof organizations)[number]>()
const visible = ref(false)
function open(o: (typeof organizations)[number]) {
  current.value = o
  visible.value = true
}
const orgProjects = computed(() => projects.filter(p => p.org === current.value?.name).slice(0, 4))
</script>

<template>
  <div class="page">
    <PageHead title="志愿组织" desc="对参与城市管理志愿服务的社区、志愿服务队伍和相关组织进行统一管理">
      <el-button type="primary" size="large" @click="ElMessage.info('已打开组织入驻申请（演示）')">
        <i class="i-ri-add-line mr-6px" />组织入驻
      </el-button>
    </PageHead>

    <section class="card mb-14px flex items-center gap-14px">
      <span>所属区域</span>
      <el-radio-group v-model="region">
        <el-radio-button label="全部" value="" />
        <el-radio-button v-for="d in districts.slice(0, 8)" :key="d" :label="d" :value="d" />
      </el-radio-group>
      <el-input v-model="keyword" placeholder="搜索组织名称" clearable class="ml-auto !w-220px">
        <template #prefix>
          <i class="i-ri-search-line" />
        </template>
      </el-input>
    </section>

    <section class="grid">
      <div v-for="o in rows" :key="o.id" class="card org" @click="open(o)">
        <div class="flex items-center gap-12px">
          <span class="logo"><AppLogo /></span>
          <div class="min-w-0 flex-1">
            <div class="name">
              {{ o.name }}
            </div>
            <span v-if="o.verified" class="soft-tag blue mt-4px"><i class="i-ri-shield-check-fill mr-2px" />实名认证</span>
            <span v-else class="soft-tag gray mt-4px">认证中</span>
          </div>
        </div>
        <div class="meta">
          <div><i class="i-ri-map-pin-line" />{{ o.region }}</div>
          <div><i class="i-ri-user-line" />{{ o.contact }} {{ o.phone }}</div>
          <div><i class="i-ri-flag-line" />服务范围：{{ o.scope }}</div>
        </div>
        <div class="stats">
          <div><b>{{ o.members }}</b><span>组织成员</span></div>
          <div><b>{{ o.projects }}</b><span>发布项目</span></div>
          <div><b>{{ o.activities }}</b><span>开展活动</span></div>
          <div><b>{{ o.rating }}</b><span>组织评分</span></div>
        </div>
      </div>
    </section>

    <el-dialog v-model="visible" :title="current?.name" width="640px">
      <template v-if="current">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="所属区域">
            {{ current.region }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ current.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ current.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="成员数量">
            {{ current.members }} 人
          </el-descriptions-item>
          <el-descriptions-item label="服务范围" :span="2">
            {{ current.scope }}
          </el-descriptions-item>
          <el-descriptions-item label="累计参与人次" :span="2">
            {{ current.participants }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="mb-8px mt-16px font-600">
          已发布项目
        </div>
        <div v-for="p in orgProjects" :key="p.id" class="proj" @click="router.push(`/project/detail/${p.id}`)">
          <img :src="p.img" alt=""><span class="flex-1">{{ p.title }}</span><span class="text-muted">{{ p.start }}</span>
        </div>
        <el-empty v-if="!orgProjects.length" :image-size="60" description="暂无项目" />
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.org {
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: 0 8px 20px rgba(22, 64, 128, 0.12);
    transform: translateY(-2px);
  }

  .logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #1a6fe0, #4aa3ff);
  }

  .name {
    font-weight: 700;
    font-size: 16px;
  }

  .meta {
    margin: 14px 0;
    font-size: 13px;
    color: var(--cv-text-2);
    line-height: 24px;

    i {
      margin-right: 6px;
      color: var(--cv-text-3);
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #f5f8fd;
    border-radius: 6px;
    padding: 10px 0;
    text-align: center;

    b {
      display: block;
      font-size: 18px;
      color: #15233a;
    }

    span {
      font-size: 12px;
      color: var(--cv-text-3);
    }
  }
}

.proj {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  cursor: pointer;

  img {
    width: 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }

  &:hover {
    color: var(--cv-primary);
  }
}
</style>
