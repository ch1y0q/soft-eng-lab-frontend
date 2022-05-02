<template>
  <div class="ManageMemberList">
    <a-list item-layout="vertical" size="default" :pagination="pagination" :data-source="listData">
      <!--
      <template #footer>
        <div>
          <b>vCourse</b>
        </div>
      </template>
      -->
      <template #renderItem="{ item }">
        <a-list-item key="item.username" class="antd_list_item">
          <template #extra>
            <a-space style="width: 100%">
              <a-button>编辑</a-button>
              <a-button danger @click="handleRemoveMember(item.user_id)">删除</a-button>
            </a-space>
          </template>
          <a-list-item-meta>
            <template #title>
              <span style="font-size: x-large; text-align: left; ">{{ item.nickname }}</span>
            </template>
            <!-- avatar
            <template #avatar>
              <a-avatar :src="item.avatar"/>
            </template>
            -->
          </a-list-item-meta>
          <a-row :gutter="[50,40]">
            <a-col :span="8"><span class="item_details_label">用户名</span></a-col>
            <a-col :span="8"><span class="item_details_label">用户类型</span>
            </a-col>
            <a-col :span="8"><span class="item_details_label">用户ID</span></a-col>
          </a-row>

          <a-row :gutter="[50,40]" class="item_details_content">
            <a-col :span="8">{{ item.username }}</a-col>
            <a-col :span="8">
              <a-tag :color="user_type_to_color(item.user_type)">{{ user_type_to_string(item.user_type) }}</a-tag>
            </a-col>
            <a-col :span="8">{{ item.user_id }}</a-col>
          </a-row>

        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script>
import {createVNode, defineComponent, reactive} from 'vue';
import {user_type_to_string, user_type_to_color, ErrNo, ErrNo_to_message} from "@/components/utils/enums"
import axios from "axios";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "ManageMember",

  setup() {
    const store = useStore()

    let listData = reactive([])

    const fetchAllItems = () => {
      axios.get("/api/member/list")
          .then((res) => {
                if (res.data) {
                  if (res.data.code === ErrNo["OK"]) {
                    listData.length = 0
                    listData.push(...Array.from(res.data.data["member_list"]))
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

    /** Member remove */

    const doRemoveMember = (user_id) => {
      const obj = {user_id: user_id}
      axios.post("/api/member/delete", obj)
          .then((res) => {
            if (res.data.code === ErrNo["OK"]) {
              message.success("成功删除成员：" + user_id)
            } else {
              message.error("未能删除成员：" + ErrNo_to_message(res.data.code))
            }
          })
          .catch((error) => {
            message.error("请检查网络状况")
            console.error(error);
          });
    }

    const handleRemoveMember = (user_id) => {
      if (user_id === store.state.userid) {
        message.error("您不能删除当前正在使用的成员。")
        return
      }
      Modal.confirm({
        title: '是否删除成员？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您将要删除的成员ID是：' + user_id + "，此操作不可逆。",
        cancelText: '取消',
        okText: '确认',
        async onOk() {
          doRemoveMember(user_id);
          await new Promise(r => setTimeout(r, 1000));  // backend is slow
          fetchAllItems();
          await new Promise(r => setTimeout(r, 1000));  // backend is slow
          // console.log(listData); // for debugging
        },
        onCancel() {
          // do nothing
        },
      });

    }

    /** Load all items from backend */
    console.log("fetchAllItems() in setup()")
    fetchAllItems()

    return {
      fetchAllItems,
      listData,
      pagination,
      user_type_to_string,
      user_type_to_color,
      handleRemoveMember,
    };
  },

  reload() {
    console.log("reload() called")
    this.fetchAllItems()
  },
});
</script>

<style scoped>

.ManageMemberList {
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