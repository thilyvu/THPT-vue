<template>
  <div>
    <a-row :gutter="20" class="responsive-newfeed">
      <TableLoading v-if="loading"></TableLoading>
      <div v-else style="height: 83vh">
        <a-col class="responsive-newfeed-left" :span="4"> </a-col>
        <a-col class="responsive-newfeed-center" :span="16">
          <div
            size="middle"
            direction="vertical"
            style="
              width: 100%;
              height: fit-content;
              overflow-x: scroll;
              padding-top: 1.5rem;
            "
          >
            <CreatePost
              v-if="userProfile.role === 'teacher'"
              :classId="classId"
              @clicked="createNewsfeed"
              :key="reload"
              @refresh="getListNewsfeed"
            />
            <Post
              v-if="listNewsfeed && listNewsfeed.length > 0"
              :listNewsfeed="listNewsfeed"
              :listPool="listPool"
              :classId="classId"
              @delete="deletePost"
              @edit="editPost"
              @comment="createComment"
              @like="handleLike"
              @unLike="handleUnlike"
              @pin="handlePin"
              @unPin="handleUnpin"
              @refresh="getListNewsfeed"
              style="background: rgb(250 250 250); margin-top: 1rem"
            />
            <div v-else style="display: grid; text-align: center">
              <div
                style="
                  display: flex;
                  text-align: center;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img
                  src="../../../public/images/ic_empty.png"
                  class="responsive-image-nodata"
                />
              </div>

              <p style="font-size: 14px">No data</p>
            </div>
          </div>
        </a-col>
        <a-col class="responsive-newfeed-right" :span="4"> </a-col>
      </div>
    </a-row>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import Class from "../../api/Class";
import Newsfeed from "../../api/Newsfeed";
import Comment from "../../api/Comment";
import TableLoading from "../../components/Base/TableLoading.vue";
import Post from "../../components/Newsfeed/Post.vue";
import CreatePost from "../../components/Newsfeed/CreatePost.vue";
import CreateNotification from "../../components/Newsfeed/CreateNotification.vue";

export default {
  mixins: [NotificationMixin],
  components: {
    CreateNotification,
    Post,
    CreatePost,
    TableLoading,
  },
  data() {
    return {
      searchType: "name",
      reload: 0,
      listNewsfeed: null,
      listPool: null,
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.getListNewsfeed();
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  methods: {
    createNewsfeed(payload) {
      console.log(payload.image);
      let dataPayload = payload;
      const { image, ...data } = payload;
      console.log(image, data);
      if (image === "") {
        dataPayload = data;
      }
      Newsfeed.createNewsfeed(dataPayload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Tạo bài viết mới thành công"
          );

          this.getListNewsfeed();
          this.reload++;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Tạo bài viết mới thất bại",
            error.response.data.message
          );
        });
    },
    deletePost(id) {
      Newsfeed.deleteNewsfeed(id)
        .then((response) => {
          this.openNotificationWithIcon("success", "Xóa bài viết thành công");
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Xóa bài viết thất bại",
            error.response.data.message
          );
        });
    },
    editPost(id, payload) {
      Newsfeed.updateNewsfeed(id, payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Cập nhật bài viết thành công"
          );
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Cập nhật bài viết thất bại",
            error.response.data.message
          );
        });
    },
    handlePin(id) {
      Newsfeed.pinNewFeed(id)
        .then((response) => {
          this.openNotificationWithIcon("success", "Ghim bài viết thành công");
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Ghim bài viết thất bại",
            error.response.data.message
          );
        });
    },
    handleUnpin(id) {
      Newsfeed.unPinNewFeed(id)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Gỡ ghim bài viết thành công"
          );
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Gỡ ghim bài viết thất bại",
            error.response.data.message
          );
        });
    },
    handleLike(id) {
      Newsfeed.likeNewFeed(id)
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Like bài viết thành công"
          // );
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Like bài viết thất bại",
            error.response.data.message
          );
        });
    },
    handleUnlike(id) {
      Newsfeed.unLikeNewFeed(id)
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Unlike bài viết thành công"
          // );
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Unlike bài viết thất bại",
            error.response.data.message
          );
        });
    },
    createComment(payload) {
      Comment.createComment(payload)
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Viết bình luận mới thành công"
          // );
          this.getListNewsfeed();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Viết bình luận mới thất bại",
            error.response.data.message
          );
        });
    },
    getListNewsfeed() {
      Class.getClassById(this.classId)
        .then((response) => {
          this.listNewsfeed = response.data.data.newFeeds.map((obj) => ({
            ...obj,
            hideComments: true,
          }));
          this.listPool = response.data.data.pools;
          this.loading = false;
        })
        .catch((error) => {
          console.log("e", error);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.responsive-newfeed {
  margin: 0px !important;
}
.responsive-newfeed-center {
  .layout-dashboard .ant-card {
    box-shadow: none !important;
  }
}
.icon-more {
  padding-right: 0px;
  font-size: 24px;
}
::-webkit-scrollbar {
  width: 0px;
}
.responsive-image-nodata {
  width: 23%;
}
@media only screen and (max-width: 1200px) {
  .responsive-newfeed-center {
    width: 80% !important;
  }
  .responsive-newfeed-right {
    display: none;
  }
  .responsive-newfeed-left {
    width: 10% !important;
  }
  .responsive-image-nodata {
    width: 45% !important;
  }
}

@media only screen and (max-width: 400px) {
  .responsive-newfeed {
    width: 100vw !important;
  }
  .responsive-newfeed-center {
    width: 100% !important;
    padding-left: 5% !important;
    padding-right: 5% !important;
  }
  .responsive-newfeed-right {
    display: none;
  }
  .responsive-newfeed-left {
    display: none;
  }
}
// @media only screen and (max-width: 500px) {
//   .responsive-newfeed {
//     margin-top: -7.5rem !important;
//   }
// }
</style>
