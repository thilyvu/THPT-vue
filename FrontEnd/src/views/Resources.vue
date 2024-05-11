<template>
  <div>
    <TableLoading v-if="loading"> </TableLoading>
    <a-card v-else style="padding : 1rem 1% 1rem">
      <h5>Document</h5>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="12" class="responsive-btn-document">
          <BreadcrumbDocument
            :list="breadcrumbList"
            @backRoot="backRoot"
            :key="updateRoot"
          />
        </a-col>
        <a-col :span="12">
          <ButtonDocument
            v-if="!isResource"
            :root="breadcrumbList"
            @addFolder="addFolder"
            @addFile="addFile"
          />
        </a-col>
      </a-row>
      <TableLoading v-if="folderLoading"> </TableLoading>
      <DocumentList
        v-else
        :listFile="listFile"
        :listFolder="listFolder"
        :isResource="true"
        @delete="deleteFileFolder"
        @renameFile="renameFile"
        @renameFolder="renameFolder"
        @chooseFile="chooseFile"
        @enter="enterFolder"
      />
    </a-card>
  </div>
</template>

<script>
import { NotificationMixin } from "../mixin/Notification";
import FileFolder from "../api/FileFolder";

import DocumentList from "../components/Document/DocumentList.vue";
import BreadcrumbDocument from "../components/Document/BreadcrumbDocument.vue";
import ButtonDocument from "../components/Document/ButtonDocument.vue";
import TableLoading from "../components/Base/TableLoading.vue";
export default {
  mixins: [NotificationMixin],
  props: {
    isResource: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ButtonDocument,
    BreadcrumbDocument,
    DocumentList,
    TableLoading,
  },
  data() {
    return {
      breadcrumbList: [{ id: "0", name: "" }],
      updateRoot: 0,
      listFile: null,
      listFolder: null,
      loading: false,
      folderLoading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.getFileFolder();
  },
  computed: {
    parentId() {
      return this.breadcrumbList.length > 1 && this.breadcrumbList.at(-1).id;
    },
  },
  methods: {
    addFolder(payload) {
      FileFolder.createFolder(payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Add new folder successfully"
          );
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Add new folder failed",
            error.response.data.message
          );
        });
    },
    addFile(payload) {
      FileFolder.createFile(payload)
        .then((res) => {
          this.openNotificationWithIcon("success", "Add new file successfully");
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Add new file failed",
            error.response.data.message
          );
        });
    },
    deleteFileFolder(id) {
      FileFolder.deleteFileFolder(id)
        .then((res) => {
          this.openNotificationWithIcon("success", "Delete successfully");
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Delete failed",
            error.response.data.message
          );
        });
    },
    renameFile(id, payload) {
      FileFolder.updateFile(id, payload)
        .then((res) => {
          this.openNotificationWithIcon("success", "Change file name successfully");
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Đổi tên file thất bại",
            error.response.data.message
          );
        });
    },
    renameFolder(id, payload) {
      FileFolder.updateFolder(id, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Change folder name successfully"
          );
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Change folder name failed",
            error.response.data.message
          );
        });
    },
    enterFolder(item) {
      this.folderLoading = true;
      this.breadcrumbList.push({ id: item._id, name: item.fileName });
      this.getFileFolder();
    },
    backRoot(list) {
      this.folderLoading = true;
      this.breadcrumbList = list;
      this.updateRoot++;
      this.getFileFolder();
    },
    chooseFile(item) {
      this.$emit("chooseFile", item);
    },
    getFileFolder() {
      if (this.parentId) {
        FileFolder.getListSubFolderById(this.parentId)
          .then((res) => {
            this.listFile = res.data.data.filter((i) => i.fileType === "file");
            this.listFolder = res.data.data.filter(
              (i) => i.fileType === "folder"
            );
            this.loading = false;
            this.folderLoading = false;
          })
          .catch((e) => {
            console.log("e", e);

            this.folderLoading = false;
            this.loading = false;
          });
      } else {
        FileFolder.getListUserFolder()
          .then((res) => {
            this.listFile = res.data.data.filter((i) => i.fileType === "file");
            this.listFolder = res.data.data.filter(
              (i) => i.fileType === "folder"
            );

            this.folderLoading = false;
            this.loading = false;
          })
          .catch((e) => {
            console.log("e", e);

            this.folderLoading = false;
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss">
@media (max-width: 1000px) { 
  .responsive-btn-document {
    display: none !important;
  }
}
</style>
