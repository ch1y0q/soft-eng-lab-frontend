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
        <a-button type="primary" html-type="submit" @click="handleSubmit('formState')">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// @ is an alias to /src

import {message} from 'ant-design-vue';
import {defineComponent} from 'vue';
import axios from "axios";

export default defineComponent({
  name: "LogIn",
  data() {
    return {
      formState: {
        username: "",
        password: "",
        remember: true
      },
      name: ""
    };
  },
  methods: {
    onFinish: values => {
      console.log('Success:', values);
    },

    onFinishFailed: errorInfo => {
      console.log('Failed:', errorInfo);
    },

    handleSubmit() {
      this.getLoginInfo();
    },

    getLoginInfo() {
      let obj = {
        username: this.formState.username,
        password: this.formState.password,
      };
      axios.post("/api/auth/login", obj).then(res => this.getLoginInfoOk(res));
    },

    getLoginInfoOk(res) {
      if (res.data) {
        switch (res.data.code) {
          case 5:
            message.error("密码错误!");
            break;
          case 4:
            message.error("用户不存在！");
            break;
          case 0:
            message.success("登录成功！");
            //TODO: this.$router.push({ path: "/path/to/somewhere" });
            break;
          default:
            message.error("未知错误！");
        }
      }
    }
  }
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
