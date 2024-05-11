<template>
  <div style="text-align: end">
    <a-space direction="horizontal" align="center" class="responsive-document">
      <input type="file" ref="file" style="display: none" @change="chooseImg" />
      <v-btn
        :loading="loading"
        color="blue-grey"
        class="ma-2 white--text responsive-document-item"
        @click="$refs.file.click()"
      >
        Upload file
        <v-icon right dark> mdi-cloud-upload </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        dark
        @click="isAddFolder = true"
        style="width: 100%"
        >Add new folder
      </v-btn>
    </a-space>
    <a-modal
      v-model="isAddFolder"
      title="Add new folder"
      ok-text="Add"
      cancel-text="Cancel"
      @ok="addFolder"
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
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { LocalStorageMixin } from "../../mixin/LocalStorage";

export default {
  mixins: [FirebaseStorageMixin, LocalStorageMixin],
  props: {
    root: {
      type: Array,
      default: [],
    },
    classId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isAddFolder: false,
      name: "",
      fileName: "",
      randomString: (Math.random() + 1).toString(36).substring(5),
      fileSize: 0,
    };
  },
  methods: {
    addFolder() {
      const payload = {
        fileName: this.name,
      };
      if (this.classId) payload.classId = this.classId;
      if (this.root.length > 1) {
        payload.parentId = this.root.at(-1).id;
      }
      this.$emit("addFolder", payload);
      this.name = "";
      this.isAddFolder = false;
    },
    chooseImg(event) {
      this.fileName = event.target.files[0].name;
      this.fileSize = event.target.files[0].size;
      if (this.classId) {
        this.handleImageFile(
          event.target.files[0],
          `class/${this.classId}/fileStorage/${this.randomString}/${this.fileName}`
        );
      } else {
        this.handleImageFile(
          event.target.files[0],
          `class/${this.userProfile.id}/fileStorage/${this.randomString}/${this.fileName}`
        );
      }
    },
    addFile() {
      const payload = {
        fileName: this.fileName,
        extension: this.extension,
        thumbnailUrl: this.randomString + "_" + this.picture,
        fileSize: this.fileSize,
      };
      if (this.classId) payload.classId = this.classId;

      if (this.root.length > 1) {
        payload.parentId = this.root.at(-1).id;
      }
      this.$emit("addFile", payload);
    },
    execute() {
      this.addFile();
    }
  },
  computed: {
    extension() {
      if (this.extensionFile) return this.extensionFile;
      const temp = this.fileName.split(".")[1];
      if (temp === "pdf") return "pdf";
      else if (temp === "png" || temp === "jpg") return "picture";
      else if (temp === "doc" || temp === "docx") {
        return "word";
      } else if (temp === "ppt" || temp === "pptx") {
        return "ppt";
      } else if (temp === "xlsx") {
        return "excel";
      }
    },
    loading() {
      if (this.picture === null && this.uploadValue > 0) return true;
      else if (this.picture !== null && this.uploadValue === 100) {
        return false;
      }
      return false;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>

<style lang="scss">
@media (max-width: 1000px) { 
  .responsive-document {
    padding: 10px 0px 20px 0px;
  }
}
@media (max-width: 400px) { 

  .responsive-document {
    display: grid;
    padding: 10px 0px 20px 0px;
  }
  .responsive-document-item {
    margin-bottom: 0.5rem;
  }
}
</style>