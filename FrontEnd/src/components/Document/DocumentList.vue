<template>
  <div>
    <h5>Folder</h5>
    <a-row :gutter="50" align="bottom" type="flex" class="file-folder responsive-file-folder">
      <a-col
        flex="100px"
        v-for="item in listFolder"
        :key="item._id"
        
        
      >
        <FolderStorage
          :item="item"
          :isResource="isResource"
          @delete="deleteFileFolder"
          @rename="renameFolder"
          @enter="enterFolder"
        />
      </a-col>
    </a-row>
    <h5 class="responsive-title">File</h5>
    <a-row :gutter="50" align="bottom" type="flex"   class="file-folder responsive-file-folder">
      <a-col
        flex="100px"
        v-for="item in listFile"
        :key="item._id"
      
      >
        <FileStorage
          :item="item"
          :isResource="isResource"
          @chooseFile="chooseFile"
          @delete="deleteFileFolder"
          @rename="renameFile"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import FileFolder from "../../api/FileFolder";

import FileStorage from "./FileStorage.vue";
import FolderStorage from "./FolderStorage.vue";

export default {
  mixins: [LocalStorageMixin],
  props: {
    isResource: {
      type: Boolean,
      default: false,
    },
    listFile: {
      type: Array,
      default: null,
    },
    listFolder: {
      type: Array,
      default: null,
    },
  },
  components: {
    FileStorage,
    FolderStorage,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    deleteFileFolder(id, thumbnailUrl) {
      this.$emit("delete", id, thumbnailUrl);
    },
    renameFile(id, payload) {
      this.$emit("renameFile", id, payload);
    },
    renameFolder(id, payload) {
      this.$emit("renameFolder", id, payload);
    },
    enterFolder(item) {
      this.$emit("enter", item);
    },
    chooseFile(item) {
      this.$emit("chooseFile", item);
    },
  },
  computed: {},
};
</script>

<style>
.file-folder {
  height: 130px;
  margin: 10px 0px;
}
.folder-file-name {
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
}
@media (max-width: 400px) { 
  .responsive-file-folder {
    width: 100vw !important;
  }
  .responsive-title {
    margin-top: 6rem;
  }
}
</style>