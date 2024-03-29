export const user_type_to_string = (user_type) => {
    switch (user_type) {
        case 1:
            return "管理员"
        case 2:
            return "学生"
        case 3:
            return "教师"
        default:
            return "未知身份"
    }
}

export const user_type_to_color = (user_type) => {
    switch (user_type) {
        case 1:
            return "green"
        case 2:
            return "blue"
        case 3:
            return "red"
        default:
            return "grey"
    }
}


export const ErrNo = {
    OK: 0,
    ParamInvalid: 1, // 参数不合法
    UserHasExisted: 2, // 该 Username 已存在
    UserHasDeleted: 3, // 用户已删除
    UserNotExisted: 4, // 用户不存在
    WrongPassword: 5, // 密码错误
    LoginRequired: 6, // 用户未登录
    CourseNotAvailable: 7, // 课程已满
    CourseHasBound: 8, // 课程已绑定过
    CourseNotBind: 9, // 课程未绑定过
    PermDenied: 10, // 没有操作权限
    StudentNotExisted: 11, // 学生不存在
    CourseNotExisted: 12, // 课程不存在
    StudentHasNoCourse: 13, // 学生没有课程
    StudentHasCourse: 14, // 学生有课程

    UnknownError: 255, // 未知错误
}

export const ErrNo_message = {
    0: "OK",
    1: "参数不合法",
    2: "该 Username 已存在",
    3: "用户已删除",
    4: "用户不存在",
    5: "密码错误",
    6: "用户未登录",
    7: "课程已满",
    8: "课程已绑定过",
    9: "课程未绑定过",
    10: "没有操作权限",
    11: "学生不存在",
    12: "课程不存在",
    13: "学生没有课程",
    14: "学生有课程",

    255: "未知错误",
}

export const ErrNo_to_message = (cur_ErrNo) => {
    if (Object.prototype.hasOwnProperty.call(ErrNo_message, cur_ErrNo)) {
        return ErrNo_message[cur_ErrNo];
    } else {
        return ErrNo_message[ErrNo["UnknownError"]];
    }
}
