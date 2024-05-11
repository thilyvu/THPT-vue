<template>
  <div>
    <p
      style="
        font-size: 20px;
        margin-top: 1rem;
        margin-left: 6%;
        margin-right: 6%;
        font-weight: bold;
      "
    >
      Your  courses
    </p>
    <a-row style="margin-top: 2.5rem" class="responsive-dashboard">
      <a-col
        :span="22"
        class="responsive-item-image"
        style="margin-left: 5%; margin-right: 5%"
      >
        <v-carousel
          hide-delimiters
          cycle
          show-arrows-on-hover
          class="responsive-carousel"
          height="800"
          v-if="filterData && filterData.length > 0"
        >
          <v-carousel-item  v-for="(item, i) in filterData" :key="i">
            <v-row class="responsive-row">
              <a-col
                class="responsive-carousel-item-carousel"
                :span="13"
                style="display: flex; justify-content: center"
              >
                <img
                  style="margin-left: 1rem"
                  class="responsive-carousel-item-image"
                  :src="item.bannerImg"
                />
              </a-col>
              <a-col class="responsive-carousel-item" :span="11">
                <div class="responsive-class-content" style="padding: 55px 0px 10px 10px; margin-left: 1rem">
                  <div style="display: flex">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 0.5rem;
                      "
                    >
                      <a-avatar :src="item.createdUser.avatar" />
                    </div>

                    <div style="display: grid">
                      <span style="color: gray; font-weight: 500">Teacher</span>
                      <b>{{ item.createdUser.name }}</b>
                    </div>
                    <!-- <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 0.5rem;
                        margin-left: 4rem;
                      "
                    >
                      <img
                        style="width: 25px"
                        src="../../../public/images/save-instagram.png"
                      />
                    </div>

                    <div style="display: grid">
                      <span style="color: gray; font-weight: 500">Subject</span>
                      <b>{{ item.subject }}</b>
                    </div> -->
                  </div>
                  <h4
                    class="class-name"
                    style="margin-top: 1rem; font-size: 30px"
                  >
                    {{ truncate(item.name, 25) }}
                  </h4>
                  <p 
                    class="class-name" style="font-size: 20px">
                    {{ truncate(item.description, 50) }}
                  </p>
                  <div style="margin-top: 1rem">
                    <img
                      style="width: 25px; margin-right: 0.5rem"
                      src="../../../public/images/options-lines.png"
                    />
                    {{ item.tests || 0 }}
                    Tests
                  </div>
                  <v-btn
                    class="responsive-carousel-item-btn"
                    color="primary"
                    x-large
                    style="background: #e5bf29; margin-top: 1rem"
                    @click="enterClass(item)"
                  >
                    <span><b style="font-size: 20px">Go to class</b> </span>
                  </v-btn>
                </div>
              </a-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
        <v-carousel
        v-else
          hide-delimiters
          cycle
          show-arrows-on-hover
          class="responsive-carousel"
          height="800"
        >
          <v-carousel-item  v-for="(item, i) in listFullClass" :key="i">
            <v-row class="responsive-row">
              <a-col
                class="responsive-carousel-item-carousel"
                :span="13"
                style="display: flex; justify-content: center"
              >
                <img
                  style="margin-left: rem"
                  class="responsive-carousel-item-image"
                  :src="item.bannerImg"
                />
              </a-col>
              <a-col class="responsive-carousel-item" :span="11">
                <div class="responsive-class-content" style="padding: 55px 0px 10px 10px; margin-left: 1rem">
                  <div style="display: flex">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 0.5rem;
                      "
                    >
                      <a-avatar :src="item.createdUser.avatar" />
                    </div>

                    <div style="display: grid">
                      <span style="color: gray; font-weight: 500">Teacher</span>
                      <b>{{ item.createdUser.name }}</b>
                    </div>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 0.5rem;
                        margin-left: 4rem;
                      "
                    >
                      <img
                        style="width: 25px"
                        src="../../../public/images/save-instagram.png"
                      />
                    </div>

                    <div style="display: grid">
                      <span style="color: gray; font-weight: 500">Subject</span>
                      <b>{{ item.subject }}</b>
                    </div>
                  </div>
                  <h4
                    class="class-name"
                    style="margin-top: 1rem; font-size: 30px"
                  >
                    {{ truncate(item.name, 25) }}
                  </h4>
                  <p 
                    class="class-name" style="font-size: 20px">
                    {{ truncate(item.description, 50) }}
                  </p>
                  <div style="margin-top: 1rem">
                    <img
                      style="width: 25px; margin-right: 0.5rem"
                      src="../../../public/images/options-lines.png"
                    />
                    {{ item.tests || 0}}
                    Tests
                  </div>
                  <v-btn
                    class="responsive-carousel-item-btn"
                    color="primary"
                    x-large
                    style="background: #e5bf29; margin-top: 1rem"
                    @click="joinClass(item)"
                  >
                    <span><b style="font-size: 20px">Join Class</b> </span>
                  </v-btn>
                </div>
              </a-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </a-col>
      <!-- <a-col :span="8" class="responsive-item">
        <div>
          <FullCalendar
            class="responsive-item-calendar"
            :listCalendar="listCalendar"
            :listClass="listClass"
            @update="updateCalendar"
            @delete="deleteCalendar"
          />
          <CreateStudentEvent
            class="responsive-btn"
            @add="addEvent"
            :listClass="listClass"
            :key="update"
          />
        </div>
      </a-col> -->
    </a-row>

    <a-divider
      class="reponsive-current-class"
      style="margin: 5rem 12px 0px 0px"
    />
    <div
      class="responsive-cover"
      style="background-color: white; width: 100vw; padding: 80px 0px 40px 0px"
    >
      <h2 style="text-align: center; font-size :30px" class="masterstudy-custom-title">
        ABOUT TRẺ TRÂU IELTS
      </h2>
      <h1
        style="
          font-size: 50px;
          text-align: center;
          font-family: Amatic SC;
          font-weight: 400;
          font-style: normal;
        "
        class="masterstudy-custom-title"
      >
        BADASS ENGLISH CLASS
      </h1>
      <a-row
        style="display: flex; justify-content: space-between"
        class="responsive-about-image-over-container"
      >
        <a-col :span="1" class="hide-extra"> </a-col>

        <a-col :span="6" class="responsive-about-image-item">
          <div class="responsive-about-image-item-container">
            <div class="responsive-about-image-size-box">
              <img
                class="responsive-about-image"
                src="https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2F1%20Speaking.png?alt=media&token=b2c2a5c1-6b97-4a41-85ab-a106c4b1025a"
              />
            </div>
          </div>
          <p style="text-align: center; font-weight: 600; margin-top: 1.5rem">Speaking 1:1</p>
          <p
            class="responsive-about-image-item-content"
            style="text-align: center"
          >
          
