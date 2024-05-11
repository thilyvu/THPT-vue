<template>
  <a-card class="remove-box-shadow" hoverable>
    <div>
      <a-row :gutter="10" type="flex" align="middle">
        <a-col><a-avatar :src="userProfile.avatar" class="avatar" /></a-col>
        <a-col style="width: 90%" class="responsive-post-textbox"
          ><a-textarea
            v-model="payload.content"
            placeholder="Enter content discussion with the class"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            style="border: 1px solid #fff; max-width: 100%"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          list-type="picture-card"
          :file-list="fileList"
          :multiple="mutilple"
          @preview="handlePreview"
          @change="handleChange"
        />
        <!-- <img v-if="picture" :src="picture" style="width: 100%" /> -->
        <a-progress v-if="loading" :percent="uploadValue" />
      </a-row>
      <a-modal
        :visible="previewVisible"
        :footer="null"
        @cancel="previewVisible = false"
      >
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
    <a-divider  style="margin-bottom: 0px" />
    <a-row :gutter="10" type="flex" align="middle" justify="end">
      <a-col style="display: flex" v-if="!uploadLoading">
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="chooseImg"
          accept="image/*"
          multiple
        />
        <div style="margin-right: 1.5rem">
          <img src="../../assets/vote.png" style="width: 25px" />
          <a-button size="large" type="link" @click="isShow = true">
            <span>Poll </span>
          </a-button>
        </div>
        <div>
          <img src="../../assets/images.png" style="width: 25px" />
          <a-button
            size="large"
            type="link"
            v-if="!uploadLoading"
            class="btn-image"
            @click="$refs.file.click()"
          >
            <span>Pictures </span>
          </a-button>
        </div>
      </a-col>
      <TableLoading v-else />
      <a-divider class="responsive-remove-divider" type="vertical" style="height: 30px" />
      <a-col
        ><a-button type="link" size="large" @click="createNewsfeed">
          Post
        </a-button></a-col
      >
    </a-row>
    <a-modal v-model="isShow" max-width="500" :footer="null">
      <PollForm @closeDialog="handleCloseDialog" :classId="classId"></PollForm>
    </a-modal>
  </a-card>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import { NotificationMixin } from "../../mixin/Notification";
import TableLoading from "../Base/TableLoading.vue";
import PollForm from "./components/PollForm.vue";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  mixins: [FirebaseStorageMixin, LocalStorageMixin, NotificationMixin],
  components: {
    TableLoading,
    PollForm,
  },
  props: {
    classId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imageData: null,
      mutilple: true,
      picture: null,
      isShow: false,
      uploadValue: 0,
      payload: {
        content: "",
        image: "",
        classId: this.classId,
      },
      randomString: (Math.random() + 1).toString(36).substring(5),
      previewVisible: false,
      previewImage: "",
      fileList: [],
      uploadLoading: false,
    };
  },
  methods: {
    async chooseImg(event) {
      this.uploadLoading = true;
      const fileList = [];
      for (let i = 0; i < event.target.files.length; i++) {
        fileList.push(event.target.files[i]);
      }
      await Promise.all(
        fileList.map(async (file) => {
          const fileName = `class/${this.classId}/newsfeed/${file.name}`;
          try {
            const url = await FirebaseStorageMixin.methods.uploadToFireBase(
              file,
              fileName
            );
            return url;
          } catch (e) {
            console.log(e);
            this.uploadLoading = false;
          }
        })
      ).then((filesUploaded) => {
        this.fileList = [];
        this.payload.image = "";
        filesUploaded.map((file, index) => {
          this.fileList.push({
            uid: index,
            name: `${index}`,
            url: file,
            status: "done",
          });
        });
        this.payload.image = filesUploaded;
        this.uploadLoading = false;
      });
    },
    createNewsfeed() {
      this.$emit("clicked", this.payload);
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
      this.deleteFirebase(`class/${this.classId}/newsfeed/${file.name}`);
    },
    handleCloseDialog() {
      this.$emit("refresh");
      this.isShow = false;
    },
    uploadImage() {
      const payload = {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: this.picture,
      };
      this.fileList.push(payload);
    },
    execute() {
      this.uploadImage();
    },
  },
  computed: {
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
.remove-box-shadow {
  box-shadow: none !important;
}
.btn-image {
  svg {
    margin-bottom: 3px;
  }
}
@media only screen and (max-width: 900px) {
  .responsive-post-textbox {
    width: 80% !important;
  }
}
@media only screen and (max-width: 400px) {
  .responsive-remove-divider {
    display: none !important;
  }
}
</style>
