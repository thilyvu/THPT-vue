<template>
  <div class ="post">
    <a-space
      v-if="listPool"
      size="middle"
      direction="vertical"
      style="width: 100%; background-color: #fdfcfc"
    >
      <a-card class="remove-box-shadow" style="margin-bottom : 1rem" hoverable v-for="(pool, poolIndex) in listPool" :key="pool._id">
        <a-card-meta>
          <div slot="title">
            <a-row justify="space-between" type="flex" style="height: 23px">
              <a-col :span="23" style="text-align: center">
                {{ pool.content }}
              </a-col>
              <a-col :span="1" v-if="pool.createBy === userProfile.id">
                <a-dropdown>
                  <p class="icon-more">
                    <a-icon type="dash" />
                  </p>
                  <a-menu slot="overlay">
                    <a-menu-item v-if="!pool.isBlock" @click="editPoll(pool, poolIndex)">
                      <a-icon type="setting" /> Edit Poll
                    </a-menu-item>
                    <a-menu-item v-if="!pool.isBlock" @click="blockPoll(pool, true)">
                      <a-icon type="lock" /> Selection lock
                    </a-menu-item>
                    <a-menu-item v-if="pool.isBlock" @click="blockPoll(pool, false)">
                      <a-icon type="lock" /> Unlock selection
                    </a-menu-item>
                    <a-menu-item @click="deletePoolConfirm(pool)">
                      <a-icon type="delete" /> Delete a poll
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-col>
            </a-row>
            <a-row style="text-align: center; color: lightgrey">
              <p>
                Created by {{ pool.createdUser.name }} at
                {{ formatDateTime(pool.createdAt) }}
              </p>
            </a-row>
          </div>
        </a-card-meta>
        <a-row v-if="pool.type === 'Single'">
          <a-radio-group
            v-model="pool.valueForRadio"
            v-for="(option, optionIndex) in pool.options"
            :key="optionIndex"
            :value="option.content"
            :disabled="pool.isBlock"
            @change="
              (val) =>
                handleCheckPoolSingle(val, optionIndex, option, poolIndex, pool)
            "
            style="
              display: flex;
              justify-content: space-between;
              background: #f5f5f5;
              border-radius: 5px;
              padding: 8px;
              margin-top: 0.5rem;
            "
          >
            <div style="padding: 10px">
              <a-radio :disabled="pool.isBlock" style="margin-left: 1rem" :value="optionIndex">
                <b style="width: 5%">
                  {{ `${optionIndex + 1}. ` }}
                </b>
                <b style="width: 90%">{{ option.content }}</b>
              </a-radio>
            </div>
            <b style="width: 5%; padding: 10px">{{ option.votes.length }}</b>
          </a-radio-group>
        </a-row>
        <a-row v-else>
          <div
            v-for="(option, optionIndex) in pool.options"
            :key="optionIndex"
            :value="option.content"
            style="
              display: flex;
              justify-content: start;
              background: #f5f5f5;
              border-radius: 5px;
              padding: 8px;
              margin-top: 0.5rem;
            "
          >
            <div style="padding: 10px; display: flex">
              <v-checkbox
                :disabled="pool.isBlock"
                v-if="pool.valueForCheckBox.includes(optionIndex)"
                @change="
                  (val) =>
                    handleCheckMultiplePool(
                      val,
                      optionIndex,
                      option,
                      poolIndex,
                      pool
                    )
                "
                style="height: 10px; margin-top: -5px"
                v-model="option.trueValue"
                v-bind:true-value="1"
              >
              </v-checkbox>
              <v-checkbox
                v-else
                @change="
                  (val) =>
                    handleCheckMultiplePool(
                      val,
                      optionIndex,
                      option,
                      poolIndex,
                      pool
                    )
                "
                style="height: 10px; margin-top: -5px"
              >
              </v-checkbox>
            </div>
            <div style="padding: 10px; width: 100%">
              <b style="width: 5%">
                {{ `${optionIndex + 1}. ` }}
              </b>
              <b style="width: 90%">{{ option.content }}</b>
            </div>
            <b style="width: 5%; padding: 10px">{{ option.votes.length }}</b>
          </div>
        </a-row>

      </a-card>
    </a-space>
    <a-space
      v-if="getListNewsfeed"
      size="middle"
      direction="vertical"
      style="width: 100%; background-color: #fdfcfc"
    >
      <a-card class="remove-box-shadow" hoverable v-for="newsfeed in getListNewsfeed" :key="newsfeed._id">
        <a-card-meta :description="formatDateTime(newsfeed.createdAt)">
          <div slot="title">
            <img
              v-if="newsfeed.pin"
              style="
                width: 25px;
                position: absolute;
                right: -4px;
                top: -12px;
                padding-bottom: 10px;
                margin-bottom: 0.3rem;
                margin-right: 0.3rem;
              "
              src="../../assets/pinned.png"
            />
            <a-row justify="space-between" type="flex" style="height: 23px">
              <a-col>
                {{ newsfeed.createName }}
              </a-col>
              <a-col
                v-if="
                  userProfile.role === 'teacher' ||
                  newsfeed.createBy === userProfile.id
                "
              >
                <a-dropdown>
                  <p class="icon-more" @click="(e) => e.preventDefault()">
                    <a-icon type="dash" />
                  </p>
                  <a-menu slot="overlay">
                    <a-menu-item @click="editPost(newsfeed)">
                      <a-icon type="setting" /> Edit post
                    </a-menu-item>
                    <a-menu-item @click="deletePostConfirm(newsfeed)">
                      <a-icon type="delete" /> Delete post
                    </a-menu-item>
                    <a-menu-item
                      v-if="!newsfeed.pin && userProfile.role === 'teacher'"
                      @click="pinNewfeed(newsfeed)"
                    >
                      <img
                        style="
                          width: 15px;
                          margin-bottom: 0.3rem;
                          margin-right: 0.3rem;
                        "
                        src="../../assets/pin.png"
                      />
                      Pin Posts
                    </a-menu-item>
                    <a-menu-item
                      v-if="newsfeed.pin && userProfile.role === 'teacher'"
                      @click="unPinNewfeed(newsfeed)"
                    >
                      <img
                        style="
                          width: 15px;
                          margin-bottom: 0.3rem;
                          margin-right: 0.3rem;
                        "
                        src="../../assets/pin.png"
                      />Unpin posts
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-col>
            </a-row>
          </div>
          <a-avatar slot="avatar" class="avatar" :src="newsfeed.createAvatar" />
        </a-card-meta>
        <div style="margin-top: 10px">
          <p>{{ newsfeed.content }}</p>
          <img
            v-if="
              typeof newsfeed.image === 'string' &&
              newsfeed.image.split('_')[1] != ''
            "
            slot="cover"
            class="post-img"
            :src="newsfeed.image.split('_')[1]"
          />
          <img-viewer
            v-if="
              typeof newsfeed.image !== 'string' && newsfeed.image.length > 0
            "
            :images="newsfeed.image"
            ref="viewer"
          />
        </div>
        <a-divider style="margin: 12px 12px 0px 0px" />
        <a-row :gutter="10" type="flex" align="middle" justify="space-between">
          <a-col>
            <a-button
              v-if="newsfeed && !newsfeed.isLiked"
              type="link"
              @click="handleLike(newsfeed)"
              ><img
                style="width: 20px; margin-bottom: 0.3rem; margin-right: 0.5rem"
                src="../../assets/like.png"
              />
              Like</a-button
            >
            <a-button
              v-if="newsfeed && newsfeed.isLiked"
              @click="handleUnLike(newsfeed)"
              type="link"
              ><img
                style="width: 20px; margin-bottom: 0.3rem; margin-right: 0.5rem"
                src="../../assets/liked.png"
              />
              Like</a-button
            >
          </a-col>
          <a-col v-if="newsfeed.likes" v-show="newsfeed.likes.length > 0">
            {{ newsfeed.likes ? newsfeed.likes.length : 0 }} likes
          </a-col>
          <a-col v-show="newsfeed.comments.length > 0"
            >{{ newsfeed.comments.length }} comment</a-col
          >
        </a-row>
        <a-divider style="margin: 0px 0px 12px 0px" />
        <a-row> </a-row>
        <a-row
          :gutter="20"
          type="flex"
          align="middle"
          justify="start"
          v-for="comment in newsfeed.comments"
          :key="comment._id"
        >
          <a-col :span="1">
            <a-avatar class="avatar" :src="comment.createAvatar" />
          </a-col>
          <a-col class="responsive-comment-title" style="margin-left: 15px; margin-top: 10px" :span="22">
            <span>{{ comment.createName }}</span
            ><i>- Vào {{ formatDateTime(comment.createdAt) }}</i>
            <p>{{ comment.content }}</p>
          </a-col>
        </a-row>
        <a-row
          style="margin-top: 1rem"
          :gutter="5"
          type="flex"
          align="middle"
          justify="start"
        >
          <a-col :span="1">
            <a-avatar class="avatar" :src="userProfile.avatar" />
          </a-col>
          <a-col class="responsive-comment" :span="22" style="margin-left: 15px"
            ><a-input
              placeholder="Type a comment and press Enter to post a comment"
              v-model="newsfeed.commentContent"
              v-on:keyup.enter="createComment(newsfeed, newsfeed.commentContent)"
          /></a-col>
        </a-row>
      </a-card>
      <a-modal
        title="Delete post"
        v-model="isDelete"
        okText="Delete"
        okType="danger"
        @ok="deletePost"
        cancelText="Cancel"
        @cancel="isDelete = false"
        >Are you sure you want to delete this post??</a-modal
      >
      <a-modal
        title="Delete this poll"
        v-model="isDeletePool"
        okText="Delete"
        okType="danger"
        @ok="deletePool"
        cancelText="Hủy"
        @cancel="isDeletePool = false"
        >Are you sure you want this written poll?</a-modal
      >
      <a-modal v-model="isPollEdit" max-width="500" :footer="null">
      <PollForm :poll="editPollData" @closeDialog="handleCloseDialog" :classId="classId"></PollForm>
    </a-modal>
      <a-modal
        v-model="isEdit"
        title="Edit post"
        :footer="null"
        max-width="700"
        @cancel="isEdit = false"
      >
        <v-container>
          <v-form @submit.prevent="submitEditPost">
            <v-text-field
              v-model="editData.content"
              type="text"
              label="Content"
            ></v-text-field>
            <v-file-input
              prepend-icon="mdi-camera"
              label="Upload File"
              accept="image/*"
              @change="chooseImg"
            ></v-file-input>
            <a-progress v-if="uploadValue" :percent="uploadValue" />
          <img
            v-if="
              typeof editData.image === 'string' &&
              editData.image.split('_')[1] != ''
            "
            slot="cover"
            class="post-img"
            :src="editData.image.split('_')[1]"
          />
          <img-viewer
            v-if="
              typeof editData.image !== 'string' && editData.image.length > 0
            "
            :images="editData.image"
            ref="viewer"
          />
            <v-btn
              dark
              color="primary"
              style="margin: 10px"
              @click="submitEditPost"
              :disabled="uploadValue > 0 && uploadValue < 100"
            >
            Update
            </v-btn>
          </v-form>
        </v-container>
      </a-modal>
    </a-space>
    <a-spin v-else tip="Loading...">
      <div class="spin-content">Uploading data</div>
    </a-spin>
  </div>
