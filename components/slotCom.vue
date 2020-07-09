<template>
  <section>
    <button @click="change">
      切换
    </button>
    <slot :person="person">
      {{ person.name }}
    </slot>
  </section>
</template>
<script>
export default {
  data() {
    return {
      person: {
        name: '12121',
        age: 18
      }
    };
  },
  mounted() {
    console.log(121212);
  },
  beforeUpdate() {
    console.log('update');
  },
  methods: {
    change() {
      this.person = {

      };
    }
  }
};
</script>
<style lang="scss" scoped></style>
