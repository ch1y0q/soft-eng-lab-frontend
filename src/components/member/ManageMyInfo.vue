<template>
  <div class="UpdateMyInfoForm">
    <a-form
        :model="formStateRef"
        :rules="ruleValidateRef"
        @finishFailed="onFinishFailed"
        @finish="onFinish"
        :label-width="80"
    >
      <a-divider>个人信息更新</a-divider>

      <a-form-item label="成员ID" name="user_id">
        <a-input
            v-model:value="formStateRef.user_id"
            placeholder="输入新ID"
            show-word-limit
            :maxlength="20"
            disabled="true"
        />
      </a-form-item>

      <a-form-item label="成员昵称" name="nickname">
        <a-input
            v-model:value="formStateRef.nickname"
            placeholder="输入新昵称"
            show-word-limit
            :maxlength="20"
        />
      </a-form-item>

      <a-form-item label="成员用户名" name="username">
        <a-input
            v-model:value="formStateRef.username"
            placeholder="输入新用户名"
            show-word-limit
            :maxlength="20"
            disabled="true"
        />
      </a-form-item>

      <!--
      <a-form-item label="成员密码" name="password">
        <a-input-password
            v-model:value="formStateRef.password"
            placeholder="输入新密码"
            show-word-limit
            :maxlength="20"
            disabled="true"
        />
      </a-form-item>
      -->


      <a-form-item label="成员类型" name="user_type" style="text-align: left">
        <a-tag :color="user_type_to_color(store.state.user_type)">{{
            user_type_to_string(store.state.user_type)
          }}
        </a-tag>
      </a-form-item>


      <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
        <a-button type="primary" @click.prevent="handleSubmit">更新</a-button>
        <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import axios from "axios";
import {Form, message} from "ant-design-vue";
import {ErrNo, ErrNo_to_message, user_type_to_string} from "@/components/utils/enums";
import {computed, defineComponent, reactive} from "vue";
import {useRouter} from "vue-router";
import {toArray} from 'lodash-es';
import {useStore} from "vuex";
import {user_type_to_color} from "@/components/utils/enums"

const useForm = Form.useForm;
export default defineComponent({
  name: "ManageMyInfo",
  setup() {
    const router = useRouter()
    const store = useStore()
    const formStateRef = reactive({
      user_id: store.state.userid,
      username: store.state.username,
      nickname: store.state.nickname,
      password: "",
      user_type: store.state.user_type,
    })


    const usernameValidator = (rule, value) => {
      const reg = /^[A-Za-z]{8,20}$/;
      if (!value) {
        return Promise.reject("用户名不能为空")
      }
      if (value.length < 8 || value.length > 20) {
        return Promise.reject("用户名长度应当在8~20之间")
      } else if (!reg.test(value)) {
        return Promise.reject("用户名应当仅包含大小写字母")
      } else {
        return Promise.resolve();
      }
    }

    const passwordValidator = (rule, value) => {
      // Leave it blank to make password unchanged
      if (value === "") {
        return Promise.resolve()
      }
      const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@!%*?&._#-]{8,20}$/;
      if (!value) {
        return Promise.reject("密码不能为空")
      }
      if (value.length < 8 || value.length > 20) {
        return Promise.reject("密码长度应当在8~20之间")
      } else if (!reg.test(value)) {
        return Promise.reject("密码应当同时包含大小写字母和数字")
      } else return Promise.resolve()
    }

    const ruleValidateRef = reactive({
      username: [
        {
          // required: true,
          type: 'string',
          validator: usernameValidator,
          trigger: "blur"
        }
      ],
      nickname: [
        {
          required: true,
          message: "昵称不能为空",
          trigger: "blur"
        },
        {
          type: 'string',
          min: 4,
          message: "昵称不能小于4位",
          trigger: "blur"
        }
      ],
      password: [
        {
          // required: true,
          type: 'string',
          validator: passwordValidator,
          trigger: "blur"
        }
      ],
      /* user_type cannot be modified, no validation rules
      user_type: [
        {
          required: true,
          message: "用户类型不能为空",
          trigger: "blur"
        }
      ]

      */
    })

    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });

    const {resetFields, validate, validateInfos, mergeValidateInfo} = useForm(formStateRef, ruleValidateRef);

    const handleReset = () => {
      resetFields();
      formStateRef.nickname = store.state.nickname;
    }

    const updateMyInfoOk = async (res) => {
      if (res.data) {
        if (res.data.code === ErrNo["OK"]) {
          axios.get("/api/auth/whoami").then((whoami_res) => {
            if (!whoami_res || whoami_res.data.code) {
              message.error("未知错误!");
            } else {
              // set session
              store.commit("userLogin", [whoami_res.data.data["nickname"],
                whoami_res.data.data["user_id"], whoami_res.data.data["user_type"], whoami_res.data.data["username"]]);
              message.success("已更新个人信息", 1);
            }
          });
          await new Promise(r => setTimeout(r, 500));
          handleReset();
        } else {
          message.error(ErrNo_to_message(res.data.code))
        }
      } else {
        message.error("网络错误，请稍后再试")
      }
    }

    const updateMyInfo = () => {
      let obj = {
        user_id: formStateRef.user_id,
        // username: formStateRef.username,
        nickname: formStateRef.nickname,
        // password: formStateRef.password,
        // user_type: formStateRef.user_type,
      };
      axios
          .post("/api/member/update", obj)
          .then(res => updateMyInfoOk(res));
    }

    const handleSubmit = () => {
      validate()
          .then(() => {
            updateMyInfo();
          })
          .catch(err => {
            message.error('无法更新个人信息：' + err);
          });

    }

    const onFinish = (values) => {
      console.log('Update my info Success:', values);
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Update my info Failed:', errorInfo);
    }

    return {
      router,
      store,
      user_type_to_color,
      handleSubmit,
      updateMyInfo,
      user_type_to_string,
      handleReset,
      updateMyInfoOk,
      formStateRef,
      ruleValidateRef,
      onFinish,
      onFinishFailed,
      errorInfos
    }
  }
});
</script>

<style scoped lang="scss">

.UpdateMyInfoForm {
  max-width: 600px;
  margin: 0 auto;
  border-right: 1px solid #eee;
}


</style>
