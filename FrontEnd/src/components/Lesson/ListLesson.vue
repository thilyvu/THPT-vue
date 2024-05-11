<template>
  <div :loading="loading" class="responsive-list-lesson-container-out-line">
    <a-row :gutter="20" class="responsive-list-lesson-container" style="max-width: 100%">
      <a-col
        :span="16"
        style="
          height: 88vh;
          max-height: 100%;
          overflow-y: scroll;
          over-flow-x: hidden;
          padding: 10px;
        "
        class="lecture-list responsive-list-lesson-content"
      >
        <a-row type="flex" justify="space-between" align="top" :gutter="20">
          <a-col>
            <a-row
              v-if="lectureActive"
              class="lecture-creator m-2"
              type="flex"
              align="middle"
            >
              <a-col>
                <a-avatar
                  shape="square"
                  :src="lectureActive.bannerImg.split('_')[1]"
                />
              </a-col>
              <a-col class="ml-4">
                <h5  class="m-0 ml-4 lectureName" >
                  {{ lectureActive ? lectureActive.name : "--" }}
                </h5>
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <AddLessonModal
              @add="addLesson"
              @refresh="handleRefresh"
            />
          </a-col>
        </a-row>
        <a-row>
          <div v-if="lectureActive">
            <div style="display: grid; margin-bottom: 0.5rem">
              <b class="lecture-title">Video lectures</b>
              <div style="display: flex">
                <iframe
                  width="100%"
                  height="400"
                  :src="lectureActive.videoUrl"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <b class="lecture-title"> Lecture content</b>
            <div
              class="edu-editor"
              v-html="lectureActive.content"
              style="margin-bottom: 0.5rem; max-width: 50vw"
            ></div>

            <b style="margin-top: 0.5rem"> Attached files</b>
            <a-row v-if="lectureActive.fileUrls">
              <div
                style="display: flex; font-weight: 500"
                v-for="(file, index) in lectureActive.fileUrls"
                :key="file.name"
              >
                <span style="color: blue">{{ index + 1 }}. </span>
                <FilePreview :key="file.name" :file="file"></FilePreview>
              </div>
            </a-row>
          </div>
          <a-divider style="margin: 12px 12px 0px 0px" />
          <div>
            <a-row
              style="margin-top: 1rem; width: 100%"
              :gutter="5"
              type="flex"
              align="middle"
              justify="start"
            >
              <a-col :span="1">
                <a-avatar class="avatar" :src="userProfile.avatar" />
              </a-col>
              <a-col :span="21" style="margin-left: 15px"
                ><a-input
                  placeholder="Type a comment and press Enter to post a comment"
                  v-model="userComment"
                  v-on:keyup.enter="createComment(lectureActive)"
              /></a-col>
              <a-col :span="1">
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
                    style="font-size: 16px"
                    type="paper-clip"
                  ></a-icon>
                </a-button>
              </a-col>
            </a-row>
            <a-row
              :gutter="20"
              type="flex"
              align="middle"
              justify="start"
              style="margin-bottom: 1rem"
            >
              <a-col :span="1"> </a-col>
              <a-col :span="22">
                <a-upload
                  :file-list="fileList"
                  name="file"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  @change="handleChange"
                >
                </a-upload>
              </a-col>
            </a-row>
            <div
              v-if="
                lectureActive &&
                lectureActive.comments &&
                lectureActive.comments.length > 0
              "
            >
              <a-row
                :gutter="20"
                type="flex"
                align="middle"
                v-for="comment in lectureActive.comments"
                :key="comment._id"
              >
                <a-col :span="1">
                  <a-avatar class="avatar" :src="comment.createAvatar" />
                </a-col>
                <a-col style="margin-left: 15px; margin-top: 10px" :span="22">
                  <span>{{ comment.createName }}</span
                  ><i>- Vào {{ formatDateTime(comment.createdAt) }}</i>
                  <p>{{ comment.content }}</p>
                </a-col>

                <a-row v-if="comment.fileUrls">
                  <div
                    style="margin-left: 3.5rem; display: flex"
                    v-for="(file, index) in comment.fileUrls"
                    :key="file.name"
                  >
                    <span style="color: blue">{{ index + 1 }}. </span>
                    <FilePreview :key="file.name" :file="file"></FilePreview>
                  </div>
                </a-row>
              </a-row>
            </div>
          </div>
        </a-row>
      </a-col>
      <a-col :span="8" class="responsive-list-lesson">
        <h5 class="lecture-title">Lecture</h5>
        <a-input-search
          v-model="txtSearch"
          placeholder="Search by lecture name"
        />

        <a-list
          item-layout="horizontal"
          :data-source="filterData"
          class="lecture-list"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            @click.prevent="chooseLecture(item)"
            class="lecture-item"
          >
            <a-list-item-meta :description="item.diffDate">
              <a slot="title" href="#">{{
                item && item.name ? item.name : "--"
              }}</a>
              <a-avatar
                shape="square"
                slot="avatar"
                :src="item.bannerImg.split('_')[1]"
              />
            </a-list-item-meta>
            <template slot="actions" v-if="userProfile.role === 'teacher'">
              <a-dropdown>
                <a class="icon" @click="(e) => e.preventDefault()">
                  <a-icon type="dash"
                /></a>
                <a-menu slot="overlay">
                  <a-menu-item @click="openEditModal(item)">
                    <a-icon type="edit" /> Edit
                  </a-menu-item>
                  <a-menu-item @click="showDeleteConfirm(item)">
                    <a-icon type="delete" /> Delete
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <a-row class="responsive-list-lesson-container-mobile" :gutter="20" style="max-width: 100%; display: none;">
      <a-col style="max-width: 100%">
        <h5 style="margin-top : 3rem" class="lecture-title">Lecture</h5>
        <a-input-search
          v-model="txtSearch"
          placeholder="Search by lecture name"
        />

        <a-list
          item-layout="horizontal"
          :data-source="filterData"
          class="lecture-list"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            @click.prevent="chooseLecture(item)"
            class="lecture-item"
          >
            <a-list-item-meta :description="item.diffDate">
              <a slot="title" href="#">{{
                item && item.name ? item.name : "--"
              }}</a>
              <a-avatar
                shape="square"
                slot="avatar"
                :src="item.bannerImg.split('_')[1]"
              />
            </a-list-item-meta>
            <template slot="actions" v-if="userProfile.role === 'teacher'">
              <a-dropdown>
                <a class="icon" @click="(e) => e.preventDefault()">
                  <a-icon type="dash"
                /></a>
                <a-menu slot="overlay">
                  <a-menu-item @click="openEditModal(item)">
                    <a-icon type="edit" /> Edit
                  </a-menu-item>
                  <a-menu-item @click="showDeleteConfirm(item)">
                    <a-icon type="delete" /> Delete
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-list-item>
        </a-list>
      </a-col>
      <a-divider style="margin: 12px 12px 0px 0px" />
      <a-col
        :span="24"
        style="max-width: 100% ; margin-top: 2rem;"
        class="lecture-list responsive-list-lesson-content"
      >
        <a-row type="flex" justify="space-between" align="top" :gutter="20">
          <a-col>
            <a-row
              v-if="lectureActive"
              class="lecture-creator m-2"
              type="flex"
              align="middle"
            >
              <a-col>
                <a-avatar
                  shape="square"
                  :src="lectureActive.bannerImg.split('_')[1]"
                />
              </a-col>
              <a-col class="ml-4">
                <h5 id="lectureName" class="m-0 ml-4">
                  {{ lectureActive ? lectureActive.name : "--" }}
                </h5>
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <AddLessonModal
              @add="addLesson"
              @refresh="handleRefresh"
              v-if="userProfile.role === 'teacher'"
            />
          </a-col>
        </a-row>
        <a-row>
          <div v-if="lectureActive">
            <div style="display: grid; margin-bottom: 0.5rem">
              <b class="lecture-title">Video lectures</b>
              <div style="display: flex">
                <iframe
                  width="100%"
                  height="400"
                  :src="lectureActive.videoUrl"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <b class="lecture-title"> Lecture content</b>
            <div
              class="edu-editor"
              v-html="lectureActive.content"
              style="margin-bottom: 0.5rem; max-width: 50vw"
            ></div>

            <b style="margin-top: 0.5rem"> Attached files</b>
            <a-row v-if="lectureActive.fileUrls">
              <div
                style="display: flex; font-weight: 500"
                v-for="(file, index) in lectureActive.fileUrls"
                :key="file.name"
              >
                <span style="color: blue">{{ index + 1 }}. </span>
                <FilePreview :key="file.name" :file="file"></FilePreview>
              </div>
            </a-row>
          </div>
          <a-divider style="margin: 12px 12px 0px 0px" />
          <div>
            <a-row
              style="margin-top: 1rem; width: 100%"
              :gutter="5"
              type="flex"
              align="middle"
              justify="start"
            >
              <a-col :span="1">
                <a-avatar class="avatar" :src="userProfile.avatar" />
              </a-col>
              <a-col :span="21" style="margin-left: 15px"
                ><a-input
                  placeholder="Type a comment and press Enter to post a comment"
                  v-model="userComment"
                  v-on:keyup.enter="createComment(lectureActive)"
              /></a-col>
              <a-col :span="1">
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
                    style="font-size: 16px"
                    type="paper-clip"
                  ></a-icon>
                </a-button>
              </a-col>
            </a-row>
            <a-row
              :gutter="20"
              type="flex"
              align="middle"
              justify="start"
              style="margin-bottom: 1rem"
            >
              <a-col :span="1"> </a-col>
              <a-col :span="22">
                <a-upload
                  :file-list="fileList"
                  name="file"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  @change="handleChange"
                >
                </a-upload>
              </a-col>
            </a-row>
            <div
              v-if="
                lectureActive &&
                lectureActive.comments &&
                lectureActive.comments.length > 0
              "
            >
              <a-row
                :gutter="20"
                type="flex"
                align="middle"
                v-for="comment in lectureActive.comments"
                :key="comment._id"
              >
                <a-col :span="1">
                  <a-avatar class="avatar" :src="comment.createAvatar" />
                </a-col>
                <a-col style="margin-left: 15px; margin-top: 10px" :span="22">
                  <span>{{ comment.createName }}</span
                  ><i>- Vào {{ formatDateTime(comment.createdAt) }}</i>
                  <p>{{ comment.content }}</p>
                </a-col>

                <a-row v-if="comment.fileUrls">
                  <div
                    style="margin-left: 3.5rem; display: flex"
                    v-for="(file, index) in comment.fileUrls"
                    :key="file.name"
                  >
                    <span style="color: blue">{{ index + 1 }}. </span>
                    <FilePreview :key="file.name" :file="file"></FilePreview>
                  </div>
                </a-row>
              </a-row>
            </div>
          </div>
        </a-row>
      </a-col>

    </a-row>
    <EditLessonModal
      :record="editData"
      :isShow="isEdit"
      @closed="isEdit = !isEdit"
      @edit="editLesson"
      @refresh="handleRefresh"
    />
    <a-modal
      title="Delete lecture"
      v-model="isDelete"
      okText="Delete"
      okType="danger"
      @ok="deleteLesson"
      cancelText="Cancel"
      @cancel="isDelete = false"
      >Are you sure you want to delete this lecture?</a-modal
    >
  </div>
