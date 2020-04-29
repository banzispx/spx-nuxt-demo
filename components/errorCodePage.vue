<template>
  <section class="position-fixed full-height full-width">
    <div class="d-flex justify-content-center align-items-center full-height full-width">
      <div class="w-55 text-right pr-10">
        <img
          :src="`/images/${code}.png`"
          :alt="code"
          class="mr-10"
        >
      </div>
      <div class="w-45">
        <p class="text-80 color-error--title">
          {{ code }}
        </p>
        <p class="text-20 mt-4 text-gray">
          {{ message }}
        </p>
        <div class="mt-5">
          <router-link
            :to="{name: 'index'}"
            replace
          >
            <el-button type="primary">
              返回首页
            </el-button>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    code: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
};
</script>
