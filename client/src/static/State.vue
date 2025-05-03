<script>
export default {
    props: {
        image: {
            type: String,
        },
        title: {
            type: String,
        },
        desc: {
            type: String,
        },
        size: {
            type: Number,
            default: 180,
        },
    },
};
</script>
<template>
    <div class="card-empty gap-0 mt-4">
        <img :src="'/images/states/' + image" :alt="title" class="img-fluid d-block mx-auto mb-3 empty-img" :width="size" />
        <h6 class="text-center text-dark fw-700 h5 empty-title" v-html="title"></h6>
        <p class="text-center text-muted fw-500 fs-8 empty-desc mb-0" v-html="desc"></p>
    </div>
</template>
