<template>
  <div class="ViewBindCourseList">
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

      </template>
    </a-list>
  </div>
</template>
<script>
import {defineComponent, reactive, ref} from 'vue';
import {user_type_to_string, user_type_to_color, ErrNo, ErrNo_to_message} from "@/components/utils/enums"
import axios from "axios";
import {message} from "ant-design-vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "ViewBindCourse",

  setup() {
    const store = useStore()

    let listData = reactive([])

    let update_course_visible = ref(false)

    const formStateRef = reactive({
      course_id: "",
      course_name: "",
      // teacher_id: "",
    })

    const fetchAllItems = () => {
      axios.get(`/api/teacher/get_course?teacher_id=${store.state.userid}`)
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

    /** Load all items from backend */
    fetchAllItems()

    return {
      fetchAllItems,
      listData,
      pagination,
      user_type_to_string,
      user_type_to_color,
      update_course_visible,
      formStateRef,
    };
  },

  reload() {
    console.log("reload() called")
    this.fetchAllItems()
  },

});
</script>

<style scoped>

.ViewBindCourseList {
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