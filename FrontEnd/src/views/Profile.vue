<template>
  <div>
    <a-card
      :bordered="false"
      class="card-profile-head"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row type="flex" justify="space-between">
          <a-col class="col-info">
            <Avatar
              :userId="data.id"
              :avatar="data.avatar"
              @clicked="changeAvatar"
              :isEdit="isEdit"
            />
            <div class="avatar-info">
              <h4 class="font-semibold m-0">{{ data.name }}</h4>
              <p>{{ data.role == "teacher" ? "Giáo viên" : "Học sinh" }}</p>
            </div>
          </a-col>
          <a-col>
            <a-tooltip
              title="Nhấn để thay đổi ảnh đại diện và thông tin cá nhân"
              :disable="isEdit"
              placement="topRight"
              v-if="!isEdit"
            >
              <a-button shape="circle" icon="edit" @click="isEdit = true" />
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row>
          <CardAccount
            :isEdit="isEdit"
            :data="data"
            :avatar="avatar"
            :listProvince="listProvince"
            @update="updateProfile"
          />
        </a-row>
      </template>
    </a-card>
  </div>
</template>

<script>
import { NotificationMixin } from "../mixin/Notification";
import { LocalStorageMixin } from "../mixin/LocalStorage";
import Author from "../api/Author.js";
import MasterData from "../api/MasterData";

import Avatar from "../components/ImageStorage/Avatar.vue";
import CardAccount from "../components/Profile/CardAccount";

export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    CardAccount,
    Avatar,
  },
  data() {
    return {
      isEdit: false,
      data: null,
      avatar: null,
      listProvince: null,
    };
  },
  computed: {},
  mounted() {
    this.getProfile();
    MasterData.getProvince()
      .then((response) => {
        this.listProvince = response.data;
      })
      .catch((e) => {
        console.log("e", e.response);
      });
  },
  methods: {
    changeAvatar(img) {
      this.avatar = img;
    },
    getProfile() {
      Author.getProfile(this.getToken())
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          console.log("e", error);
        });
    },
    updateProfile(id, payload) {
      Author.updateProfile(id, payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Cập nhật Profile thành công"
          );
          this.isEdit = false;
          const payload = {
            role: this.result.role,
            id: this.result._id,
            name: this.result.name,
            avatar: this.result.avatar,
          };
          this.updateUserProfile();
          this.getProfile();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Cập nhật Profile thất bại",
            e.response.data.message
          );
        });
    },
  },
};
</script>

<style lang="scss">
// .layout-dashboard {
//   background-image: url('https://images.unsplash.com/photo-1554147090-e1221a04a025?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1148&q=80');
// }
</style>