import {createRouter, createWebHashHistory} from "vue-router"
import store from "@/store";

const MainPage = () => import("@/components/MainPage")

const Login = () => import("@/components/Login")
const NotFound = () => import("@/components/404")
const WhoAmI = () => import("@/components/WhoAmI")

const PersonalCenter = () => import("@/components/PersonalCenter")

const CreateMember = () => import("@/components/member/CreateMember")
const ManageMember = () => import("@/components/member/ManageMember")
const ManageMyInfo = () => import("@/components/member/ManageMyInfo")

const CreateCourse = () => import("@/components/course/CreateCourse")
const ManageCourse = () => import("@/components/course/ManageCourse")

const BindCourse = () => import("@/components/teacher/BindCourse")
const UnbindCourse = () => import("@/components/teacher/UnbindCourse")

const routes = [
    {path: "/", redirect: "/home"},
    {
        path: "/home",
        name: "MainPage",
        component: MainPage,
        children: [
            {
                path: "/login",
                name: "login",
                component: Login
            },
            {
                path: "/whoami",
                name: "whoami",
                component: WhoAmI
            },
        ]
    },
    {
        path: "/personal-center",
        name: "PersonalCenter",
        component: PersonalCenter,
        children: [
            {
                path: "/create-member",
                name: "CreateMember",
                component: CreateMember,
                meta: {
                    requires_login: true,
                    //permission: 4,
                }
            },
            {
                path: "/manage-member",
                name: "ManageMember",
                component: ManageMember,
                meta: {
                    requires_login: true,
                    //permission: 4,
                }
            },
            {
                path: "/manage-my-info",
                name: "ManageMyInfo",
                component: ManageMyInfo,
                meta: {
                    requires_login: true,
                    //permission: 3,
                }
            },

            {
                path: "/create-course",
                name: "CreateCourse",
                component: CreateCourse,
                meta: {
                    requires_login: true,
                    //permission: 6,
                }
            },
            {
                path: "/manage-course",
                name: "ManageCourse",
                component: ManageCourse,
                meta: {
                    requires_login: true,
                    //permission: 6,
                }
            },

            {
                path: "/bind-course",
                name: "BindCourse",
                component: BindCourse,
                meta: {
                    requires_login: true,
                    //permission: 6,
                }
            },
            {
                path: "/unbind-course",
                name: "UnbindCourse",
                component: UnbindCourse,
                meta: {
                    requires_login: true,
                    // permission: 6,
                }
            },
        ]
    },

    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})


router.beforeEach((to, from, next) => {
    if (to.meta.requires_login) {  // 判断该路由是否需要登录权限
        if (store.state.logged_in && store.state.userid) {  // 通过vuex state获取当前的token是否存在
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }
})