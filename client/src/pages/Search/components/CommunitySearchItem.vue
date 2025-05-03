<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        async MakeFollow() {
            this.$store.state.NearBy.FollowPayload.communityId = this.item.id;
            this.$store.state.NearBy.FollowPayload.status = 1;
            const response = await this.$store.dispatch("NearBy/Follow");
            if (response == true) {
                this.$toast.success("You have successfully followed this community!");
                this.$store.state.NearBy.List = this.$store.state.NearBy.List.filter((x) => x.id != this.item.id);
            } else {
                this.$toast.error("An error occurred while following this community!");
            }
        },
    },
    async mounted() {},
};
</script>
<template>
    <div class="col-md-12">
        <div class="community-card radius-10 border-start border-0 border-3 border-info ms-4">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div>
                        <p class="mb-0 text-secondary" v-html="item.name"></p>
                        <p class="mb-0 font-13">
                            <i class="bi bi-people-fill fs-6"></i>

                            {{ item.followerCount }} Members
                        </p>

                        <p class="fst-italic fs-7" v-html="item.description"></p>
                    </div>

                    <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto" role="button" @click="MakeFollow">
                        <i class="bi bi-plus lh-0 fs-2"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
