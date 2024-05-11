<template>
  <a-space direction="vertical" style="width: 100%, border-radius: 20px;">
    <h6 style="margin-top: 10px; margin-bottom: 0px">Thông báo</h6>
    <a-button icon="plus" size="large" style="width: 100%">
      Tạo thông báo
    </a-button>
    <a-alert message="Tên thông báo" type="success" closable>
      <p slot="description">
        30 tháng 8 lúc 8h20
      </p>
    </a-alert>
  </a-space>
</template>

<script>
export default {

}
</script>

<style>

</style>