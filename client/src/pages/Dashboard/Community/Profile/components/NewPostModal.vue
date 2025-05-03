<script>
export default {
    data() {
        return {
            visible: false,
        };
    },
    computed: {},
    methods: {
        CloseModal() {
            this.Community.NewPostModal.Content = "";
            this.Community.NewPostModal.Show = false;
        },
        async Create() {
            const response = await this.$store.dispatch("My/Community/CreateContent");
            if (response == true) {
                this.$toast.success("Post Created Successfully");
                this.CloseModal();
                return;
            }

            this.$toast.error("Failed to Create Post");
        },
    },
    async mounted() {},
};
</script>
<template>
    <Dialog v-model:visible="Community.NewPostModal.Show" modal header="Edit Profile" :style="{width: '25rem'}">
        <template #header>
            <h5>New Post</h5>
        </template>
        <div class="modal-body">
            <div class="col-md-12">
                <div class="form-floating form-floating-fit">
                    <Textarea v-model="Community.NewPostModal.Content" autoResize rows="5" cols="30" class="form-control" />
                    <label for="title">Content</label>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <button @click="CloseModal" type="button" class="btn btn-action btn-small fs-7">Close</button>
                <button @click="Create" type="button" class="btn bg-success text-success bg-opacity-10 fs-7" :disabled="!Community.NewPostModal.Content">Create</button>
            </div>
        </template>
    </Dialog>
</template>
