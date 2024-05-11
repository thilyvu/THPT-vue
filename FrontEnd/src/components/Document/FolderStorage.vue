<template>
  <div style="text-align: center">
    <img
      src="./png/folder.svg"
      alt=""
      style="width: 100px; cursor: pointer"
      @click="enterFolder"
    />
    <a-space size="small" direction="horizontal" align="center">
      <p class="folder-file-name" style="margin-bottom: 0px">
        {{ item.fileName }}
      </p>
      <a-dropdown
        v-if="handleRole"
      >
        <a class="icon-more" @click="(e) => e.preventDefault()">
          <a-icon type="more"
        /></a>
        <a-menu slot="overlay">
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
      title="Delete folder"
      v-model="isDelete"
      okText="delete"
      okType="danger"
      @ok="deleteFolder"
      cancelText="Cancel"
      @cancel="isDelete = false"
      >Do you want to delete this folder ?</a-modal
    >
    <a-modal
      v-model="isRename"
      title="Rename folder"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="renameFolder"
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
      name: this.item.fileName,
    };
  },
  methods: {
    enterFolder() {
      this.$emit("enter", this.item);
    },
    deleteFolder() {
      this.$emit("delete", this.item._id);
      this.isDelete = false;
    },
    renameFolder() {
      const payload = {
        fileName: this.name,
      };
      this.$emit("rename", this.item._id, payload);
      this.isRename = false;
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    currentPath() {
      //1-học liệu 2-Tài liệu trong lớp 3-tạo, chỉnh sửa bt
      return this.$route.path.split('/').at(-1) === "resources"
        ? "1"
        : this.$route.path.split('/').at(-1) === "document"
        ? "2"
        : "3";
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    handleRole() {
      return this.currentPath == "1"
        ? true
        : this.currentPath == "2" && this.userProfile.role === "teacher"
        ? true
        : false;
    },
  },
};
</script>

<style>
</style>