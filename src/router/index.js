import {createRouter, createWebHashHistory} from "vue-router"

const MainPage = () => import("@/components/MainPage")
const Login = () => import("@/components/Login")
const NotFound = () => import("@/components/404")

const routes = [
    { path: "/", redirect: "/home" },
    {
        path: "/home",
        name: "MainPage",
        component: MainPage
    },
    {
        path: "/login",
        name: "login",
        component: Login
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
