<template>
  <div class="UnbindCourseForm">
    <a-form
        :model="formStateRef"
        :rules="ruleValidateRef"
        @finishFailed="onFinishFailed"
        @finish="onFinish"
        :label-width="80"
    >
      <a-divider>解绑课程</a-divider>

      <a-form-item label="课程ID" name="course_id">
        <a-input
            v-model:value="formStateRef.course_id"
            placeholder="输入课程ID"
            show-word-limit
            :maxlength="10"
        />
      </a-form-item>

      <a-form-item label="教师ID" name="teacher_id">
        <a-input
            v-model:value="formStateRef.teacher_id"
            placeholder="输入教师ID"
            show-word-limit
            :maxlength="10"
        />
      </a-form-item>

      <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
        <a-button type="primary" @click.prevent="handleSubmit">解绑</a-button>
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


const useForm = Form.useForm;
export default defineComponent({
  name: "UnbindCourse",
  setup() {
    const router = useRouter()

    const store = useStore()

    const formStateRef = reactive({
      course_id: "",
      teacher_id: "",
    })

    // if I am teacher, fill teacher_id for me
    if(store.state.user_type === 3) {
      formStateRef.teacher_id = store.state.userid
    }

    const ruleValidateRef = reactive({
      course_id: [
        {
          required: true,
          message: "课程ID不能为空",
          type: 'string',
          trigger: "blur"
        }
      ],
      teacher_id: [
        {
          required: true,
          message: "教师ID不能为空",
          type: 'string',
          trigger: "blur"
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

    const unbindCourseOk = (res) => {
      if (res.data) {
        if (res.data.code === ErrNo["OK"]) {
          message.success("成功解绑课程");
          handleReset();
        } else {
          message.error(ErrNo_to_message(res.data.code))
        }
      } else {
        message.error("网络错误，请稍后再试")
      }
    }

    const unbindCourse = () => {
      let obj = {
        course_id: formStateRef.course_id,
        teacher_id: formStateRef.teacher_id,
      };
      axios
          .post("/api/teacher/unbind_course", obj)
          .then(res => unbindCourseOk(res));
    }

    const handleSubmit = () => {
      validate()
          .then(() => {
            unbindCourse();
          })
          .catch(err => {
            message.error('无法解绑课程：' + err);
          });

    }

    const onFinish = (values) => {
      console.log('Unbind Success:', values);
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Unbind Failed:', errorInfo);
    }

    return {
      router,
      handleSubmit,
      unbindCourseOk,
      user_type_to_string,
      handleReset,
      unbindCourse,
      formStateRef,
      ruleValidateRef,
      onFinish,
      onFinishFailed,
      errorInfos
    }
  }
});
</script>

<style scoped>
.UnbindCourseForm {
  max-width: 600px;
  margin: 0 auto;
  border-right: 1px solid #eee;
}
</style>