<script>
export default {
    props: {
        CommentList: {
            type: Array,
            default: () => [],
        },
        Content: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        async AddComment(parentId = 0) {
            this.Community.CommentPayload.ContentId = this.Content.id;
            this.Community.CommentPayload.ParentId = parentId;
            const response = await this.$store.dispatch("My/Community/AddComment");
            if (response == true) {
                this.$toast.success("Comment added successfully!");
            } else {
                this.$toast.error("An error occurred!");
            }
        },
    },
    async mounted() {},
};
</script>
<template>
    <div class="col-md-12">
        <div class="input-group">
            <div class="form-floating form-floating-fit">
                <Textarea v-model="Community.CommentPayload.Comment" autoResize rows="2" cols="30" class="form-control custom-input" />
                <label for="title">Content</label>
            </div>
            <button type="button" class="btn bg-danger bg-opacity-10 text-danger mt-2 h-fit mt-auto" @click="AddComment()" :disabled="!Community.CommentPayload.Comment" @keyup.enter="AddComment()">
                <i class="bi bi-send"></i>
            </button>
        </div>
    </div>
    <div class="col-md-12 mt-3">
        <template v-if="CommentList.length">
            <h4>Recent Gossipies</h4>
            <template v-for="(item, index) in CommentList" :key="'comment_' + item.id">
                <div class="card" style="border: 1px solid #f7f2f2">
                    <div class="card-body">
                        <p class="card-text" v-html="item.comments"></p>
                    </div>
                    <div class="card-footer border-top-0 py-1">
                        <small class="text-muted fs-7">
                            <i class="bi bi-clock"></i>
                            {{ $GetDateFromNow(item.created_date) }}
                        </small>

                        <button type="button" class="btn fs-7">
                            <i class="bi bi-heart me-1 lh-0"></i>
                            <span clas="">{{ item.likeCount }}</span>
                        </button>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
