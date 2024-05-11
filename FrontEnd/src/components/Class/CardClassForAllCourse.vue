<template>
  <div style="background: white !important">
    <a-row
      style="background: white !important"
      v-if="listClass && listClass.length > 0"
      class="cards-wrapper"
      type="flex"
      :gutter="20"
    >
      <a-col :span="24" v-for="item in listClass" :key="item._id">
        <!-- <a-card
          :bordered="false"
          class="card-info card-class"
          style="
            margin-top: 10px;
            max-height: 445px;
            margin-top: 1.5rem;
            width: 300px;
            height: 250px;
            padding: 0px;
          "
        >
          <template #cover>
            <div style="width: 300px; height: 168px">
              <img
                style="object-fit: contain; width: 300px; height: 168px"
                alt="example"
                :src="item.bannerImg"
              />
            </div>
          </template>
          <div>
            <a-row style="padding-left: 5px; margin: -0.5rem -0.5rem">
              <a-col :span="22">
                <h6 style="color: black">
                  {{ truncate(item.name, 20) }}
                </h6>

                <div style="display: flex">
                  <span
                    style="color: gray; font-weight: 500l,margin-right :0.5rem"
                    >Subject:
                  </span>
                  <b style="margin-left: 0.5rem">{{ item.subject }}</b>
                </div>
                <div
                  v-if="item.createdUser"
                  style="
                    display: flex;
                    align-items: center;
                    margin-right: 0.5rem;
                  "
                >
                  <span style="color: gray; font-weight: 500">Teacher :</span>
                  <a-avatar
                    size="small"
                    style="margin-left: 0.5rem; margin-right: 0.5rem"
                    :src="
                      item && item.createdUser && item.createdUser.avatar
                        ? item.createdUser.avatar
                        : `https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg?fbclid=IwAR3w7x7XV6ZIro07OzoQPBIpEI2yGu1451we09GJ4_u4ZMS8SiLVcrtlkr0`
                    "
                  />
                  <b>{{
                    item && item.createdUser && item.createdUser.name
                      ? item.createdUser.name
                      : "--"
                  }}</b>
                </div>
              </a-col>
              <a-col :span="2" style="text-align: right">
                <a-dropdown>
                  <a class="icon-more" @click="(e) => e.preventDefault()">
                    <a-icon type="more"
                  /></a>
                  <a-menu slot="overlay">
                    <a-menu-item @click="joinClass(item)">
                      <a-icon type="form" /> Join class
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-col>
            </a-row>
          </div>
        </a-card> -->
        <template>
          <v-card class="mx-auto" max-width="350">
            <img
              style="object-fit: fill;height: 138px"
              alt="example"
              :src="item.bannerImg"
            />

            <v-card-title>
              {{ truncate(item.name, 25) }}
            </v-card-title>

            <v-card-subtitle>
              {{ truncate(item.description, 35) }}
            </v-card-subtitle>
            <v-divider
              style="width: 90%; margin-left: 5%; margin-right: 5%; margin-top: 0 !important; margin-bottom: 0 !important;"
            ></v-divider>
            <v-card-actions>
              <div style="display :flex;align-items: end;justify-content: end; width :100%">
                <v-btn color="orange lighten-2" @click="joinClass(item)" text>
                Join Class
              </v-btn>

              </div>
            

            </v-card-actions>
          </v-card>
        </template>
      </a-col
      ></a-row
    >
    <a-row v-else style="margin-top: 3rem">
      <img src="../../../public/images/noRecordFound.png" />
    </a-row>
      <a-modal
        v-model="isDelete"
        title="Delete class"
        @ok="deleteClass"
        okType="danger"
        ok-text="Confirm"
        cancel-text="Cancel"
      >
        Are you sure to delete this class?
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
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isDelete: false,
      deleteData: null,
    };
  },
  methods: {
    confirmDelete(item) {
      this.deleteData = item;
      this.isDelete = true;
    },
    deleteClass() {
      this.$emit("delete", this.deleteData._id);
      this.isDelete = false;
    },
    joinClass(item) {
      this.$emit("join", item._id);
    },
    leaveClass(item) {
      this.$emit("leave", item._id);
    },
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "..." : str;
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
  },
};
</script>
<style lang="scss" scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.icon-more {
  padding-right: 0px;
  font-size: 24px;
  color: black;
}
.class-name {
  margin-top: 10px;
  color: black !important;
}
.class-code {
  margin-bottom: 5px;
}
.card-class {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}
.cards-wrapper {
  ::-webkit-scrollbar {
    width: 5px;
  }

  grid-column: center-start / -1;
  display: grid;
  grid-auto-flow: column;
  gap: 0.5rem;
  overflow: auto;
  padding-bottom: 1rem;
  padding-right: var(--page-margin);
  .card {
    font-size: 1.5rem;
    height: 20rem;
    min-width: 25rem;
  }
}
</style>
