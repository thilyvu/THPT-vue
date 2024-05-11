<template>
  <div>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>Folder</a-col>
      <a-col>
        <a-button type="link" size="large" class="icon">
          <a-icon type="folder-add" theme="filled" />
        </a-button>
      </a-col>
    </a-row>
    <a-button type="link" size="large">
      <a-icon type="folder" theme="filled" /> All folder
    </a-button>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <a-button type="link" size="large">
          <a-icon type="folder" theme="filled" /> Folder name
        </a-button>
      </a-col>
      <a-col>
        <a-dropdown>
          <a class="icon" @click="(e) => e.preventDefault()">
            <a-icon type="more"
          /></a>
          <a-menu slot="overlay">
            <a-menu-item @click="classAction('edit')">
              <a-icon type="edit" /> Rename
            </a-menu-item>
            <a-menu-item @click="classAction('remove')">
              <a-icon type="delete" /> Delete
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {};
</script>

<style>
.icon {
  padding-right: 0px;
  font-size: 24px;
}
</style>
