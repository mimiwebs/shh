<script>
import CommunityItem from "./Community/CommunityItem.vue";

export default {
    components: {
        CommunityItem,
    },
    data() {
        return {
            isDataLoaded: false,
        };
    },
    computed: {
        MyList() {
            return this.$store.state.My.List;
        },
    },
    methods: {
        async GetMyList() {
            const response = await this.$store.dispatch("My/GetList");
            if (response == true) {
                this.isDataLoaded = true;
            } else {
                console.log("Error");
            }
        },
    },
    async mounted() {
        await this.GetMyList();
    },
};
</script>
<template>
    <template v-if="!isDataLoaded">Loading...</template>
    <template v-if="isDataLoaded">
        <State :image="'block.svg'" :title="'No community followed yet'" :desc="'Just click below search and find some!'" :size="140" v-if="!MyList.length" />

        <template v-for="item in MyList" :key="item.id">
            <CommunityItem :CommunityId="item.id" :CommunitySummary="item" />
        </template>
    </template>
</template>
