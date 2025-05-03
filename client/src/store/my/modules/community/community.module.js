import CommunityServ from "./community.service";
import {GetCommunityId} from "@/router";
export const Community = {
    namespaced: true,
    state: {
        Detail: null,
        ContentList: [],

        NewPostModal: {
            Show: false,
            Content: "",
        },

        LikeContentPayload: {
            ContentId: "",
            Status: null,
        },

        CommentPayload: {
            ContentId: "",
            Comment: "",
            ParentId: "",
        },
    },
    mutations: {
        SET_CONTENT_LIST(state, data) {
            state.ContentList = data;
        },
        SET_DETAIL(state, data) {
            state.Detail = data;
        },
    },
    actions: {
        async GetContentList({commit, state}) {
            try {
                let err = null;
                let communityId = GetCommunityId();
                const response = await CommunityServ.GetContentList(communityId).catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                const {data} = response.data;
                const list = data.contentList;
                const profile = data.community;
                commit("SET_DETAIL", profile);
                commit("SET_CONTENT_LIST", list);
                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
        async CreateContent({commit, state, dispatch}) {
            try {
                let err = null;
                let payload = {
                    content: state.NewPostModal.Content,
                };
                const communityId = GetCommunityId();
                const response = await CommunityServ.CreateContent(communityId, payload).catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                dispatch("GetContentList");

                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
        async LikeContent({commit, state, dispatch}) {
            try {
                let err = null;
                let payload = {
                    status: state.LikeContentPayload.Status,
                };
                const communityId = GetCommunityId();
                const contentId = state.LikeContentPayload.ContentId;
                const response = await CommunityServ.LikeContent(communityId, contentId, payload).catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                await dispatch("GetContentList");

                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },

        async GetCommentList({commit, state}, contentId) {
            try {
                let err = null;
                let communityId = GetCommunityId();
                const response = await CommunityServ.GetCommentList(communityId, contentId).catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                return response.data.data;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },

        async AddComment({commit, state, dispatch}) {
            try {
                let err = null;
                let payload = {
                    comment: state.CommentPayload.Comment,
                    parentId: state.CommentPayload.ParentId,
                };
                const communityId = GetCommunityId();
                const contentId = state.CommentPayload.ContentId;
                const response = await CommunityServ.AddComment(communityId, contentId, payload).catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                await dispatch("GetContentList");
                await dispatch("GetCommentList", contentId);

                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
    },
};