</template>

<script>
import ImgViewer from "./components/imgViewer.vue";
import { DatetimeMixin } from "../../mixin/Datetime";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import { NotificationMixin } from "../../mixin/Notification";
import { cloneDeep } from "lodash";
import DisplayFile from "../Excercises/DisplayFile.vue";
import Pool from "../../api/Pool";
import PollForm from "./components/PollForm.vue"

export default {
  mixins: [
    DatetimeMixin,
    FirebaseStorageMixin,
    LocalStorageMixin,
    NotificationMixin,
  ],
  components: { DisplayFile, ImgViewer, PollForm },
  props: {
    classId: {
      type: String,
      default: "",
    },
    isEditing: false,
    listNewsfeed: {
      type: Array,
      default: null,
    },
    listPool: {
      type: Array,
      default: null,
    },
    
  },
  data() {
    return {
      isPollEdit: false,
      isDelete: false,
      deleteData: null,
      deletePoolData: null,
      isEdit: false,
      isDeletePool: false,
      editData: { content: "", image: "" },
      editPollData :null,
      userComment: "",
      index: 0,
      trueValue: 1,
      images: [],
      options: {
        inline: false,
        button: true,
        navbar: true,
        title: 2, // show if screen > 768px
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 1,
          play: {
            show: 1,
            size: "large",
          },
          next: 1,
          rotateLeft: 1,
          rotateRight: 1,
          flipHorizontal: 1,
          flipVertical: 1,
        },
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
      },
      valueForRaido: 1,
      cloneListPool: [],
    };
  },
  async mounted() {
    await this.$nextTick();
    this.cloneListPool = cloneDeep(this.listPool);
  },
  computed: {
    getListNewsfeed() {
      // return [...this.listNewsfeed, {commentContent : ''}]
      console.log( this.listNewsfeed.map((newsfeed)=> {
        return  {commentContent: '', ...newsfeed}
      }));
      return this.listNewsfeed.map((newsfeed)=> {
        return  {commentContent: '', ...newsfeed}
      })
    },},
  methods: {
    deletePostConfirm(record) {
      this.isDelete = true;
      this.deleteData = record;
    },
    deletePoolConfirm(record) {
      this.isDeletePool = true;
      this.deletePoolData = record;
    },
    handleCloseDialog() {
      this.$emit("refresh");
      this.isPollEdit = false;
    },
    handleCheckPoolSingle(val, optionIndex, option, poolIndex, pool) {
      if (
        option.votes.some(
          (vote) =>
            vote.userId === this.userProfile.id &&
            vote.optionIndex === optionIndex
        )
      ) {
      } else {
        option.votes.push({
          userId: this.userProfile.id,
          optionIndex: optionIndex,
        });
      }
      pool.options.map((option, index) => {
        if (index !== optionIndex) {
          const index = option.votes.findIndex(
            (vote) => vote.userId === this.userProfile.id
          );
          if (index > -1) {
            option.votes.splice(index, 1);
          }
        }
      });
      Pool.updatePool(pool._id, {
        options: pool.options,
      })
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Cập nhật cuộc bình chọn thành công"
          // );
          this.$emit("refresh");
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Update poll failed",
            error.response.data.message
          );
        });
    },
    handleCheckMultiplePool(val, optionIndex, option, poolIndex, pool) {
      if (val) {
        if (
          option.votes.some(
            (vote) =>
              vote.userId === this.userProfile.id &&
              vote.optionIndex === optionIndex
          )
        ) {
          // alert("Object found inside the array.");
        } else {
          option.votes.push({
            userId: this.userProfile.id,
            optionIndex: optionIndex,
          });
        }
      } else {
        if (
          option.votes.some(
            (vote) =>
              vote.userId === this.userProfile.id &&
              vote.optionIndex === optionIndex
          )
        ) {
          const index = option.votes.findIndex(
            (vote) =>
              vote.userId === this.userProfile.id &&
              vote.optionIndex === optionIndex
          );
          if (index > -1) {
            option.votes.splice(index, 1);
          }
        }
      }
      Pool.updatePool(pool._id, {
        options: pool.options,
      })
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Cập nhật cuộc bình chọn thành công"
          // );
          this.$emit("refresh");
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Update poll failed",
            error.response.data.message
          );
        });
    },
    deletePost() {
      this.$emit("delete", this.deleteData._id);
      this.isDelete = false;
    },
    blockPoll(record, lock) {
    Pool.updatePool(record._id, {isBlock :lock})
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Poll course successful"
          );
          this.$emit("refresh");
          this.isDeletePool = false;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Poll course failed",
            error.response.data.message
          );
          this.isDeletePool = false;
        });
    },
    deletePool() {
      Pool.deletePool(this.deletePoolData._id)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Delete poll successfully"
          );
          this.$emit("refresh");
          this.isDeletePool = false;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Delete failed poll",
            error.response.data.message
          );
          this.isDeletePool = false;
        });
    },
    editPost(record) {
      this.isEdit = true;
      this.editData = record;
    },
    editPoll(record, index) {
      this.isPollEdit = true;
      this.editPollData = record;
    },
    handleLike(record) {
      this.$emit("like", record._id);
    },
    handleUnLike(record) {
      this.$emit("unLike", record._id);
    },
    pinNewfeed(record) {
      this.$emit("pin", record._id);
    },
    unPinNewfeed(record) {
      this.$emit("unPin", record._id);
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    createComment(newsfeed, commentContent) {
      const payload = {
        content: commentContent,
        newFeedId: newsfeed._id,
      };

      newsfeed.comments.push({
        content: this.userComment,
        createAvatar: this.userProfile.avatar,
        createName: this.userProfile.name,
        createdAt: new Date(),
      });
      this.userComment = "";
      this.$emit("comment", payload);
    },
    chooseImg(event) {
      this.handleImageFile(event, `class/${this.classCode}/banner`);

      this.$emit("clicked", this.picture);
    },
    submitEditPost() {
      const payload = {
        content: this.editData.content,
      };
      if (this.picture)
      payload.image = this.editData.image.split("_")[0] + "_" + this.picture;
      this.$emit("edit", this.editData._id, payload);
      this.isEdit = false;
    },
  },
};
</script>

<style>
.post-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgb(240, 242, 245);
}
.ant-card-meta-detail > div:not(:last-child) {
  margin-bottom: 0px;
}
.avatar {
  width: 40px;
  height: 40px;
}
.remove-box-shadow {
  box-shadow: none !important;
  }
@media only screen and (max-width: 1100px) {
  .responsive-comment {
    width : 85% !important;
    margin-left: 2rem !important;
  }
  .responsive-comment-title {
    width : 80% !important;
    margin-left: 2rem !important;
  }
}
</style>
