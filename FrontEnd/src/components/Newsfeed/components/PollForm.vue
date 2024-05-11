<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <h6 v-if="!poll">Tạo poll</h6>

    <h6 v-else>Chỉnh sửa poll</h6>
    <v-text-field
      v-model="poolName"
      :rules="nameRules"
      label="Chủ đề cuộc thăm dò ý kiến"
      required
    ></v-text-field>
    <div
      v-for="(option, optionIndex) in listOptions"
      :key="optionIndex"
      style="
        display: flex;
        justify-content: space-between;
        background: #f5f5f5;
        border-radius: 5px;
        padding: 8px;
        margin-top: 0.5rem;
      "
    >
      <div style="padding: 10px; max-width: 80%">
        <b>
          {{ `${optionIndex + 1}. ` }}
        </b>
        <b>{{ option.content }}</b>
      </div>
      <div style="padding: 10px">
        <v-btn
          depressed
          small
          @click="() => listOptions.splice(optionIndex, 1)"
          style="
            width: 30px;
            padding: 10px;
            height: 20px;
            margin-bottom: 3px;

            background: #f5f5f5;
          "
        >
          <a-icon
            height="2em"
            width="2em"
            type="delete"
            theme="filled"
            style="font-size: 16px; background: #f5f5f5"
          />
        </v-btn>
      </div>
    </div>
    <div style="display: flex; margin-top: 0.5rem">
      <a-input
        placeholder="Enter a new answer"
        v-model="newOption"
        style="width: 100%"
        @pressEnter="(val) => handlePushToOption(val)"
      >
        <a-icon slot="prefix" type="plus"
      /></a-input>
    </div>
    <a-row
      type="flex"
      justify="space-between"
      align="middle"
      style="margin-top: 10px"
    >
      <a-col>
        <p>Chọn nhiều lựu chọn</p>
      </a-col>
      <a-col>
        <a-switch v-model="isMutiple" />
      </a-col>
    </a-row>

    <v-btn
      v-if="!poll"
      :loading="poolLoading"
      style="margin-top: 1rem"
      @click="handleCreatePool"
      dark
      color="primary"
      class="mr-4"
    >
      Tạo
    </v-btn>
    <v-btn
      v-else
      :loading="poolLoading"
      style="margin-top: 1rem"
      @click="handleUpdatePool"
      dark
      color="primary"
      class="mr-4"
    >
      Chỉnh sửa
    </v-btn>
  </v-form>
</template>

<script>
import { NotificationMixin } from "../../../mixin/Notification";
import Pool from "../../../api/Pool";
export default {
  props: {
    classId: {
      type: String,
      default: "",
    },
    poll: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    await this.$nextTick();
    this.poolName = this.poll.content ? this.poll.content : "";
    this.listOptions = this.poll.options;
    this.isMutiple = this.poll.type === "Single" ? false : true;
    this.poolId = this.poll._id;
  },
  mixins: [NotificationMixin],
  data() {
    return {
      newOption: "",
      valid: false,
      nameRules: [(v) => !!v || "Name is required"],
      poolLoading: false,
      listOptions: [],
      poolName: "",
      isMutiple: false,
      poolId: null,
    };
  },
  watch: {
    poll: function (val) {
      if (val) {
        this.poolName = val.content ? val.content : "";
        this.listOptions = val.options;
        this.isMutiple = val.type === "Single" ? false : true;
        this.poolId = val._id;
      }
    },
  },
  methods: {
    handleCreatePool() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.poolLoading = true;
        const payload = {
          content: this.poolName,
          options: this.listOptions,
          type: this.isMutiple ? "Multiple" : "Single",
          classId: this.classId,
        };
        Pool.createPool(payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Tạo cuộc thăm dò ý kiến mới thành công"
            );
            this.isShow = false;
            this.poolLoading = false;
            this.handleClearForm();
            this.$emit("closeDialog");
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Tạo cuộc thăm dò ý kiến mới thất bại",
              error.response.data.message
            );
            this.poolLoading = false;
          });
      }
    },
    handleUpdatePool() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.poolLoading = true;
        const payload = {
          content: this.poolName,
          options: this.listOptions,
          type: this.isMutiple ? "Multiple" : "Single",
        };
        Pool.updatePool(this.poolId, payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Cập nhật cuộc thăm dò ý kiến thành công"
            );
            this.isShow = false;
            this.poolLoading = false;
            this.handleClearForm();
            this.$emit("closeDialog");
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Cập nhật cuộc thăm dò ý kiến thất bại",
              error.response.data.message
            );
            this.poolLoading = false;
          });
      }
    },
    handleClearForm() {
      (this.newOption = ""),
        (this.listOptions = []),
        (this.poolLoading = false);
    },
    handlePushToOption(val) {
      this.listOptions.push({
        content: this.newOption,
        votes: [],
        trueValue: 1,
      });
      this.newOption = "";
    },
  },
};
</script>

<style></style>
