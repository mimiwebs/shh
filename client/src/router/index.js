import {createRouter, createWebHistory} from "vue-router";
import SearchHome from "@/pages/Search/SearchHome.vue";
import DashboardHome from "@/pages/Dashboard/DashboardHome.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ForgotPassword from "@/pages/ForgotPassword.vue";

import CustomMiddleware from "@/router/middleware";
import ProfileHome from "@/pages/Profile/ProfileHome.vue";
import CommunityProfileHome from "@/pages/Dashboard/Community/Profile/CommunityProfileHome.vue";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: DashboardHome,
            beforeEnter: CustomMiddleware,
        },
        {
            path: "/search",
            name: "Search",
            component: SearchHome,
            beforeEnter: CustomMiddleware,
        },
        {
            path: "/profile",
            name: "Profile",
            component: ProfileHome,
            beforeEnter: CustomMiddleware,
        },
        {
            path: "/my-community/:CommunityId",
            name: "CommunityProfile",
            component: CommunityProfileHome,
            beforeEnter: CustomMiddleware,
        },
        {
            path: "/login",
            name: "Login",
            component: Login,
        },
        {
            path: "/register",
            name: "Register",
            component: Register,
        },
        {
            path: "/forgot-password",
            name: "ForgotPassword",
            component: ForgotPassword,
        },
    ],
});

export const GetCommunityId = () => {
    const params = router.currentRoute._value.params;

    return params.CommunityId;
};

export default router;
