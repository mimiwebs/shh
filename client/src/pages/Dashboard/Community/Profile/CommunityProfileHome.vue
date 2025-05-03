<script>
import ContentItem from "./components/ContentItem.vue";
import NewPostModal from "./components/NewPostModal.vue";

export default {
    components: {
        NewPostModal,
        ContentItem,
    },
    data() {
        return {
            isDataLoaded: false,
        };
    },
    computed: {
        Detail() {
            return this.Community.Detail || {};
        },
        ContentList() {
            return this.Community.ContentList || [];
        },
    },
    methods: {
        async GetContentList() {
            this.isDataLoaded = false;
            const response = await this.$store.dispatch("My/Community/GetContentList");
            if (response == true) {
                this.isDataLoaded = true;
            } else {
                this.$toast.error("An error occurred!");
            }
        },
        OpenNewPostModal() {
            this.Community.NewPostModal.Show = true;
        },
    },
    async mounted() {
        await this.GetContentList();
    },
};
</script>
<template>
    <div class="col-md-12 mt-3">
        <router-link to="/" class="btn bg-secondary btn-small fs-7 py-1 d-flex bg-opacity-10 w-fit">
            <i class="bi bi-arrow-left lh-0 fs-5"></i>
        </router-link>
    </div>
    <div class="col-md-12 mt-3">
        <template v-if="isDataLoaded">
            <h2 class="d-flex justify-content-between">
                <span v-html="Detail.name"></span>
                <button type="button" class="btn btn-secondary btn-small fs-7 py-1 d-flex" @click="OpenNewPostModal">
                    <i class="bi bi-plus lh-0 fs-4"></i>
                    New post
                </button>
            </h2>
            <div class="row">
                <div class="col-md-12">
                    <template v-if="ContentList.length > 0">
                        <template v-for="item in ContentList" :key="item.id">
                            <ContentItem :item="item" />
                        </template>
                    </template>
                    <template v-else>
                        <State :image="'chat.svg'" :title="'No gossipy found'" :desc="'Would you like to start a conversiton?'" :size="140" />
                    </template>
                </div>
            </div>
        </template>
        <template v-if="!isDataLoaded">Loading...</template>
    </div>
    <NewPostModal v-if="Community.NewPostModal.Show" />
</template>
