<template>
  <div>
    <a-row class="responsive-lecture-container" :gutter="20" v-if="!loading">
      <a-col :span="24" class="responsive-lecture">
        <ListLesson
          :listLecture="listLecture"
          @delete="deleteLesson"
          @edit="editLesson"
          @add="addLesson"
          @refresh="handleRefresh"
          @comment="handleCreateComment"
          :loading="loading"
        />
        <!-- <div v-else style="display: grid; text-align: center">
          <div
            style="
              display: flex;
              text-align: center;
              align-items: center;
              justify-content: center;
            "
          >
            <img src="../../../public/images/ic_empty.png"   class ="responsive-image-nodata" />
          </div>

          <p style="font-size: 14px">No data</p>
        </div> -->
      </a-col>
    </a-row>
    <TableLoading v-else> </TableLoading>
  </div>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { NotificationMixin } from "../../mixin/Notification";
import { DatetimeMixin } from "../../mixin/Datetime";

import ListLesson from "../../components/Lesson/ListLesson.vue";
import Lecture from "../../api/Lecture";
import Class from "../../api/Class";
import TableLoading from "../../components/Base/TableLoading.vue";
import Comment from "../../api/Comment";

export default {
  mixins: [FirebaseStorageMixin, NotificationMixin, DatetimeMixin],
  components: {
    ListLesson,
    TableLoading,
  },
  data() {
    return {
      listLecture: null,
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.getLecture();
  },
  methods: {
    deleteLesson(id, oldImgUrl) {
      Lecture.deleteLecture(id)
        .then((res) => {
          this.deleteFirebase(oldImgUrl);
          this.openNotificationWithIcon("success", "Delete successfully");
          this.getLecture();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Delete failed lecture",
            error.response.data.message
          );

          console.log(e);
        });
    },
    editLesson(id, payload) {
      Lecture.updateLecture(id, payload)
        .then(() => {
          this.openNotificationWithIcon("success", "Successful lecture update");
          this.getLecture();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Lesson update failed",
            error.response.data.message
          );
        });
    },
    addLesson(payload) {
      Lecture.createLecture(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Create a new lesson successfully"
          );
          this.getLecture();
          // this.$emit("clicked");
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Create new lesson failed",
            error.response.data.message
          );
        });
    },
    getLecture() {
      Class.getClassById(this.$route.params.id)
        .then((response) => {
          this.loading = false;
          this.listLecture = response.data.data.lectures.map((obj) => {
            return {
              ...obj,
              diffDate: this.diffDateFromNow(obj.updatedAt),
            };
          });
        })
        .catch((e) => {
          console.log("e", e);
          this.loading = false;
        });
    },
    handleRefresh() {
      this.getLecture();
    },
    handleCreateComment(payload) {
      Comment.createComment(payload)
        .then((response) => {
          // this.openNotificationWithIcon(
          //   "success",
          //   "Viết bình luận mới thành công"
          // );
          this.getLecture();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Write a new comment failed",
            error.response.data.message
          );
        });
    },
  },
  computed: {},
};
</script>

<style lang="scss">
.responsive-image-nodata {
  width: 23%
}
@media only screen and (max-width: 1000px) {
  .responsive-lecture {
    padding-left: 4%;
  }
  .responsive-image-nodata {
    width: 45% !important
  }
}
@media only screen and (max-width: 1000px) {
  .responsive-lecture {
    width: 100vw !important;
  }
  .responsive-lecture-container {
    width: 100vw !important;
    margin-left: 2px !important;
  }
}
</style>
