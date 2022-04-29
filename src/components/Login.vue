<template>
  <div class="Login">
    <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
      <a-form-item
          name="username"
          label=""
          :rules="[{ required: true, message: '请输入您的用户名' }]"
      >
        <a-input v-model:value="formState.username" placeholder="用户名"/>
      </a-form-item>

      <a-form-item
          name="password"
          label=""
          :rules="[{ required: true, message: '请输入您的密码' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="密码"/>
      </a-form-item>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" @click="handleSubmit()">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// @ is an alias to /src

import {message} from 'ant-design-vue';
import {defineComponent, reactive} from 'vue';
import axios from "axios";
import {useRouter} from 'vue-router'
import {useStore} from "vuex"
import {ErrNo} from "@/components/utils/enums";

export default defineComponent({
  name: "LogIn",

  setup() {
    const store = useStore()
    const router = useRouter()
    const formState = reactive({
      username: "",
      password: "",
      remember: true
    })

    const toWhoAmI = (() => {
      router.push({
        name: 'whoami'
      })
    })

    const onFinish = (values) => {
      console.log('Login Success:', values);
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Login Failed:', errorInfo);
    }

    const getLoginInfoOk = (res) => {
      if (res.data) {
        switch (res.data.code) {
          case ErrNo["WrongPassword"]:
            message.error("密码错误!");
            break;

          case ErrNo["UserNotExisted"]:
            message.error("用户不存在！");
            break;

          case ErrNo["OK"]:
            axios.get("/api/auth/whoami").then((whoami_res) => {
              if (!whoami_res || whoami_res.data.code) {
                message.error("未知错误!");
              } else {
                // set session
                store.commit("userLogin", [whoami_res.data.data["nickname"],
                  whoami_res.data.data["user_id"], whoami_res.data.data["user_type"], whoami_res.data.data["username"]]);
                message.success("登录成功！", 1);
                toWhoAmI();
              }
            });
            break;

          case ErrNo["UnknownError"]: // fall through
          default:
            message.error("未知错误！");
            break;
        }
      } else {
        message.error("网络错误，请稍后再试")
      }
    }

    const getLoginInfo = () => {
      let obj = {
        username: formState.username,
        password: formState.password,
      };
      axios.post("/api/auth/login", obj).then((res) => getLoginInfoOk(res));
    }

    const handleSubmit = () => {
      getLoginInfo();
    }

    return {handleSubmit, onFinish, onFinishFailed, getLoginInfo, getLoginInfoOk, formState}
  },

})
;

</script>

<style lang="scss" scoped>
.Login {
  padding: 10px;
  max-width: 350px;
  margin: auto;
  font-weight: bold;
}

</style>
