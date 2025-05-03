<script>
import CommentContainer from "./Comments/CommentContainer.vue";

export default {
    components: {
        CommentContainer,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            CommentList: [],
            showCommentList: false,
            isCommentLoaded: false,
        };
    },
    computed: {},
    methods: {
        async LikeContent(item) {
            this.Community.LikeContentPayload.ContentId = item.id;
            this.Community.LikeContentPayload.Status = item.isLiked ? 0 : 1;

            const response = await this.$store.dispatch("My/Community/LikeContent");
            if (response == true) {
            } else {
                this.$toast.error("An error occurred!");
            }
        },
        async GetCommentList() {
            this.showCommentList = !this.showCommentList;
            const response = await this.$store.dispatch("My/Community/GetCommentList", this.item.id);
            if (!response) {
                this.$toast.error("An error occurred!");
            }
            const {commentList} = response;
            this.CommentList = commentList?.reverse();
            this.isCommentLoaded = true;
        },
    },
    async mounted() {},
};
</script>
<template>
    <div class="community-card mx-3">
        <div class="card-body">
            <h5 class="card-title text-center">
                <span v-html="item.title"></span>
            </h5>
            <p class="card-text">
                <span v-html="item.content"></span>
            </p>
            <div class="card-footer fs-7">
                <small class="text-muted">
                    <i class="bi bi-clock"></i>
                    {{ $GetDateFromNow(item.created_date) }}
                </small>
                <button type="button" class="btn fs-7" @click="LikeContent(item)">
                    <i class="bi bi-heart me-1 lh-0" v-if="!item.isLiked"></i>
                    <i class="bi bi-heart-fill me-1 text-danger lh-0" v-else></i>
                    <span clas="">{{ item.likeCount }}</span>
                </button>

                <button type="button" class="btn fs-7" @click="GetCommentList">
                    <i class="bi bi-chat me-1 lh-0"></i>
                    <span clas="">{{ item.commentCount }}</span>
                </button>
            </div>
            <div class="mt-3" v-if="showCommentList">
                <template v-if="isCommentLoaded">
                    <CommentContainer :CommentList="CommentList" :Content="item" />
                </template>
            </div>
        </div>
    </div>
</template>
