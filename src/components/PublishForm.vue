<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHead from '~/components/PageHead.vue'
import { activities, districts, garbageTemplates, projects, serviceTypes } from '~/mock'

const props = defineProps<{ kind: 'project' | 'activity' }>()
const route = useRoute()
const router = useRouter()
const isProject = props.kind === 'project'
const noun = isProject ? '项目' : '活动'

const editing = !isProject && route.query.id ? activities.find(a => a.id === Number(route.query.id)) : undefined

const form = reactive({
  template: '',
  project: '',
  name: editing?.name ?? '',
  type: editing?.type ?? '',
  region: editing?.region ?? '',
  address: '',
  time: editing ? [editing.start, editing.end] : [] as string[],
  deadline: '',
  recruit: editing?.recruit ?? 30,
  posts: ['宣传引导'],
  training: false,
  condition: '',
  content: '',
  contact: '',
  phone: '',
})

const rules: FormRules = {
  name: [{ required: true, message: `请输入${noun}名称`, trigger: 'blur' }],
  type: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  region: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
  time: [{ required: true, message: '请选择时间', trigger: 'change' }],
}

function applyTemplate(name: string) {
  const t = garbageTemplates.find(x => x.name === name)
  if (!t)
    return
  form.type = '垃圾分类'
  form.name = form.name || `${t.name}志愿活动`
  form.content = t.desc
  form.training = true
  ElMessage.success(`已套用模板「${t.name}」，请补充社区、点位、时间和招募人数`)
}

const formRef = ref<FormInstance>()
async function submit(draft = false) {
  if (!draft)
    await formRef.value?.validate()
  ElMessage.success(draft ? '已保存为草稿' : `${noun}已提交，等待审核`)
  router.push(isProject ? '/project/audit' : '/activity/list')
}
</script>

<template>
  <div class="page">
    <PageHead :title="editing ? `编辑${noun}` : `${noun}发布`" :desc="isProject ? '创建一类持续性或阶段性的志愿服务工作' : '在项目下建立具体一次服务安排，发布后志愿者即可报名'" />

    <section class="card form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <div class="section-title">
          基本信息
        </div>
        <el-row :gutter="24">
          <el-col v-if="!isProject" :span="12">
            <el-form-item label="所属项目">
              <el-select v-model="form.project" placeholder="请选择所属项目" filterable class="w-full">
                <el-option v-for="p in projects.slice(0, 12)" :key="p.id" :label="p.title" :value="p.title" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动模板">
              <el-select v-model="form.template" placeholder="垃圾分类专题模板（可选）" clearable class="w-full" @change="applyTemplate">
                <el-option v-for="t in garbageTemplates" :key="t.name" :label="t.name" :value="t.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${noun}名称`" prop="name">
              <el-input v-model="form.name" :placeholder="`请输入${noun}名称`" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" class="w-full">
                <el-option v-for="t in serviceTypes" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="region">
              <el-select v-model="form.region" placeholder="请选择" class="w-full">
                <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地点">
              <el-input v-model="form.address" placeholder="如：望京街道光华里社区东门">
                <template #suffix>
                  <i class="i-ri-map-pin-line" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="section-title">
          招募设置
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="`${noun}时间`" prop="time">
              <el-date-picker
                v-model="form.time" type="datetimerange" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm"
                start-placeholder="开始时间" end-placeholder="结束时间" class="!w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名截止">
              <el-date-picker v-model="form.deadline" type="datetime" placeholder="请选择报名截止时间" class="!w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="招募人数">
              <el-input-number v-model="form.recruit" :min="1" :max="500" class="!w-200px" /> <span class="text-muted ml-8px">人</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位设置">
              <el-checkbox-group v-model="form.posts">
                <el-checkbox v-for="p in ['宣传引导', '桶前值守', '环境清理', '秩序维护']" :key="p" :label="p" :value="p" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训要求">
              <el-switch v-model="form.training" active-text="需完成垃圾分类基础培训" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名条件">
              <el-input v-model="form.condition" placeholder="如：年满16周岁、已实名认证" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务内容">
              <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请描述服务内容、岗位职责和注意事项" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="section-title">
          联系信息
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面图片">
              <div class="upload">
                <i class="i-ri-upload-line text-24px" />
                <span>点击上传</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" size="large" class="!w-120px" @click="submit()">
            提交审核
          </el-button>
          <el-button size="large" class="!w-120px" @click="submit(true)">
            保存草稿
          </el-button>
          <el-button size="large" class="!w-120px" @click="router.back()">
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.form-card {
  padding: 8px 40px 20px 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 18px 0 16px;
  padding-left: 10px;
  border-left: 4px solid var(--cv-primary);
  line-height: 1;
}

.upload {
  width: 148px;
  height: 100px;
  border: 1px dashed #c9d3e0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--cv-text-3);
  cursor: pointer;

  &:hover {
    border-color: var(--cv-primary);
    color: var(--cv-primary);
  }
}
</style>
