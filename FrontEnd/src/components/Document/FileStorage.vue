<template>
  <div style="text-align: center">
    <component :is="handleRole==='4'?'div':'a'" :href="item.thumbnailUrl.split('_')[1]" download target="_blank" @click="handleRole=='4'?chooseFile(item):''">
      <img
        v-if="item.extension === 'pdf'"
        src="./png/file-pdf-icon.png"
        class="file-icon"
      />
      <img
        v-else-if="item.extension === 'picture'"
        :src="item.thumbnailUrl.split('_')[1]"
        class="file-icon"
      />
      <img
        v-if="item.extension === 'word'"
        src="./png/file-word-icon.png"
        class="file-icon"
      />
      <img
        v-else-if="item.extension === 'excel'"
        src="./png/file-excel-icon.png"
        class="file-icon"
      />
      <img
        v-else-if="item.extension === 'ppt'"
        src="./png/file-ppt-icon.png"
        class="file-icon"
      />
    </component>
    <a-space size="small" direction="horizontal" align="center">
      <p class="folder-file-name" style="margin-bottom: 0px">
        {{ item.fileName }}
      </p>
      <a-dropdown v-if="handleRole!=='3'">
        <a class="icon-more" @click="(e) => e.preventDefault()">
          <a-icon type="more"
        /></a>
        <a-menu slot="overlay" v-if="handleRole!=='4'">
          <a-menu-item @click="isRename = true">
            <a-icon type="edit" /> Rename
          </a-menu-item>
          <a-menu-item @click="isDelete = true">
            <a-icon type="delete" /> Delete
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-space>
    <a-modal
      title="Delete file"
      v-model="isDelete"
      okText="Delete"
      okType="danger"
      @ok="deleteFile"
      cancelText="Cancel"
      @cancel="isDelete = false"
      >Are you sure to delete this file?</a-modal
    >
    <a-modal
      v-model="isRename"
      title="Rename folder"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="renameFile"
    >
      <v-text-field
        v-model="name"
        type="text"
        label="Folder name"
      ></v-text-field>
    </a-modal>
  </div>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";

export default {
  mixins: [LocalStorageMixin],
  props: {
    item: {
      type: Object,
      default: null,
    },
    isResource: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDelete: false,
      isRename: false,
      name: this.item.fileName.split(".")[0],
    };
  },
  methods: {
    deleteFile() {
      this.$emit("delete", this.item._id, this.thumbnailUrl);
      this.isDelete = false;
    },
    renameFile() {
      const payload = {
        fileName: this.name + "." + this.item.fileName.split(".")[1],
      };
      this.$emit("rename", this.item._id, payload);
      this.isRename = false;
    },
    chooseFile(item) {
      this.$emit("chooseFile", item);
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    thumbnailUrl() {
      return this.item.thumbnailUrl.split("_")[0];
    },
    currentPath() {
      const route = this.$route.path.split("/").at(-1);
      //1-học liệu 2-Tài liệu trong lớp 3-tạo, chỉnh sửa bt
      return route === "resources" ? "1" : route === "document" ? "2" : "3";
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    handleRole() {
      return this.currentPath == "1"
        ? "1"
        : this.currentPath == "2" && this.userProfile.role === "teacher"
        ? "2"
        : this.currentPath == "2" && this.userProfile.role === "student"
        ? "3"
        : "4";
    },
  },
};
</script>

<style>
.file-icon {
  width: 100px;
}
</style>