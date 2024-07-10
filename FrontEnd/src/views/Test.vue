<template>
  <div>
    <a-row :gutter="20">
      <a-col :span="16">
        <h5 class="lecture-title">Video bài giảng</h5>
        <iframe
          width="100%"
          height="400px"
          src="https://www.youtube.com/embed/Mr3iH7qTJfk"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <a-row class="lecture-creator m-2" type="flex" align="middle">
          <a-col>
            <a-avatar
              shape="square"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </a-col>
          <a-col class="ml-4">
            <h5 class="m-0 ml-4">Lesson 6 - Implement Navigation</h5>
          </a-col>
        </a-row>
        <p>In this lesson, you use navigation controllers and segues to create the navigation flow 
of the FoodTracker app. At the end of the lesson, you’ll have a complete navigation scheme and interaction flow for the app.</p>
      </a-col>
      <a-col :span="8">
        <h5 class="lecture-title">Bài giảng</h5>
        <a-list
          item-layout="horizontal"
          :data-source="data"
          class="lecture-list"
        >
          <a-list-item slot="renderItem" slot-scope="item" @contextmenu.prevent="rightClick" @click.left="leftClick" class="lecture-item">
            <a-list-item-meta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
              <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
              <a-avatar
                shape="square"
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const MemembersColumns = [
  {
    title: "Thông tin bài giảng",
    dataIndex: "info",
    scopedSlots: { customRender: "info" },
  },
  {
    title: "Ngày đăng",
    dataIndex: "createdAt",
    scopedSlots: { customRender: "createdAt" },
  },
  {
    title: "",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
  },
];

import { FirebaseStorageMixin } from "../mixin/FirebaseStorage";
import { NotificationMixin } from "../mixin/Notification";
import ListLesson from "../components/Lesson/ListLesson.vue";
import Request from "../components/Members/Request.vue";
import ExcerciseInfo from "../components/Excercises/ExcerciseInfo.vue";

export default {
  mixins: [FirebaseStorageMixin, NotificationMixin],
  components: {
    Request,
    ListLesson,
    ExcerciseInfo,
  },
  data() {
    return {
      // Associating "Authors" table columns with its corresponding property.
      MemembersColumns: MemembersColumns,
      reload: 0,
      data: [
        {
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
        {
          title: "Ant Design Title 1",
        },
        {
          title: "Ant Design Title 2",
        },
        {
          title: "Ant Design Title 3",
        },
        {
          title: "Ant Design Title 4",
        },
      ],
    };
  },
  methods: {
    rightClick() {
      console.log("right");
    },
    leftClick() {
      console.log("left");
    },
  },
  computed: {},
};
</script>

<style lang="scss">
.lecture-title {
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
  padding-bottom: 10px;
}
.lecture-list {
  overflow-x: auto;
  max-height: 450px;
  cursor: pointer;

  /* width */
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #f5f5f5;
    border-radius: 20px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgb(58, 55, 55);
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #161515;
  }
}
</style>
