<template>
  <a-modal
    v-model="visible"
    title="Edit lectures"
    max-width="1200"
    :width="800"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <v-container>
      <a-row>
        <b>Tên bài giảng</b>
        <a-input
          style="margin-top: 0.5rem"
          placeholder="Enter lesson name"
          v-model="name"
        />
      </a-row>
      <a-row style="margin-top: 0.5rem">
        <b>Nội dung bài giảng</b>
        <ckeditor
          :editor="editor"
          @ready="onReady"
          v-model="content"
          :config="editorConfig"
        ></ckeditor>
        <!-- <vue-editor
          style="margin-top: 0.5rem; margin-bottom: 0.5rem"
          v-model.trim="content"
          :id="makeid(5)"
        ></vue-editor> -->
      </a-row>
      <a-row style="margin-top: 0.5rem">
        <b>Video for the lecture (Youtube link)</b>
        <a-input
          style="margin-top: 0.5rem"
          placeholder="Enter the Youtube link of the lecture"
          v-model="linkYoutube"
        />
      </a-row>
      <a-row style="margin-top: 0.5rem">
        <b>Banner for lecture</b>
        <BannerLesson
          :classId="classId"
          :randomLectureId="randomLectureId"
          @clicked="uploadBanner"
        />
      </a-row>
      <a-row style="margin-top: 0.5rem">
        <b>Attach more files for the lecture</b>
      </a-row>
      <a-row style="margin-top: 0.5rem">
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="chooseFiles"
          multiple
        />
        <a-button
          :loading="uploadLoading"
          type="link"
          @click="$refs.file.click()"
        >
          <a-icon
            v-if="!uploadLoading"
            style="font-size: 20px"
            type="paper-clip"
          ></a-icon>
          <span style="font-size: 15px">Upload</span>
        </a-button>
        <a-upload
          :file-list="fileList"
          name="file"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
        >
        </a-upload>
      </a-row>
      <a-divider style="margin: 12px 12px 24px 0px" />
      <div style="display: flex; justify-content: end">
        <v-btn class="mr-4" @click="closeModal"> Cancel </v-btn>
        <v-btn
          :loading="loading"
          dark
          color="primary"
          class="mr-4"
          @click="handleOk"
        >
          Edit
        </v-btn>
      </div>
    </v-container>
  </a-modal>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue2";
import BannerLesson from "./BannerLesson";

import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import UploadLessonVideo from "./UploadLessonVideo";
import { NotificationMixin } from "../../mixin/Notification";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { VueEditor } from "vue2-quill-editor";
import Lecture from "../../api/Lecture";
import { MyUploadAdapter } from "./AddLessonModal.vue";
export default {
  mixins: [FirebaseStorageMixin, NotificationMixin],
  components: {
    UploadLessonVideo,
    BannerLesson,
    VueEditor,
    ckeditor: CKEditor.component,
  },
  props: {
    record: {
      type: Object,
      default: null,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    record: function (val) {
      if (val) {
        (this.linkYoutube = val.videoUrl ? val.videoUrl : ""),
          (this.name = val.name ? val.name : ""),
          (this.bannerImg = val.bannerImg ? val.bannerImg : ""),
          (this.content = val.content ? val.content : ""),
          (this.fileList = val.fileUrls ? val.fileUrls : []);
      }
    },
    isShow: function (val) {
      if (val) {
        this.visible = val ? val : false;
      }
    },
  },
  data() {
    return {
      isEdit: false,
      newImg: null,
      linkYoutube: "",
      name: "",
      bannerImg: "",
      content: "",
      editor: DecoupledEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        toolbar: {
          // plugins : [Table],
          items: [
            "heading",
            "|",
            "alignment",
            "|",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "subscript",
            "superscript",
            "|",
            "link",
            "|",
            "outdent",
            "indent",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "code",
            "codeBlock",
            "|",
            "insertTable",
            "uploadImage",
            "blockQuote",
            "|",
            "undo",
            "redo",

            "fontfamily",
            "fontsize",
            "|",
          ],
          shouldNotGroupWhenFull: true,
        },
      },
      fileList: [],
      randomLectureId: (Math.random() + 1).toString(36).substring(5),
      uploadLoading: false,
      loading: false,
      visible: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
  },
  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
      };
      console.log(editor);
    },
    handleOk() {
      this.loading = true;
      const payload = {
        name: this.name,
        bannerImg: this.bannerImg,
        content: this.content,
        videoUrl: this.videoSrc(this.linkYoutube),
        fileUrls: this.fileList,
      };
      Lecture.updateLecture(this.record._id, payload)
        .then(() => {
          this.openNotificationWithIcon(
            "success",
            "Update lecture successfully"
          );
          this.loading = false;
          this.$emit("refresh");
          this.closeModal();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Update lecture failed",
            error.response.data.message
          );
          this.loading = false;
          this.closeModal();
        });
    },
    handleCancel() {
      this.closeModal();
    },
    uploadBanner(img) {
      this.newImg = img;
    },
    async chooseFiles(event) {
      this.uploadLoading = true;
      const fileList = [];
      for (let i = 0; i < event.target.files.length; i++) {
        fileList.push(event.target.files[i]);
      }
      await Promise.all(
        fileList.map(async (file) => {
          file.url = "";
          const fileName = `class/${this.classId}/lecture/add/${file.name}`;
          try {
            const url = await FirebaseStorageMixin.methods.uploadToFireBase(
              file,
              fileName
            );
            file.url = url;
            return file;
          } catch (e) {
            console.log(e);
            this.uploadLoading = false;
          }
        })
      ).then((filesUploaded) => {
        this.fileList = [];
        // this.payload.image = "";
        filesUploaded.map((file, index) => {
          console.log(file);
          this.fileList.push({
            uid: index,
            name: file.name,
            url: file.url,
            status: "done",
            extension: file.type,
          });
        });
        // this.payload.image = filesUploaded;
        this.uploadLoading = false;
      });
    },
    handleChange({ fileList }) {
      const results = this.fileList.filter(
        ({ name: name1 }) =>
          !fileList.some(({ name: name2 }) => name2 === name1)
      );
      this.fileList = fileList;
      this.deleteFirebase(`class/${this.classId}/newsfeed/${results[0].name}`);
    },
    makeid(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    convertURL(url) {
      let regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      let match = url.match(regExp);

      return match && match[2].length === 11 ? match[2] : null;
    },
    videoSrc(url) {
      return `//www.youtube.com/embed/${this.convertURL(url)}`;
    },
    closeModal() {
      this.visible = false;
      this.$emit("closed");
    },
  },
};
</script>

<style></style>
