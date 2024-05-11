<template>
  <div>
    <FullCalendar
      style="font-size: 25px"
      class="custom-for-calendar"
      :listCalendar="listCalendar"
      :listClass="listClass"
      @update="updateCalendar"
      @delete="deleteCalendar"
    />
    <CreateEvent style="padding-left : 5%; padding-bottom : 3rem" @add="addEvent" :listClass="listClass" :key="update" />
  </div>
</template>

<script>
import { NotificationMixin } from "../mixin/Notification";
import { LocalStorageMixin } from "../mixin/LocalStorage";
import { DatetimeMixin } from "../mixin/Datetime";

import Class from "../api/Class";
import Calendar from "../api/Calendar";

import CreateEvent from "../components/Calendars/CreateEvent.vue";
import FullCalendar from "../components/Calendars/FullCalendar.vue";

export default {
  mixins: [NotificationMixin, LocalStorageMixin, DatetimeMixin],
  components: {
    FullCalendar,
    CreateEvent,
  },
  data() {
    return {
      listClass: null,
      listCalendar: null,
      update: 0,
    };
  },
  mounted() {
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
              "Cập nhật lịch học cho lớp thành công"
            );
            this.update++;
            this.getListCalendar();
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Cập nhật lịch học cho lớp thất bại",
              error.response.data.message
            );
          });
      } else {
        Calendar.createCalendar(payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Cập nhật lịch cá nhân thành công"
            );
            this.update++;
            this.getListCalendar();
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Cập nhật lịch cá nhân thất bại",
              error.response.data.message
            );
          });
      }
    },
    updateCalendar(id, payload) {
      Calendar.updateCalendar(id, payload)
        .then((response) => {
          this.openNotificationWithIcon("success", "Cập nhật lịch thành công");
          this.getListCalendar();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Cập nhật lịch thất bại",
            error.response.data.message
          );
        });
    },
    deleteCalendar(id) {
      Calendar.deleteCalendar(id)
        .then((response) => {
          this.openNotificationWithIcon("success", "Xóa lịch thành công");
          this.getListCalendar();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Xóa lịch thất bại",
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
.custom-for-calendar {
  padding: 1.5rem 3% 1rem;
  td {
    height: 50px;
    button {
      font-size: 20px;
    }
  }
}
</style>
