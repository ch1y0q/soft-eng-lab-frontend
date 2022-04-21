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
