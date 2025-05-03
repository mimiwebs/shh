<script>
import CommunitySearchItem from "./components/CommunitySearchItem.vue";

export default {
    components: {
        CommunitySearchItem,
    },
    data() {
        return {
            isDataLoaded: false,
        };
    },
    computed: {
        CommunityList() {
            return this.$store.state.NearBy.List || [];
        },
    },
    methods: {
        async GetCommunityList() {
            const response = await this.$store.dispatch("NearBy/GetList");
            if (response) {
                this.isDataLoaded = true;
            }
        },
    },
    async mounted() {
        this.isDataLoaded = false;
        await this.GetCommunityList();
    },
};
</script>
<template>
    <div>
        <h3 class="text-center">Popular Communities Around</h3>

        <div class="accordion" id="accordionExample" v-if="isDataLoaded">
            <template v-for="(item, index) in CommunityList" :key="index">
                <CommunitySearchItem :item="item" />
            </template>
        </div>
    </div>
</template>