Học viên học kỹ năng Speaking theo mô hình 1 học sinh - 1 giáo viên
          </p>
        </a-col>
        <a-col :span="6" class="responsive-about-image-item">
          <div class="responsive-about-image-item-container">
            <div class="responsive-about-image-size-box">
              <img
                class="responsive-about-image"
                src="https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2F2%20Cac%20lop%20Levels.png?alt=media&token=73c7c6f1-a80f-4dc1-b99c-8c6eb305ef1a"
              />
            </div>
          </div>
          <p style="text-align: center; font-weight: 600; margin-top: 1.5rem">  Chọn lớp phù hợp</p>
          <p
            class="responsive-about-image-item-content"
            style="text-align: center"
          >
Học viên được chọn lớp phù hợp với trình độ:  Foundation -> Pre IELTS -> Aim 5.0 -> Aim 6.5 -> Aim 7.5
          </p>
        </a-col>
        <a-col :span="6" class="responsive-about-image-item">
          <div class="responsive-about-image-item-container">
            <div class="responsive-about-image-size-box">
              <img
                class="responsive-about-image"
                src="https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2F3%20Writing%20Feedback.png?alt=media&token=399c736a-8386-41b4-b56c-817276f5d753"
              />
            </div>
          </div>
          <p style="text-align: center; font-weight: 600; margin-top: 1.5rem">  Writing Feedback</p>
          <p
            class="responsive-about-image-item-content"
            style="text-align: center;"
          >
         
