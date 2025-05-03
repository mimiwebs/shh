<script>
export default {
    data() {
        return {};
    },
    computed: {},
    methods: {
        async Logout() {
            await this.$store.dispatch("Auth/Logout");
            localStorage.clear();
            this.$toast.success("You have successfully logged out!");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        },
    },
    async mounted() {},
};
</script>
<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <img src="/images/logo.png" alt="logo" style="width: 100px" />
            </router-link>
        </div>
    </nav>
</template>
