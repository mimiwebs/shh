<script>
export default {
    data() {
        return {};
    },
    computed: {},
    methods: {
        Logout() {
            localStorage.removeItem("token");
            window.location.href = "/";
        },
    },
    async mounted() {},
};
</script>
<template>
    <State :image="'maintenance.svg'" :title="'Oops!'" :desc="'It is under construction!'" :size="140" />

    <button class="btn btn-secondary bg-opacity-10 fs-7 btn-small" @click="Logout">Logout</button>
</template>
