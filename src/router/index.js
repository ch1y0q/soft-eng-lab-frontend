import {createRouter, createWebHashHistory} from "vue-router"
import store from "@/store";

const NotFound = () => import("@/components/404")
const Forbidden = () => import("@/components/403")

const MainPage = () => import("@/components/MainPage")

const Login = () => import("@/components/Login")
const WhoAmI = () => import("@/components/WhoAmI")

const PersonalCenter = () => import("@/components/PersonalCenter")

const CreateMember = () => import("@/components/member/CreateMember")
const ManageMember = () => import("@/components/member/ManageMember")
const ManageMyInfo = () => import("@/components/member/ManageMyInfo")

const CreateCourse = () => import("@/components/course/CreateCourse")
const ManageCourse = () => import("@/components/course/ManageCourse")

const BindCourse = () => import("@/components/teacher/BindCourse")
const UnbindCourse = () => import("@/components/teacher/UnbindCourse")
const ViewBindCourse = () => import('@/components/teacher/ViewBindCourse')

const ViewCourse = () => import("@/components/student/ViewCourse")

/** Permission bits:
 * 0b100: Allow admin
 * 0b010: Allow teacher
 * 0b001: Allow student
 *
 * e.g. Set permission to 6 => 0b110 => allow admin and teacher to access
 * */

const routes = [
    {path: "/", redirect: "/home"},
    {
        path: "/home",
        name: "MainPage",
        component: MainPage,
        meta: {
            breadcrumbName: '主页',
        },
        children: [
            {
                path: "/login",
                name: "login",
                component: Login,
                meta: {
                    breadcrumbName: '登录',
                },
            },
            {
                path: "/whoami",
                name: "whoami",
                component: WhoAmI,
                meta: {
                    breadcrumbName: '登录信息',
                },
            },
        ]
    },
    {
        path: "/personal-center",
        name: "PersonalCenter",
        component: PersonalCenter,
        meta: {
            breadcrumbName: '个人中心',
        },
        children: [
            {
                path: "/create-member",
                name: "CreateMember",
                component: CreateMember,
                meta: {
                    breadcrumbName: '创建成员',
                    requires_login: true,
                    permission: 4,
                }
            },
            {
                path: "/manage-member",
                name: "ManageMember",
                component: ManageMember,
                meta: {
                    breadcrumbName: '管理成员',
                    requires_login: true,
                    permission: 4,
                }
            },
            {
                path: "/manage-my-info",
                name: "ManageMyInfo",
                component: ManageMyInfo,
                meta: {
                    breadcrumbName: '管理个人信息',
                    requires_login: true,
                    permission: 3,
                }
            },

            {
                path: "/create-course",
                name: "CreateCourse",
                component: CreateCourse,
                meta: {
                    breadcrumbName: '创建课程',
                    requires_login: true,
                    permission: 6,
                }
            },
            {
                path: "/manage-course",
                name: "ManageCourse",
                component: ManageCourse,
                meta: {
                    breadcrumbName: '管理课程',
                    requires_login: true,
                    permission: 6,
                }
            },

            {
                path: "/bind-course",
                name: "BindCourse",
                component: BindCourse,
                meta: {
                    breadcrumbName: '绑定课程',
                    requires_login: true,
                    permission: 6,
                }
            },
            {
                path: "/unbind-course",
                name: "UnbindCourse",
                component: UnbindCourse,
                meta: {
                    breadcrumbName: '解绑课程',
                    requires_login: true,
                    permission: 6,
                }
            },
            {
                path: "/view-bind-course",
                name: "ViewBindCourse",
                component: ViewBindCourse,
                meta: {
                    breadcrumbName: '查看绑定课程',
                    requires_login: true,
                    permission: 2,
                }
            },
            {
                path: "/view-course",
                name: "ViewCourse",
                component: ViewCourse,
                meta: {
                    breadcrumbName: '查看所有课程',
                    requires_login: true,
                    permission: 1,
                }
            },
        ]
    },

    {
        path: '/403',
        name: 'Forbidden',
        component: Forbidden
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
    if (to.meta['requires_login']) {  // 判断该路由是否需要登录权限
        if (store.state.logged_in && store.state.userid) {  // 通过vuex state获取当前的token是否存在
            if (!to.meta['permission']) next();
            else if ((store.state.user_type === 1 && to.meta['permission'] & 0x4)   // admin
                || (store.state.user_type === 3 && to.meta['permission'] & 0x2)     // teacher
                || (store.state.user_type === 2 && to.meta['permission'] & 0x1)) {  // student

                console.log("authorization passed");
                next();
            } else {
                console.log("authorization FAILED");
                next({
                    path: '/403',
                })
            }
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