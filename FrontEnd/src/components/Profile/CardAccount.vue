<template>
  <!-- Profile Information Card -->
  <a-card
    :bordered="false"
    class="header-solid h-full card-profile-information"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item class="mb-5" label="Email" :colon="false">
          <a-input v-model="data.email" disabled placeholder="Enter Email" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item class="mb-10" label="Phone" :colon="false">
          <a-input
            v-model="data.phone"
            :disabled="!isEdit"
            placeholder="Enter phon"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item class="mb-10" label="DOB" :colon="false">
          <a-date-picker
            v-model="data.DOB"
            :disabled="!isEdit"
            format="DD/MM/YYYY"
            placeholder="DOB"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item class="mb-5" label="School" :colon="false">
          <a-input
            v-model="data.school"
            :disabled="!isEdit"
            placeholder="School"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item class="mb-10" label="Province" :colon="false">
          <a-select
            v-model="data.province"
            :disabled="!isEdit"
            placeholder="Province"
            style="width: 100%"
          >
            <a-select-option
              v-for="(item, index) in listProvince"
              :key="index"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item class="mb-10" label="Gender" :colon="false">
          <a-select
            v-model="data.gender"
            :default-value="data.gender || 'male'"
            :disabled="!isEdit"
            placeholder="Gender"
            style="width: 100%"
          >
            <a-select-option value="male"> Male </a-select-option>
            <a-select-option value="female"> Female </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="20" type="flex" justify="end" v-if="isEdit">
      <ChangePassword />
      <a-col>
        <v-btn
          color="primary"
          dark
          @click="handleSubmit"
          class="login-form-button"
          style="margin-top: 8px"
        >
          UPDATE PROFILE
        </v-btn>
      </a-col>
    </a-row>
  </a-card>
  <!-- / Profile Information Card -->
</template>

<script>
import ChangePassword from "../../components/Profile/ChangePassword.vue";

export default {
  components: {
    ChangePassword,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array | Object,
      default: {},
    },
    avatar: {
      type: String,
      default: "",
    },
    listProvince: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      result: null,
    };
  },
  methods: {
    handleSubmit() {
      const payload = {
        gender: this.data.gender,
        province: this.data.province,
        name: this.data.name,
        phone: this.data.phone,
        school: this.data.school,
        DOB: this.data.DOB,
        avatar: this.avatar || this.data.avatar,
      };
      this.$emit("update", this.data.id, payload);
    },
  },
};
</script>
