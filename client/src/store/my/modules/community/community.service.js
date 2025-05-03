import {panelHttp} from "@/http/axios";

class CommunityServ {
    async GetContentList(communityId) {
        return await panelHttp.get(`community/${communityId}/contents`);
    }

    async CreateContent(communityId, payload) {
        return await panelHttp.post(`community/${communityId}/create-content`, payload);
    }

    async LikeContent(communityId, contentId, payload) {
        return await panelHttp.post(`community/${communityId}/contents/${contentId}/like-content`, payload);
    }

    async GetCommentList(communityId, contentId) {
        return await panelHttp.get(`community/${communityId}/contents/${contentId}/comments`);
    }

    async AddComment(communityId, contentId, payload) {
        return await panelHttp.post(`community/${communityId}/contents/${contentId}/create-comment`, payload);
    }
}

export default new CommunityServ();
