<template>
  <div class="ManageCourseList">
    <a-list item-layout="vertical" size="default" :pagination="pagination" :data-source="listData">
      <!--
      <template #footer>
        <div>
          <b>vCourse</b>
        </div>
      </template>
      -->
      <template #renderItem="{ item }">
        <a-list-item key="item.course_id" class="antd_list_item">
          <template #extra>
            <a-space style="width: 100%">
              <a-button @click="handleUpdateCourse(item.course_id, item.course_name)">编辑</a-button>
              <a-button danger @click="handleRemoveCourse(item.course_id)">删除</a-button>
            </a-space>
          </template>
          <a-list-item-meta>
            <template #title>
              <span style="font-size: x-large; text-align: left; ">{{ item.name }}</span>
            </template>
            <!-- avatar
            <template #avatar>
              <a-avatar :src="item.avatar"/>
            </template>
            -->
          </a-list-item-meta>
          <a-row :gutter="[50,40]">
            <a-col :span="12"><span class="item_details_label">课程ID</span></a-col>
            <a-col :span="12"><span class="item_details_label">教师ID</span></a-col>
          </a-row>

          <a-row :gutter="[50,40]" class="item_details_content">
            <a-col :span="12">{{ item.course_id }}</a-col>
            <a-col :span="12">{{ item.teacher_id }}</a-col>
          </a-row>

        </a-list-item>

        <a-modal v-model:visible="update_course_visible" title="修改课程信息" cancel-text="取消" ok-text="确定"
                 @ok="handleUpdateCourseConfirmed">
          <edit-outlined/>
          <a-form
              :model="formStateRef"
              :label-width="80"
          >
            <a-form-item label="课程名称" name="course_name">
              <a-input
                  v-model:value="formStateRef.course_name"
                  placeholder="输入课程的名称"
                  show-word-limit
                  :maxlength="50"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </template>
    </a-list>
  </div>
</template>
<script>
import {createVNode, defineComponent, reactive, ref} from 'vue';
import {user_type_to_string, user_type_to_color, ErrNo, ErrNo_to_message} from "@/components/utils/enums"
import axios from "axios";
import {message, Modal} from "ant-design-vue";
import {EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";
// import {useStore} from "vuex";

export default defineComponent({
  name: "ManageCourse",

  setup() {
    // const store = useStore()

    let listData = reactive([])

    let update_course_visible = ref(false)

    const formStateRef = reactive({
      course_id: "",
      course_name: "",
      // teacher_id: "",
    })

    const fetchAllItems = () => {
      axios.get("/api/course/list")
          .then((res) => {
                if (res.data) {
                  if (res.data.code === ErrNo["OK"]) {
                    listData.length = 0
                    listData.push(...Array.from(res.data.data["course_list"]))
                  } else {
                    message.error(ErrNo_to_message(res.data.code))
                  }
                } else {
                  message.error("网络错误")
                }
              }
          )
          .catch((error) => {
            message.error("请检查网络状况")
            console.error(error);
          });
    }

    const pagination = {
      /*
      onChange: page => {
        console.log(page);
      },
      */
      pageSize: 10,
    };

    /** Course remove */

    const doRemoveCourse = (course_id) => {
      const obj = {course_id: course_id}
      axios.post("/api/course/delete", obj)
          .then((res) => {
            if (res.data.code === ErrNo["OK"]) {
              message.success("成功删除课程：" + course_id)
            } else {
              message.error("未能删除课程：" + ErrNo_to_message(res.data.code))
            }
          })
          .catch((error) => {
            message.error("请检查网络状况")
            console.error(error);
          });
    }

    const handleRemoveCourse = (course_id) => {
      Modal.confirm({
        title: '是否删除课程？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您将要删除的课程ID是：' + course_id + "，此操作不可逆。",
        cancelText: '取消',
        okText: '确认',
        okButtonProps: {danger: true},
        async onOk() {
          doRemoveCourse(course_id);
          await new Promise(r => setTimeout(r, 1000));  // backend is slow
          fetchAllItems();
          await new Promise(r => setTimeout(r, 1000));  // backend is slow
        },
        onCancel() {
          // do nothing
        },
      });
    }


    /** Course edit */
    const doUpdateCourse = (course_id, new_name) => {
      const obj = {course_id: course_id, name: new_name}
      axios.post("/api/course/update", obj)
          .then((res) => {
            if (res.data.code === ErrNo["OK"]) {
              message.success("成功修改课程信息：" + course_id)
            } else {
              message.error("未能修改课程信息：" + ErrNo_to_message(res.data.code))
            }
          })
          .catch((error) => {
            message.error("请检查网络状况")
            console.error(error);
          });
    }

    const handleUpdateCourse = (course_id, cur_name) => {
      formStateRef.course_name = cur_name
      formStateRef.course_id = course_id
      update_course_visible.value = true
    }

    const handleUpdateCourseConfirmed = async () => {
      doUpdateCourse(formStateRef.course_id, formStateRef.course_name)
      update_course_visible.value = false
      await new Promise(r => setTimeout(r, 1000));  // backend is slow
      fetchAllItems();
    }

    /** Load all items from backend */
    fetchAllItems()

    return {
      fetchAllItems,
      listData,
      pagination,
      user_type_to_string,
      user_type_to_color,
      handleRemoveCourse,
      handleUpdateCourse,
      handleUpdateCourseConfirmed,
      update_course_visible,
      formStateRef,
      doUpdateCourse,
    };
  },

  reload() {
    console.log("reload() called")
    this.fetchAllItems()
  },

  components: {
    EditOutlined,
  }
});
</script>

<style scoped>

.ManageCourseList {
  max-width: 600px;
  margin: 0 auto;
}

.item_details_label {
  font-size: smaller;
  font-weight: lighter;
  color: gray;
}

.item_details_content {
  font-size: large;
  font-weight: normal;
}

.antd_list_item {
  border-bottom: thin solid #919191;
}

</style>