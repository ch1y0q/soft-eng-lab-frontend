<template>
  <div class="ViewCourseList">
    <a-list item-layout="vertical" size="default" :pagination="pagination" :data-source="listData">
      <template #renderItem="{item}">
        <a-list-item key="item.course_id" class="antd_list_item">
          <template #extra>
            <a-space style="width: 100%">
              <a-button @click="handleSelectCourse(item.course_id)">选择课程</a-button>
            </a-space>
          </template>
          <a-list-item-meta>
            <template #title>
              <span style="font-size: x-large; text-align: left; ">
                {{ item.name }}
              </span>
            </template>
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

      </template>
    </a-list>
  </div>
</template>

<script>
import {createVNode, defineComponent, reactive} from "vue";
import axios from "axios";
import {message, Modal} from "ant-design-vue";
import {ErrNo} from "@/components/utils/enums";
import {ErrNo_to_message} from "@/components/utils/enums";
import {ExclamationCircleFilled} from "@ant-design/icons-vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "ViewCourse",

  setup() {
    let listData = reactive([])
    const store = useStore()


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
      pageSize: 10,
    };

    const handleSelectCourse = (course_id) => {
      Modal.confirm({
            title: '是否确认选课？',
            icon: createVNode(ExclamationCircleFilled),
            content: '你要选择的课程ID是：' + course_id,
            cancelText: '取消',
            okText: '确认',
            async onOk() {
              doSelectCourse(course_id);
              await new Promise(r => setTimeout(r, 1000));
              fetchAllItems();
              await new Promise(r => setTimeout(r, 1000));
            },
            onCancel() {

            },
          }
      );
    }

    const doSelectCourse = (course_id) => {
      const obj = {student_id: store.state.userid, course_id: course_id}
      axios.post("/api/student/book_course", obj)
          .then((res) => {
            if (res.data.code === ErrNo["OK"]) {
              message.success("成功选课：" + course_id)
            } else {
              message.error("未能选上：" + ErrNo_to_message(res.data.code))
            }
          })
          .catch((error) => {
            message.error("请检查网络状况")
            console.error(error);
          });
    }

    fetchAllItems()

    return {
      fetchAllItems,
      listData,
      pagination,
      handleSelectCourse,
      doSelectCourse
    }
  }
});


</script>

<style scoped>
.ViewCourseList {
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