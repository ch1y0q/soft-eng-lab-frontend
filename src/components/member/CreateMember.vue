<template>
  <div class="CreateMember">
    <div class="main">
      <div class="CreateMemberForm">
        <a-form
            :model="formStateRef"
            :rules="ruleValidateRef"
            @finishFailed="onFinishFailed"
            @finish="onFinish"
            :label-width="80"
        >
          <a-divider>成员信息录入</a-divider>

          <a-form-item label="成员昵称" name="nickname">
            <a-input
                v-model:value="formStateRef.nickname"
                placeholder="输入成员的昵称"
                show-word-limit
                :maxlength="20"
            />
          </a-form-item>

          <a-form-item label="成员用户名" name="username">
            <a-input
                v-model:value="formStateRef.username"
                placeholder="输入成员的用户名"
                show-word-limit
                :maxlength="20"
            />
          </a-form-item>

          <a-form-item label="成员密码" name="password">
            <a-input-password
                v-model:value="formStateRef.password"
                placeholder="输入成员的密码"
                show-word-limit
                :maxlength="20"
            />
          </a-form-item>


          <a-form-item label="成员类型" name="user_type">
            <a-select v-model:value="formStateRef.user_type" placeholder="选择成员类型">
              <a-select-option :value="1">{{ user_type_to_string(1) }}</a-select-option>
              <a-select-option :value="2">{{ user_type_to_string(2) }}</a-select-option>
              <a-select-option :value="3">{{ user_type_to_string(3) }}</a-select-option>
            </a-select>
          </a-form-item>


          <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
            <a-button type="primary" @click.prevent="handleSubmit">创建</a-button>
            <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
          </a-form-item>

        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {Form, message} from "ant-design-vue";
import {user_type_to_string} from "@/components/utils/enums";
import {computed, defineComponent, reactive} from "vue";
import {useRouter} from "vue-router";
import {toArray} from 'lodash-es';

const useForm = Form.useForm;
export default defineComponent({
  name: "CreateMember",
  setup() {
    const router = useRouter()

    const formStateRef = reactive({
      username: "",
      nickname: "",
      password: "",
      user_type: undefined,
    })

    const usernameValidator = (rule, value) => {
      const reg = /^[A-Za-z]{8,20}$/;
      if (!value) {
        Promise.reject("用户名不能为空")
      } else if (value.length < 8 || value.length > 20) {
        Promise.reject("用户名长度应当在8~20之间")
      } else if (!reg.test(value)) {
        Promise.reject("用户名应当仅包含大小写字母")
      } else return Promise.resolve();
    }

    const passwordValidator = (rule, value) => {
      const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (!value) {
        return Promise.reject("密码不能为空")
      } else if (value.length < 8 || value.length > 20) {
        return Promise.reject("密码长度应当在8~20之间")
      } else if (!reg.test(value)) {
        return Promise.reject("密码应当同时包含大小写字母和数字")
      } else return Promise.resolve()
    }

    const ruleValidateRef = reactive({
      username: [
        {
          required: true,
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
          type: 'string',
          validator: passwordValidator,
          trigger: "blur"
        }
      ],
      user_type: [
        {
          required: true,
          message: "用户类型不能为空",
          trigger: "blur"
        }
      ]
    })

    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });

    const {resetFields, validate, validateInfos, mergeValidateInfo} = useForm(formStateRef, ruleValidateRef);

    const handleReset = () => {
      resetFields();
    }

    const createMemberOk = (res) => {
      if (res.data) {
        switch (res.data.code) {
          case 0:
            message.success("成功添加成员：" + res.data.data['user_id']);
            handleReset();
            break;
          case 1:
            message.error("参数不合法");
            break;
          case 2:
            message.error("用户名已存在");
            break;
          case 255:
          default:
            message.error("未知错误");
        }
      } else {
        message.error("网络错误，请稍后再试")
      }
    }

    const createMember = () => {
      let obj = {
        username: formStateRef.username,
        nickname: formStateRef.nickname,
        password: formStateRef.password,
        user_type: formStateRef.user_type,
      };
      axios
          .post("/api/member/create", obj)
          .then(res => createMemberOk(res));
    }

    const handleSubmit = () => {
      validate()
          .then(() => {
            createMember();
          })
          .catch(err => {
            message.error('无法创建成员：' + err);
          });

    }

    const onFinish = (values) => {
      console.log('Create Success:', values);
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Create Failed:', errorInfo);
    }

    return {
      router,
      handleSubmit,
      createMemberOk,
      user_type_to_string,
      handleReset,
      createMember,
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

.CreateMemberForm {
  max-width: 600px;
  margin: 0 auto;
  border-right: 1px solid #eee;
}


</style>
