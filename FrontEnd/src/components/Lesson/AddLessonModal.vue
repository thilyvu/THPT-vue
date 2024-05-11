<template>
  <div>
    <v-btn
      color="primary"
      dark
      style="margin-right: 10px"
      @click="isShow = true"
    >
      Add lecture
    </v-btn>
    <a-modal
      v-model="isShow"
      title="Add lecture"
      max-width="1200"
      :width="800"
      :footer="null"
      @ok="handleOk"
      @cancel="isShow = false"
    >
      <v-container>
        <a-row>
          <b>Lecture name</b>
          <a-input
            style="margin-top: 0.5rem"
            placeholder="Enter lesson name"
            v-model="name"
          />
        </a-row>
        <a-row style="margin-top: 0.5rem">
          <b>Lecture content</b>
          <ckeditor
            :editor="editor"
            @ready="onReady"
            v-model="content"
            :config="editorConfig"
          ></ckeditor>
          <!-- <vue-editor
            :editorToolbar="fullToolbar"
            style="margin-top: 0.5rem; margin-bottom: 0.5rem"
            v-model.trim="content"
            :id="makeid(5)"
          ></vue-editor> -->
        </a-row>
        <a-row style="margin-top: 0.5rem">
          <b>Video for lecture (link Youtube)</b>
          <a-input
            style="margin-top: 0.5rem"
            placeholder="Enter link youtube for lecture"
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
          <b>Attach new file for lecture</b>
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
          <v-btn
            :loading="loading"
            dark
            color="primary"
            class="mr-4"
            @click="handleOk"
          >
            Create
          </v-btn>
        </div>
      </v-container>
    </a-modal>
  </div>
</template>

<script>
import { VueEditor } from "vue2-quill-editor";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import BannerLesson from "./BannerLesson";
import UploadLessonVideo from "./UploadLessonVideo";
import firebase from "firebase/compat/app";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { NotificationMixin } from "../../mixin/Notification";
import Lecture from "../../api/Lecture";
// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableColumnResize from '@ckeditor/ckeditor5-table/src/tablecolumnresize';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
// import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption';

export class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const uniqueFileName = `${new Date().getTime()}-${file.name}`;
          let storage = firebase.storage().ref(`ckeditor/image-uploaded`);
          let uploadTask = storage.child(uniqueFileName).put(file);
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log("Upload is paused");
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log("Upload is running");
                  break;
              }
            },
            function (error) {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              // eslint-disable-next-line default-case
              switch (error.code) {
                case "storage/unauthorized":
                  reject(" User doesn't have permission to access the object");
                  break;

                case "storage/canceled":
                  reject("User canceled the upload");
                  break;

                case "storage/unknown":
                  reject(
                    "Unknown error occurred, inspect error.serverResponse"
                  );
                  break;
              }
            },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                  console.log("File available at", downloadURL);
                  resolve({
                    default: downloadURL,
                  });
                });
            }
          );
        })
    );
  }
}
export default {
  mixins: [FirebaseStorageMixin, NotificationMixin],
  components: {
    UploadLessonVideo,
    BannerLesson,
    VueEditor,
    ckeditor: CKEditor.component,
  },
  props: {},
  data() {
    return {
      useFile: false,
      isShow: false,
      randomLectureId: (Math.random() + 1).toString(36).substring(5),
      name: "",
      description: "",
      bannerImg: null,
      linkYoutube: "",
      videoFile: null,
      content: "",
      uploadLoading: false,
      loading: false,
      fileList: [],
      editor: DecoupledEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        toolbar: {
          // plugins : [Table, TableToolbar],
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
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          shouldNotGroupWhenFull: true,
        },
      },
      fullToolbar: [
        [{ font: [] }],
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ header: 1 }, { header: 2 }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        ["link", "image", "video", "formula"],
        [{ direction: "rtl" }],
        ["clean"],
      ],
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
    handleInitUpload(editor) {
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
        classId: this.classId,
      };
      Lecture.createLecture(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Create a new lesson successfully"
          );
          this.isShow = false;
          this.loading = false;
          this.$emit("refresh");
          // this.name = "";
          // this.description = "";
          // this.bannerImg = null;
          // this.linkYoutube = "";
          // this.videoFile = null;
          // this.content = "";
          // this.uploadLoading = false;
          // this.loading = false;
          // this.fileList = [];
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Failed to create new lesson",
            error.response.data.message
          );
          this.isShow = false;
          this.loading = false;
        });
    },
    uploadBanner(img) {
      this.bannerImg = img;
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
    uploadVideo(video) {
      this.videoUrl = video;
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
  },
};
</script>

<style scoped>
#editor {
  height: 300px;
}
</style>
