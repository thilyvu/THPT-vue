<template>
  <a-breadcrumb>
    <a-breadcrumb-item href="" v-for="(item, index) in list" :key="item.id"
      ><span @click="backRoot(index)">{{ item.name }}</span></a-breadcrumb-item
    >
  </a-breadcrumb>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      test: this.list,
    };
  },
  methods: {
    backRoot(element) {
      this.test = this.test.splice(element+1,this.list.length-element-1)
      this.$emit('backRoot', this.list)
    },
  },
};
</script>

<style>
</style>