</template>

<script>
import VueContext from "vue-context";
import { DatetimeMixin } from "../../mixin/Datetime";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import AddLessonModal from "./AddLessonModal.vue";
import EditLessonModal from "./EditLessonModal.vue";
import TableLoading from "../Base/TableLoading.vue";
import FilePreview from "./FilePreview.vue";
import * as _ from "lodash";
export default {
  mixins: [FirebaseStorageMixin, DatetimeMixin],
  components: {
    EditLessonModal,
    AddLessonModal,
    TableLoading,
    VueContext,
    FilePreview,
  },
  props: {
    listLecture: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
    },
  },
  watch: {
    listLecture: function (val) {
      if (val) {
        this.active = val[0];
      }
    },
  },
  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "all",
      updated: 0,
      isEdit: false,
      editData: null,
      isDelete: false,
      deleteData: null,
      txtSearch: "",
      active: null,
      userComment: "",
      fileList: [],
      uploadLoading: false,
    };
  },
  methods: {
    convertURL(url) {
      let regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      let match = url.match(regExp);

      return match && match[2].length === 11 ? match[2] : null;
    },
    videoSrc(url) {
      return `//www.youtube.com/embed/${this.convertURL(url)}`;
    },

    openEditModal(record) {
      this.isEdit = true;
      this.editData = record;
    },
    handleRefresh() {
      this.$emit("refresh");
    },
    showDeleteConfirm(record) {
      this.isDelete = true;
      this.deleteData = record;
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
          const fileName = `class/${this.classId}/lecture/comment/${file.name}`;
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
    deleteLesson() {
      this.$emit(
        "delete",
        this.deleteData._id,
        `class/${this.classId}/lecture/${
          this.deleteData.bannerImg.split("_")[0]
        }/banner`
      );
      this.isDelete = false;
    },
    editLesson(id, payload, refUrl) {
      this.$emit("edit", id, payload, refUrl);
      this.isDelete = false;
    },
    addLesson(payload) {
      this.$emit("add", payload);
      this.updated++;
    },
    chooseLecture(item) {
      this.active = item;
      setTimeout(() => {
        const collection = document.getElementsByClassName("lectureName");
        if (collection && collection[0]) {
          let position = collection[0].getBoundingClientRect()
          collection[0].scrollIntoView(false);
          // window.scrollTo(position.left, position.top 
          // +400);
          
        }
      }, 100);
    },
    createComment(lecture) {
      const payload = {
        content: this.userComment,
        lectureId: lecture._id,
        fileUrls: this.fileList,
      };
      this.lectureActive.comments.unshift({
        content: this.userComment,
        createAvatar: this.userProfile.avatar,
        createName: this.userProfile.name,
        createdAt: new Date(),
      });
      this.userComment = "";
      this.$emit("comment", payload);
      this.fileList = [];
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
  },
  computed: {
    filterData() {
      return this.listLecture?.filter((row) => {
        const name = row.name.toString().toLowerCase();
        return name.includes(this.txtSearch);
      });
    },
    classId() {
      return this.$route.params.id;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    lectureActive() {
      return this.active
        ? this.active
        : this.listLecture && this.listLecture[0];
    },
    _() {
      return _;
    },
  },
};
</script>

<style lang="scss">
.lecture-title {
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  padding-bottom: 10px;
}
.edu-editor
 {
  img {
  width: 100% !important;
  }
  table {
    width: 100% !important;
    border: 1px solid black !important;
    td {
      border: 0.5px solid black !important;
    }
    tr {
      border: 1px solid black !important;
    }
  }
  }
.lecture-list {
  overflow-x: auto;
  max-height: 450px;
  padding-left : 1rem !important;
  cursor: pointer;

  /* width */
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #f5f5f5;
    border-radius: 20px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgb(58, 55, 55);
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #161515;
  }
}
.responsive-list-lesson-container-mobile {
  display: none;
}
@media only screen and (max-width: 1000px) {
  .responsive-list-lesson {
    height: 100vh;
    overflow: scroll;
  }
  .lecture-list {
    padding-left: 1rem;
  }
}
@media only screen and (max-width: 400px) {
  .responsive-list-lesson-container-out-line {
    width: 97vw;
  }
  .responsive-list-lesson-container{
    display: none;
  }
  .edu-editor {
    max-width: 100vw !important;
  }
  .responsive-list-lesson-container-mobile {
    display: grid !important;
  }
}
html {
  scroll-behavior: smooth;
}
</style>
