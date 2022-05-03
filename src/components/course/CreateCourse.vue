<template>
  <div class="CreateCourseForm">
    <a-form
        :model="formStateRef"
        :rules="ruleValidateRef"
        @finishFailed="onFinishFailed"
        @finish="onFinish"
        :label-width="80"
    >
      <a-divider>课程信息录入</a-divider>

      <a-form-item label="课程名称" name="course_name">
        <a-input
            v-model:value="formStateRef.course_name"
            placeholder="输入课程的名称"
            show-word-limit
            :maxlength="50"
        />
      </a-form-item>

      <a-form-item label="课程容量" name="course_cap">
        <a-input
            v-model:value="formStateRef.course_cap"
            placeholder="输入课程的容量"
            show-word-limit
        />
      </a-form-item>

      <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
        <a-button type="primary" @click.prevent="handleSubmit">创建</a-button>
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

const useForm = Form.useForm;
export default defineComponent({
  name: "CreateMember",
  setup() {
    const router = useRouter()

    const formStateRef = reactive({
      course_name: "",
      course_cap: 0,
    })

    const ruleValidateRef = reactive({
      course_name: [
        {
          required: true,
          message: "课程名称不能为空",
          type: 'string',
          trigger: "blur"
        }
      ],
      course_cap: [
        {
          required: true,
          message: "课程容量不能为空",
          trigger: "blur"
        },
        {
          trigger: 'blur',
          validator(rule, value) {
            if (/^(?!0$)\d{1,5}$/.test(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject('课程容量应当是1~5位的正整数');
            }
          }
        }
      ],
    })

    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });

    const {resetFields, validate, validateInfos, mergeValidateInfo} = useForm(formStateRef, ruleValidateRef);

    const handleReset = () => {
      resetFields();
    }

    const createCourseOk = (res) => {
      if (res.data) {
        if (res.data.code === ErrNo["OK"]) {
          message.success("成功添加课程：" + res.data.data['course_id']);
          handleReset();
        } else {
          message.error(ErrNo_to_message(res.data.code))
        }
      } else {
        message.error("网络错误，请稍后再试")
      }
    }

    const createCourse = () => {
      let obj = {
        name: formStateRef.course_name,
        cap: Number(formStateRef.course_cap),
      };
      axios
          .post("/api/course/create", obj)
          .then(res => createCourseOk(res));
    }

    const handleSubmit = () => {
      validate()
          .then(() => {
            createCourse();
          })
          .catch(err => {
            message.error('无法创建课程：' + err);
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
      createCourseOk,
      user_type_to_string,
      handleReset,
      createCourse,
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

.CreateCourseForm {
  max-width: 600px;
  margin: 0 auto;
  border-right: 1px solid #eee;
}


</style>
