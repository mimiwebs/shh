<script>
import {createCommunityModule} from "@/store";
export default {
    props: {
        CommunityId: {
            type: Number,
            required: true,
        },
        CommunitySummary: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isDataLoaded: false,
        };
    },
    computed: {
        ContentList() {
            return this.$Community.ContentList || [];
        },
    },
    methods: {},
    async mounted() {
        await createCommunityModule(this.CommunityId);
    },
};
</script>
<template>
    <div class="col-md-12">
        <div class="community-card radius-10 border-start border-0 border-3 border-danger ms-4">
            <div class="card-body">
                <div class="d-flex align-CommunitySummarys-center">
                    <div>
                        <p class="mb-0 text-secondary fs-5">
                            <i class="bi bi-geo-alt"></i>
                            <span v-html="CommunitySummary.name"></span>
                        </p>
                        <p class="mb-0 d-flex gap-2">
                            <span>
                                <i class="bi bi-people-fill fs-6"></i>

                                {{ CommunitySummary.followerCount }} Members
                            </span>
                            <span v-if="CommunitySummary.contentCount">
                                <i class="bi bi-chat-left fs-6"></i>
                                {{ CommunitySummary.contentCount }}
                            </span>
                        </p>

                        <p class="fst-italic fs-7" v-html="CommunitySummary.description"></p>
                    </div>

                    <router-link class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto" role="button" :to="'/my-community/' + CommunityId">
                        <i class="bi bi-arrow-right lh-0"></i>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
