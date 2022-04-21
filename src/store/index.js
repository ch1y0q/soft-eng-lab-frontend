import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            logged_in: false,
            nickname: "",
            userid: "",
            user_type: undefined,
            login_at: undefined,
            username: ""
        }
    }
    , mutations: {
        userStatus(state, [flag, nickname, userid, user_type, username]) {
            state.logged_in = flag
            state.nickname = nickname
            state.userid = userid
            state.user_type = user_type
            state.username = username
            state.login_at = Math.round(new Date() / 1000);
        },

        //获取登录状态
        userLogin(state, [nickname, userid, user_type, username]) {
            state.logged_in = true
            state.nickname = nickname
            state.userid = userid
            state.user_type = user_type
            state.username = username
            state.login_at = Math.round(new Date() / 1000);
        },

        userLogout(state) {
            state.logged_in = false
            state.nickname = ""
            state.userid = ""
            state.user_type = undefined
            state.username = ""
            state.login_at = Math.round(new Date() / 1000);
        },
    }, // 应用mutations
    actions: {}
});

export default store;