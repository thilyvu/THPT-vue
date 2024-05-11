<template>
  <div>
    <v-date-picker
      v-model="currentDate"
      full-width
      class="calendar responsive-calendar"
      style="overflow: hidden; height: 355px"
      header-color="primary"
      :event-color="(date) => (date[9] % 2 ? 'red' : 'yellow')"
      :events="functionEvents"
      @dblclick:date="detailEvent"
    ></v-date-picker>
    <a-modal
      :title="'Lịch chi tiết ngày ' + detailDate"
      v-model="showDetail"
      max-width="500"
      :footer="null"
    >
      <v-container>
        <a-space direction="vertical" style="width: 100%">
          <v-card
            :color="item.color"
            dark
            v-for="item in listEvent"
            :key="item._id"
          >
            <div v-if="!item.isEdit">
              <v-card-title class="text-h5">
                <b>{{ item.name }}</b>
              </v-card-title>

              <v-card-subtitle>
                <b>Mô tả:</b>
                <p>{{ item.description }}</p>
                <b>Ngày bắt đầu - Ngày kết thúc: </b>
                <p>
                  {{ formatDateTime(item.startTime) }} -
                  {{ formatDateTime(item.endTime) }}
                </p>
                <div v-if="item.classId">
                  <b>Lịch của lớp: </b>
                  <p>{{ getClassName(item.classId) }}</p>
                </div>
              </v-card-subtitle>

              <v-card-actions
                v-if="userProfile.role === 'teacher' || !item.classId"
              >
                <v-spacer></v-spacer>

                <v-btn icon @click="deleteCalendar(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-btn icon @click="item.isEdit = true">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
            <div v-else>
              <v-card-title class="text-h5">
                <v-text-field
                  v-model="item.name"
                  label="Tên sự kiện"
                ></v-text-field>
              </v-card-title>

              <v-card-subtitle>
                <v-text-field
                  v-model="item.description"
                  label="Mô tả"
                ></v-text-field>
                <b>Ngày bắt đầu - Ngày kết thúc: </b>
                <a-range-picker
                  :show-time="{ format: 'HH:mm' }"
                  format="DD/MM/YYYY HH:mm A"
                  :default-value="[item.startTime, item.endTime]"
                  :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
                  @change="onChange"
                  style="width: 100%"
                />
                <div v-if="item.classId">
                  <b>Lịch của lớp: </b>
                  <p>{{ item.classId }}</p>
                </div>
              </v-card-subtitle>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click="updateCalendar(item)">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </a-space>
      </v-container>
    </a-modal>
  </div>
</template>

<script>
import { DatetimeMixin } from "../../mixin/Datetime";
import { LocalStorageMixin } from "../../mixin/LocalStorage";

export default {
  mixins: [DatetimeMixin, LocalStorageMixin],
  props: {
    listClass: {
      type: Array,
      default: null,
    },
    listCalendar: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      currentDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      listEvent: null,
      showDetail: false,
      detailDate: null,
      startTime: null,
      endTime: null,
    };
  },
  mounted() {},
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  methods: {
    functionEvents(date) {
      let color = [];
      this.listCalendar?.map((item) => {
        if (item.listDate.indexOf(date) !== -1) {
          color.push(item.color);
        }
      });
      return color;
    },

    detailEvent(date) {
      this.showDetail = true;
      this.detailDate = this.formatDate(date);
      let listEventDate = [];
      this.listCalendar?.map((item) => {
        let index = item.listDate.indexOf(date);
        if (index !== -1) {
          listEventDate.push(item);
        }
      });
      this.listEvent = listEventDate?.map((obj) => {
        return { ...obj, isEdit: false };
      });
    },
    updateCalendar(item) {
      item.isEdit = false;
      const payload = {
        name: item.name,
        description: item.description,
        startTime: this.startTime || item.startTime,
        endTime: this.endTime || item.endTime,
        color: item.color,
      };
      this.$emit("update", item._id, payload);
    },
    onChange(e) {
      this.startTime = e[0];
      this.endTime = e[1];
    },
    deleteCalendar(item) {
      this.showDetail = false;
      this.$emit("delete", item._id);
    },
    getClassName(id) {
      return this.listClass.find((x) => x._id === id).name;
    },
  },
};
</script>

<style>
.v-picker__title {
  background-color: black;
}
.v-date-picker-table .v-btn.v-btn--active {
  color: black !important;
}
.calendar-description > .ant-descriptions-row {
  color: white !important;
}
@media (max-width: 1200px) {
  .responsive-calendar {
    height : 370px !important
  }
}
</style>
