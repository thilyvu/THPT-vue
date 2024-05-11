<template>
  <div>
    <v-btn
      color="primary"
      dark
      @click="isShow = true"
      style="margin-right: 10px"
    >
      Add new
    </v-btn>
    <a-modal v-model="isShow" max-width="500" :footer="null">
      <v-form @submit.prevent="addEvent">
        <v-text-field
          v-model="name"
          type="text"
          label="Event name"
        ></v-text-field>
        <v-text-field
          v-model="details"
          type="text"
          label="Event Description"
        ></v-text-field>
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="DD/MM/YYYY HH:mm A"
          :placeholder="['Start Date', 'End Date']"
          @change="onChange"
          style="width: 100%"
        />
        <a-row
          type="flex"
          justify="space-between"
          align="middle"
          style="margin-top: 10px"
        >
          <a-col>
            <h6>Update this schedule for your class</h6>
          </a-col>
          <a-col>
            <a-switch
              v-if="userProfile.role === 'teacher'"
              v-model="isAddClass"
              default-checked
            />
          </a-col>
        </a-row>
        <a-select
          v-if="isAddClass"
          show-search
          placeholder="Enter and select the class name you want"
          option-filter-prop="children"
          style="width: 100%"
          :filter-option="filterOption"
          @change="selectClass"
        >
          <a-select-option
            v-for="item in listClass"
            :key="item._id"
            :value="item._id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <v-text-field
          v-model="color"
          type="color"
          label="color (click to open color menu)"
          style="height: 50px"
        ></v-text-field>
        <v-btn type="submit" dark color="primary" class="mr-4"> Add </v-btn>
      </v-form>
    </a-modal>
  </div>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";

export default {
  mixins: [LocalStorageMixin],
  props: {
    listClass: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      isShow: false,
      name: null,
      details: null,
      start: null,
      end: null,
      color: "#1976D2", // default event color
      isAddClass: false,
      classId: null,
    };
  },
  methods: {
    addEvent() {
      const payload = {
        name: this.name,
        description: this.details,
        startTime: this.start,
        endTime: this.end,
        color: this.color,
      };
      if (this.isAddClass) payload.classId = this.classId;
      this.$emit("add", this.isAddClass, payload);
    },
    onChange(e) {
      this.start = e[0];
      this.end = e[1];
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    selectClass(value) {
      this.classId = value;
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>

<style></style>
