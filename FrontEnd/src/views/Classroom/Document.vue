<template>
  <div class="responsive-document-container">
    <TableLoading v-if="loading"></TableLoading>
    <div v-else>
      <h5>Folder</h5>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="userProfile.role === 'teacher' ? 12 : 24">
          <BreadcrumbDocument
            :list="breadcrumbList"
            @backRoot="backRoot"
            :key="updateRoot"
          />
        </a-col>
        <a-col :span="12" v-if="userProfile.role === 'teacher'">
          <ButtonDocument
            :classId="classId"
            :root="breadcrumbList"
            @addFolder="addFolder"
            @addFile="addFile"
          />
        </a-col>
      </a-row>
      <TableLoading v-if="folderLoading"></TableLoading>
      <div v-else>
        <DocumentList
        v-if="listFile.length > 0 && listFolder.length >0"
        :listFile="listFile"
        :listFolder="listFolder"
        @delete="deleteFileFolder"
        @renameFile="renameFile"
        @renameFolder="renameFolder"
        @enter="enterFolder"
      />
      <div v-else style="display :grid; text-align: center;">
              <div style="display :flex; text-align: center;align-items: center; justify-content: center;">
                <img   class ="responsive-image-nodata" src="../../../public/images/ic_empty.png" />
              </div>
             
              <p style="font-size : 14px">No data</p>
            </div>
      </div>
     
    </div>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import FileFolder from "../../api/FileFolder";

import DocumentList from "../../components/Document/DocumentList.vue";
import BreadcrumbDocument from "../../components/Document/BreadcrumbDocument.vue";
import ButtonDocument from "../../components/Document/ButtonDocument.vue";
import TableLoading from "../../components/Base/TableLoading.vue";
export default {
  mixins: [FirebaseStorageMixin, NotificationMixin, LocalStorageMixin],
  components: {
    ButtonDocument,
    BreadcrumbDocument,
    DocumentList,
    TableLoading,
  },
  data() {
    return {
      breadcrumbList: [{ id: "0", name: "Document" }],
      updateRoot: 0,
      listFile: null,
      listFolder: null,
      loading: false,
      folderLoading: false,
    };
  },
  computed: {
    parentId() {
      return this.breadcrumbList.length > 1 && this.breadcrumbList.at(-1).id;
    },
    classId() {
      return this.$route.params.id;
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
    deleteFileFolder(id, thumbnailUrl) {
      FileFolder.deleteFileFolder(id)
        .then((res) => {
          this.openNotificationWithIcon("success", "Delete successfully");
          this.getFileFolder();
          // this.deleteFirebase(thumbnailUrl)
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
            "Change file name failed",
            error.response.data.message
          );
        });
    },
    renameFolder(id, payload) {
      FileFolder.updateFolder(id, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Change foldername successfully"
          );
          this.getFileFolder();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Change foldername failed",
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
    getFileFolder() {
      if (!this.classId) {
        if (this.parentId) {
          FileFolder.getListSubFolderById(this.parentId)
            .then((res) => {
              this.listFile = res.data.data.filter(
                (i) => i.fileType === "file"
              );
              this.listFolder = res.data.data.filter(
                (i) => i.fileType === "folder"
              );
              this.loading = false;
              this.folderLoading = false;
            })
            .catch((e) => {
              console.log("e", e);
              this.loading = false;
              this.folderLoading = false;
            });
        } else {
          FileFolder.getListUserFolder()
            .then((res) => {
              this.listFile = res.data.data.filter(
                (i) => i.fileType === "file"
              );
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
        }
      } else if (this.parentId) {
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
            this.loading = false;

            this.folderLoading = false;
          });
      } else {
        FileFolder.getListClassFolder(this.classId)
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
            this.loading = false;

            this.folderLoading = false;
          });
      }
    },
  },
  mounted() {
    this.loading = true;
    this.getFileFolder();
  },
};
</script>

<style lang="scss">
.responsive-image-nodata {
  width: 23%
}
.responsive-document-container {
      margin-right: 1%;
      // min-width: 78vw;
    }
@media only screen and (max-width: 1000px) {
    .responsive-document-container {
      margin-left: 12%;
      
      // min-width: 78vw;
    }
    .responsive-image-nodata {
        width: 45% !important
    }
  }
  @media only screen and (max-width: 400px) {
    .responsive-document-container {
      margin-left: 5% !important;
      margin-top: -60%;
      // min-width: 78vw;
    }
  }  
</style>
