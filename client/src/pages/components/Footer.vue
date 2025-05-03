<script>
export default {
    data() {
        return {};
    },
    computed: {},
    methods: {},
    async mounted() {},
};
</script>
<template>
    
    <nav class="navbar fixed-bottom bg-body-tertiary">
        <div class="container-fluid">
            <router-link class="fs-4 fw-600" to="/">
                <i class="bi bi-house"></i>
            </router-link>
            <router-link class="fs-4 fw-600" to=/search>
                <i class="bi bi-search "></i>
            </router-link>
            <router-link class="fs-4 fw-600" to="/profile">
                <i class="bi bi-person-circle"></i>
            </router-link>
        </div>
    </nav>
</template>
<style>
.router-link-active {
    font-weight: 700;
    color: red
}

</style>