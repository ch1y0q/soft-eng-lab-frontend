import {createRouter, createWebHashHistory} from "vue-router"

const MainPage = () => import("@/components/MainPage")
const Login = () => import("@/components/Login")
const NotFound = () => import("@/components/404")
const WhoAmI = () => import("@/components/WhoAmI")

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
