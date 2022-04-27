<template>
  <div class="WhoAmI">
    <a-card title="您已登录" style="width: 300px">
      <p>用户名：{{ store.state.username }}</p>
      <p>用户昵称：{{ store.state.nickname }}</p>
      <p>用户ID：{{ store.state.userid }}</p>
      <p>用户身份：{{ user_type_to_string(store.state.user_type) }}</p>
      <a-space :size=32>
        <a-button type="primary" html-type="submit" danger @click="handleLogout">登出</a-button>
        <a-button type="primary" html-type="submit" @click="handlePersonalCenter">用户中心</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import axios from "axios";
import {message} from 'ant-design-vue';
import {user_type_to_string} from "@/components/utils/enums"

export default {
  name: "WhoAmI",
  setup() {
    const store = useStore()
    const router = useRouter()

    // console.log(store.state.username)
    // console.log(store.state.userid)
    // console.log(store.state.user_type)

    const handleLogout = () => {
      axios.post("/api/auth/logout").then((res) => getLogoutInfoOk(res));
    }

    const handlePersonalCenter = () => {
      router.push({
        name: 'PersonalCenter'
      })
    }

    const getLogoutInfoOk = (res) => {
      if (res.data.code !== 0) {
        message.error("登出操作失败，请稍后再试")
      } else {
        message.success("登出成功")
        store.commit("userLogout")
        router.push({
          name: 'login'
        })
      }
    }

    return {store, handlePersonalCenter, handleLogout, user_type_to_string}
  }
}

</script>

<style scoped>
.WhoAmI {
  padding: 10px;
  max-width: 350px;
  margin: auto;
  font-weight: bold;
}

</style>