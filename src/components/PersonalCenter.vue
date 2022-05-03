<template>
  <div class="PersonalCenter { active: isActive }">
    <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible width="250px">
        <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="inline"
            @click="handleClick"
        >
          <div class="logo" v-if="!collapsed"><span>vCourse</span></div>
          <!--管理员可见-->
          <a-sub-menu name="member-menus" key="sub1">
            <template #title>
            <span>
              <user-outlined/>
              <span>成员管理</span>
            </span>
            </template>

            <!--管理员可见-->
            <template v-if="store.state.user_type === 1">
              <a-menu-item name="create-teacher-menu-item" key="CreateMember">
                添加成员
              </a-menu-item>

              <a-menu-item name="manage-member-info-menu-item" key="ManageMember">
                管理成员信息
              </a-menu-item>
            </template>

            <!--教师或学生可见-->
            <template v-if="store.state.user_type === 3 || store.state.user_type === 2">
              <a-menu-item name="manage-my-member-info-menu-item" key="ManageMyInfo">
                编辑我的信息
              </a-menu-item>
            </template>

          </a-sub-menu>

          <!--教师或管理员可见-->
          <a-sub-menu name="teacher-menus" v-if="store.state.user_type === 3 || store.state.user_type === 1"
                      key="sub2">
            <template #title>
            <span>
              <book-outlined/>
              <span>教师与课程信息维护</span>
            </span>
            </template>

            <a-menu-item name="create-course-a-menu-item" key="CreateCourse">
              创建课程
            </a-menu-item>
            <a-menu-item name="bind-course-a-menu-item" key="BindCourse">
              绑定课程
            </a-menu-item>
            <a-menu-item name="unbind-course-a-menu-item" key="UnbindCourse">
              解绑课程
            </a-menu-item>
            <a-menu-item name="view-bind-course-a-menu-item" key="ViewBindCourse">
              查看绑定课程
            </a-menu-item>
            <a-menu-item name="list-selected-course-a-menu-item" key="ManageCourse">
              查看所有课程
            </a-menu-item>
          </a-sub-menu>

          <!--学生可见-->
          <a-sub-menu name="student-menus" v-if="store.state.user_type === 2" key="sub3">
            <template #title>
            <span>
              <read-outlined/>
              <span>学生个人信息维护</span>
            </span>
            </template>
            <a-menu-item name="list-selected-course-a-menu-item" key="ManageCourse">
              查看所有课程
            </a-menu-item>
            <a-menu-item name="select-course-a-menu-item" key="SelectCourse">
              选课
            </a-menu-item>
            <a-menu-item name="drop-course-a-menu-item" key="DropCourse">
              退选课程
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <a-page-header
            style="border: 1px solid rgb(235, 237, 240); background: #fff;"
            title="个人中心"
            :breadcrumb="{ routes }"
            :sub-title="'各项操作，从这里出发。欢迎您，'+ store.state.nickname +'。'"
        >
          <template #tags>
            <!-- <a-tag color="blue"></a-tag> -->
          </template>
          <template #extra>
            <a-tag :color="user_type_to_color(store.state.user_type)">{{
                user_type_to_string(store.state.user_type)
              }}
            </a-tag>
            <a-button danger @click="logoutHandler">退出</a-button>
          </template>
        </a-page-header>

        <a-layout-content style="/*margin: 0 16px;*/ min-height: 500px">
          <div class="subpage-router">
            <!-- :key is used to re-render component even if destination path is current path -->
            <router-view v-slot="{ Component }" :key="$route.path">
              <transition>
                <component :is="Component"/>
              </transition>
            </router-view>
          </div>
        </a-layout-content>


        <a-layout-footer style="text-align: center">
          ©2022 Created by vCourse
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import {
  UserOutlined,
  BookOutlined,
  ReadOutlined
} from '@ant-design/icons-vue';
import axios from "axios";
import {defineComponent, reactive, toRefs, watch} from 'vue';
import {message} from "ant-design-vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {user_type_to_string, user_type_to_color} from "@/components/utils/enums"

export default defineComponent({
  name: "PersonalCenter",
  setup() {
    const isActive = true
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      collapsed: false,
      selectedKeys: ['1'],
      openKeys: ['sub1'],
      preOpenKeys: ['sub1'],
    });

    watch(
        () => state.openKeys,
        (_val, oldVal) => {
          state.preOpenKeys = oldVal;
        },
    );

    // routes for breadcrumb
    const routes = [{
      path: 'home',
      breadcrumbName: '主页',
    }, {
      path: 'PersonalCenter',
      breadcrumbName: '个人中心',
    }];

    const handleClick = e => {
      // console.log('click', e);
      router.push({
        name: e.key
      })
    };

    const logoutHandler = () => {
      axios.post("/api/auth/logout").then((res) => {
        if (res.data.code !== 0) {
          message.error("登出操作失败，请稍后再试")
        } else {
          message.success("登出成功")
          store.commit("userLogout")
          router.push({
            name: 'MainPage'
          })
        }
      });
    }
    return {
      ...toRefs(state),
      handleClick,
      isActive,
      router,
      store,
      routes,
      logoutHandler,
      user_type_to_string,
      user_type_to_color,
    }
  },

  components: {
    BookOutlined,
    ReadOutlined,
    UserOutlined,
  }
})

</script>

<style scoped lang="scss">

.logo {
  height: 32px;
  margin: 16px;
  padding: 16px;
  overflow: hidden;
}

.logo span {
  margin: 16px;
  font-size: xx-large;
  text-shadow: whitesmoke 1px 1px 1px;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

</style>
