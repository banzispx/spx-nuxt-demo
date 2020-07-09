<template>
  <section>
    slott
    <keep-alive>
      <slot-com v-slot:default="lllll">
        {{ lllll.person.age + 1 }}
      </slot-com>
    </keep-alive>
  </section>
</template>
<script>
import slotCom from '../components/slotCom';
export default {
  components: { slotCom },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped></style>
