<template>
  <error-code-page
    v-if="error.statusCode === 404"
    :code="404"
    :message="'抱歉，你访问的页面不存在'"
  />
  <error-code-page
    v-else-if="error.statusCode === 403"
    :code="403"
    :message="'抱歉，你无权访问该页面'"
  />
  <h1 v-else>
    应用发生错误异常
  </h1>
</template>
<script>
import errorCodePage from '~/components/errorCodePage';

export default {
  components: {
    errorCodePage
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  layout: 'none'
};
</script>
