<script>
import {RouterView} from "vue-router";
import Navbar from "./pages/components/Navbar.vue";
import Footer from "./pages/components/Footer.vue";
import router from "./router";
export default {
    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            isLoggedIn: false,
        };
    },
    computed: {},
    methods: {
        UserLoggedIn() {
            const localToken = localStorage.getItem("token");
            if (localToken) {
                return (this.isLoggedIn = true);
            }
            return (this.isLoggedIn = false);
        },
    },
    async mounted() {
        this.UserLoggedIn();
    },
};
</script>

<template>
    <Navbar v-if="isLoggedIn" />
    <RouterView />
    <Footer v-if="isLoggedIn" />
</template>
<style>
.community-card {
    position: relative;
    display: flex;
    padding: 0.75rem;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0px solid rgba(0, 0, 0, 0);
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
}

.fs-7 {
    font-size: 0.875rem !important;
}
.lh-0 {
    line-height: 0 !important;
}
.radius-10 {
    border-radius: 10px !important;
}
.bg-gradient-scooter {
    background: #17ead9;
    background: -webkit-linear-gradient(45deg, #17ead9, #6078ea) !important;
    background: linear-gradient(45deg, #17ead9, #6078ea) !important;
}
.widgets-icons-2 {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ededed;
    font-size: 27px;
    border-radius: 10px;
}
.rounded-circle {
    border-radius: 50% !important;
}
.text-white {
    color: #fff !important;
}
.ms-auto {
    margin-left: auto !important;
}
.bg-gradient-bloody {
    background: #f54ea2;
    background: -webkit-linear-gradient(45deg, #f54ea2, #ff7676) !important;
    background: linear-gradient(45deg, #f54ea2, #ff7676) !important;
}

.bg-gradient-ohhappiness {
    background: #00b09b;
    background: -webkit-linear-gradient(45deg, #00b09b, #96c93d) !important;
    background: linear-gradient(45deg, #00b09b, #96c93d) !important;
}

.bg-gradient-blooker {
    background: #ffdf40;
    background: -webkit-linear-gradient(45deg, #ffdf40, #ff8359) !important;
    background: linear-gradient(45deg, #ffdf40, #ff8359) !important;
}

body {
    max-width: 450px !important;
    margin: 0 auto;
}

.w-fit {
    width: fit-content !important;
}

.h-fit {
    height: fit-content !important;
}

.p-dialog {
    background-color: #f5f5f5 !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem !important;
}
.p-dialog-mask {
    background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
