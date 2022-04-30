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
              <a-button danger>删除</a-button>
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
import {defineComponent} from 'vue';
import {user_type_to_string, user_type_to_color, ErrNo, ErrNo_to_message} from "@/components/utils/enums"
import axios from "axios";
import {message} from "ant-design-vue";

let listData = [];

export default defineComponent({
  name: "ManageMember",

  setup() {
    axios.get("/api/member/list")
        .then((res) => getMemberListOk(res))
        .catch((error) => {
          message.error("请检查网络状况")
          console.error(error);
        });

    const getMemberListOk = (res) => {
      if (res.data) {
        if (res.data.code === ErrNo["OK"]) {
          listData = Array.from(res.data.data["member_list"])
        } else {
          message.error(ErrNo_to_message(res.data.code))
        }

      } else {
        message.error("网络错误")
      }
    }

    const pagination = {
      /*
      onChange: page => {
        console.log(page);
      },
      */
      pageSize: 10,
    };

    return {
      listData,
      pagination,
      user_type_to_string,
      user_type_to_color,
    };
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