Học viên được chấm bài Writing theo hình thức two-way feedback, có thể trao đổi thêm với giáo viên về những nội dung trong bài chấm Writing.
          </p>
        </a-col>
        <a-col :span="1" class="hide-extra"> </a-col>
      </a-row>
      <a-row>
        <p
          style="
            margin-left: 10%;
            font-size: 30px;
            font-weight: bold;
            margin-top: 2rem;
          "
        >
        Trẻ Trâu IELTS Statistics
        </p>
      </a-row>
      <a-row>
        <div
          style="
            margin-left: 10%;
            margin-right: 10%;
            background: linear-gradient(to left, #f0f2f5 95%, #ebd53c 5%);
            border-radius: 5px;
          "
        >
          <p style="padding: 5.5px 15px">02: 2 buổi/tuần</p>
        </div>
        <div
          style="
            margin-left: 10%;
            margin-right: 10%;
            background: linear-gradient(to left, #f0f2f5 90%, #ebd53c 10%);
            border-radius: 5px;
          "
        >
          <p style="padding: 5.5px 15px">04: Trung bình mỗi khoá học kéo dài 4 tháng</p>
        </div>
        <div
          style="
            margin-left: 10%;
            margin-right: 10%;
            background: linear-gradient(to left, #f0f2f5 50%, #ebd53c 50%);
            border-radius: 5px;
          "
        >
          <p style="padding: 5.5px 15px">06: 6 tiếng học Speaking 1:1 với giáo viên</p>
        </div>
        <!-- <div
          style="
            margin-left: 10%;
            margin-right: 10%;
            background: linear-gradient(to right, #ebd53c 75%, #f0f2f5 25%);
            border-radius: 5px;
          "
        >
          <p style="padding: 5.5px 15px">Điểm 9+ THPT QG: 90+</p>
        </div> -->
        <div
          style="
            margin-left: 10%;
            margin-right: 10%;
            background: linear-gradient(to left, #ebd53c 0%, #ebd53c 100%);
            border-radius: 5px;
          "
        >
          <p style="padding: 5.5px 15px">24: 24 buổi học Reading - Listening - Writing</p>
        </div>
      </a-row>
      <v-divider
        style="width: 80%; margin-left: 10%; margin-right: 10%"
      ></v-divider>
      <!-- <a-row>
        <h2
          style="
          font-size: 30px !important;
            text-align: center;
            margin-bottom: 2rem !important;
            margin-top: 1.3rem !important;
          "
          class="masterstudy-custom-title responsive-title"
        >
          🏡 Địa chỉ lớp học: 83 &amp; 75 Hùng Vương, BMT
        </h2>
        <a
          style="margin-left: 16%; margin-top: 1.5rem"
          href="http://bit.ly/tretrau22"
          target="_blank"
          class="
            vc_single_image-wrapper vc_box_border_grey
            responsive-container-footer-image
          "
          ><img
            src="https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-1024x389.jpeg"
            class="vc_single_image-img attachment-large responsive-footer-image"
            alt=""
            loading="lazy"
            srcset="
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-1024x389.jpeg 1024w,
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-300x114.jpeg   300w,
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-768x292.jpeg   768w,
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-1536x584.jpeg 1536w,
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-2048x778.jpeg 2048w,
              https://tretrau.vn/wp-content/uploads/2022/05/DANG-KY-WEB-600x228.jpeg   600w
            "
        /></a>
        <v-divider
          style="width: 80%; margin-left: 10%; margin-right: 10%"
        ></v-divider>
      </a-row> -->
    </div>
  </div>
</template>

<script>
import Class from "../../api/Class";
import Test from "../../api/Test";
import "@fontsource/amatic-sc";
import CardClassForAllCourse from "./CardClassForAllCourse";
import { DatetimeMixin } from "../../mixin/Datetime";
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import Calendar from "../../api/Calendar";
import CreateStudentEvent from "../Calendars/CreateStudentEvent.vue";
import CreateEvent from "../Calendars/CreateEvent.vue";
import FullCalendar from "../Calendars/FullCalendar.vue";
export default {
  mixins: [NotificationMixin, LocalStorageMixin, DatetimeMixin],
  components: {
    FullCalendar,
    CreateEvent,
    CardClassForAllCourse,
    CreateStudentEvent,
  },
  props: {
    filterData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      searchType: "name",
      txtSearch: "",
      skill: 20,
      knowledge: 33,
      power: 78,
      isName: false,
      sort: "new",
      listClass: null,
      txtTeacherSearch: "",
      isSearch: false,
      bakClass: null,
      loading: false,
      listCalendar: null,
      update: 0,
      listFullClass: null,
    };
  },
  mounted() {
    console.log(this.filterData);
    if (!this.getToken()) this.$router.push("/sign-in");
    this.loading = true;
    Class.getListPersonalClass(this.getToken())
      .then((response) => {
        this.listClass = response.data.data;
        this.bakClass = response.data.data;
        this.listClass.map((item, index)=> {
          Test.getTestByClassId(item._id).then((response) => {
            this.listClass[index] = {
              ...item,
              tests : response.data.data.length || 0
            }
          });
        })
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
      });
    Class.getListClass().then((response) => {
      this.listFullClass = response.data.data;
    });

    this.getListCalendar();
    this.getListClass();
  },
  methods: {
    addEvent(haveClass, payload) {
      if (haveClass) {
        Calendar.createClassCalendar(payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Update calendar for class successfully"
            );
            this.update++;
            this.getListCalendar();
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Update calendar for class failed",
              error.response.data.message
            );
          });
      } else {
        Calendar.createCalendar(payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Update personal calendar successfully "
            );
            this.update++;
            this.getListCalendar();
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Update personal calendar failed",
              error.response.data.message
            );
          });
      }
    },
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
    },
    enterClass(item) {
      const payload = {
        id: item._id,
        classCode: item.classCode,
        name: item.name,
        banner: item.bannerImg,
      };
      this.classLocalStorage(payload);
      this.$router.push({
        name: "quizExercise",
        params: { id: item._id },
      });
    },
    joinClass(item) {
      this.$emit("join", item._id);
    },
    updateCalendar(id, payload) {
      Calendar.updateCalendar(id, payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Update calendar successfully"
          );
          this.getListCalendar();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Update calendar failed",
            error.response.data.message
          );
        });
    },
    deleteCalendar(id) {
      Calendar.deleteCalendar(id)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Delete calendar successfully"
          );
          this.getListCalendar();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Delete calendar failed",
            error.response.data.message
          );
        });
    },
    getListCalendar() {
      Calendar.getListPersonalCalendar()
        .then((res) => {
          this.listCalendar = res.data.data.map((obj) => {
            return {
              ...obj,
              listDate: this.getBetweenDates(
                new Date(obj.startTime),
                new Date(obj.endTime)
              ),
            };
          });
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    getListClass() {
      Class.getListPersonalClass(this.getToken())
        .then((res) => {
          this.listClass = res.data.data;
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.responsive-about-image {
  width: 358px;
  height: 358px;
  border-radius: 50%;
  margin-left: 11px;
  margin-top: 11px;
}
.responsive-about-image-size-box {
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background-color: #ebebeb;
}
.info {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #fff;
  .initials {
    position: initial;
    width: 40px;
    height: 40px;
    background-color: #fff;
    color: #303030;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .right {
    flex: 1;
    margin-left: 24px;
    p:nth-child(1) {
      font-size: 14px;
    }
    p:nth-child(2),
    p:nth-child(3) {
      font-size: 12px;
    }
  }
}
.v-window {
  &__next {
    position: absolute;
    right: -1%;
  }
}
.responsive-about-image {
    margin-left: 3px;
  }
.responsive-about-image-item-container {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
.responsive-carousel-item-image {
  max-width: 640px;
  height: 360px;
  object-fit: cover;
}
.responsive-btn {
  position: absolute;
  top: 7%;
  background: black;
  left: 70%;
}
.class-name {
  width: 80vw;
  word-break: break-word;
}
.responsive-carousel {
  height: 355px !important;
  margin: -16px;
}
.responsive-item-calendar {
  height: 350px;
}
.responsive-footer-image {
  width: 60vw !important;
  height: 25vw !important;
}

@media only screen and (max-width: 1200px) and (orientation: landscape) {
  .responsive-carousel {
    display: grid;
    height: 800px !important;
    margin: 0px !important;
  }
}
@media only screen and (max-width: 1100px) and (orientation: landscape) {
  .responsive-carousel {
    display: grid;
    height: 750px !important;
    margin: 0px !important;
  }
}
@media (max-width: 1000px) {
  .responsive-carousel {
    display: grid;
    height: 700px !important;
    margin: 0px !important;
  }
}

@media (max-width: 1000px) and (orientation: landscape)  {
  .responsive-carousel-item-image {
    display: none;
  }
  .responsive-carousel {
    display: grid;
    height: 260px !important;
    margin: 0px !important;
  }
  .responsive-class-content {
    padding : 12px 40px 10px 40px !important
  }
}
@media (max-width: 1200px) {
  .reponsive-current-class {
    margin: 0px !important;
  }
  .responsive-about-image-over-container {
    display: grid !important;
  }
  .responsive-title {
    padding-left: 5vw;
    padding-right: 5vw;
  }
  .responsive-about-image-item {
    width: 100% !important;
  }
  .responsive-about-image {
    width: 60vw;
    height: 60vw;
    border-radius: 50%;
    margin-left: 1vw;
    margin-top: 1vw;
  }
  .responsive-about-image-size-box {
    width: 63vw;
    height: 63vw;
    border-radius: 50%;
    background-color: #ebebeb;
  }
  .responsive-about-image-item-container {
    display: flex;
    text-align: center;
    align-items: center;
    width: 100vw !important;
    justify-content: center;
  }
  .responsive-about-image-item-content {
    margin-bottom: 2rem;
    width: 50%;
    margin-left: 25vw;
  }
  .responsive-container-footer-image {
    margin: 0px !important;
    padding-left: 5vw;
    padding-right: 5vw;
  }
  .responsive-footer-image {
    width: 90vw !important;
    height: 35vw !important;
  }
  .responsive-btn {
    position: absolute;
    top: 7%;
    background: black;
    left: 70vw;
  }
  .responsive-dashboard {
    display: grid;
  }
  .responsive-item {
    width: 93vw;
    margin-bottom: 2rem;
  }
  .responsive-item-image {
    width: 93vw;
    margin-bottom: 3rem;
  }
  .responsive-carousel-item-carousel {
    width: 100% !important;
  }
  .responsive-row {
    display: grid !important;
  }
  .responsive-carousel-item-image {
    max-width: 100%;
    height: 43vw !important;
  }
  .responsive-carousel {
    display: grid;
    height: 650px;
    margin: 0px !important;
  }
  .responsive-carousel-item {
    width: 90vw !important;
    margin-left: 1rem;
    height: fit-content !important;
  }
}
@media (max-width: 600px) {
  .responsive-carousel-item-image {
    max-width: 100%;
    height: 43vw !important;
  }
  .responsive-about-image {
    width: 85vw;
    height: 85vw;
    border-radius: 50%;
    margin-left: 1vw;
    margin-top: 1vw;
  }
  .responsive-class-content {
    margin-left: 10vw !important;
  }
  // .responsive-carousel-item {
  //   margin-left: 11vw !important;
  // }
  .responsive-about-image-size-box {
    width: 88vw;
    height: 88vw;
    border-radius: 50%;
    background-color: #ebebeb;
  }
  .responsive-carousel {
    display: grid;
    height: 650px !important;
    margin: 0px !important;
  }
  .responsive-carousel-item {
    width: 100vw !important;
    margin-left: 1rem;
  }
  .responsive-carousel-item-btn {
    margin-top: -3rem !important;
  }
  .responsive-item-calendar {
    .v-picker--full-width {
      width: 370px !important;
    }
  }
  .responsive-carousel-item-carousel {
    width: 100% !important;
  }
  .responsive-dashboard {
    display: grid;
  }
  .responsive-item {
    width: 90vw;
    margin-bottom: 2rem;
  }
  .responsive-item-image {
    width: 100vw;
    margin-bottom: 3rem;
    margin-left: 0rem !important;
  }
  .responsive-btn {
    position: absolute;
    top: 7% !important;
    background: black;
    left: 55vw !important;
  }
  @media (max-width: 500px) {
    .responsive-carousel {
      display: grid;
      height: 500px !important;
      margin: 0px !important;
    }
  }
}
</style>
