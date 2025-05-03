const dbConfig = require("../_db/db-config");
const knex = require("knex")(dbConfig.development);
const roundTo = (num, places) => +parseFloat(num).toFixed(places);

const NearbyLocations = async (userLatitute, userLongitute, userId) => {
    const roundedLatitude = roundTo(userLatitute, 6);
    const roundedLongitude = roundTo(userLongitute, 6);

    let communities = await knex("communities")
        .select("id", "name", "description", "address", "place_type", "latitude", "longitude")
        .whereBetween(knex.raw("CAST(latitude AS DECIMAL(10, 6))"), [roundedLatitude - 0.014, roundedLatitude + 0.014])
        .andWhereBetween(knex.raw("CAST(longitude AS DECIMAL(10, 6))"), [roundedLongitude - 0.014, roundedLongitude + 0.014]);

    let mainCommunityIdList = communities.map((community) => community.id);

    let communityFollowerCount = await knex("user_community_list")
        .select("community_id")
        .count("user_id as count")
        .whereIn("community_id", mainCommunityIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_id");

    let communityIdList = await knex("user_community_list").select("community_id").where("user_id", userId).andWhere("is_deleted", false);
    communityIdList = communityIdList.map((community) => community.community_id);

    communities = communities.filter((community) => !communityIdList.includes(community.id));

    communities.forEach((community) => {
        const conLikeCount = communityFollowerCount.find((follower) => follower.community_id === community.id);

        community.followerCount = conLikeCount ? conLikeCount.count : 0;
    });
    return communities;
};

const UserFollowedCommunities = async (userId) => {
    let communityIdList = await knex("user_community_list").select("community_id").where("user_id", userId).andWhere("is_deleted", false);
    communityIdList = communityIdList.map((community) => community.community_id);

    let communityList = await knex("communities").select("id", "name", "description").whereIn("id", communityIdList);

    let communityContentCount = await knex("community_contents")
        .select("community_id")
        .count("id as count")
        .whereIn("community_id", communityIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_id");

    let communityFollowerCount = await knex("user_community_list")
        .select("community_id")
        .count("user_id as count")
        .whereIn("community_id", communityIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_id");

    communityList.forEach((community) => {
        const conCount = communityContentCount.find((content) => content.community_id === community.id);

        community.contentCount = conCount ? conCount.count : 0;
        community.followerCount = communityFollowerCount.find((follower) => follower.community_id === community.id).count;
    });
    return communityList;
};

const FollowedCommunityContents = async (userId, communityId) => {
    let community = await knex("communities").select("id", "name", "description").where("id", communityId).first();
    if (!community) return undefined;

    let returnData = {
        community: community,
        contentList: [],
    };

    let contentList = await knex("community_contents").select("id", "content", "created_date").where("community_id", communityId).andWhere("is_deleted", false);
    let contentIdList = contentList.map((content) => content.id);

    let contentLikeCount = await knex("community_content_likes")
        .select("community_content_id as content_id")
        .count("community_content_id as count")
        .whereIn("community_content_id", contentIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_content_id");

    let currentUserLikedContent = await knex("community_content_likes").select("community_content_id").where("user_id", userId).andWhere("is_deleted", false);

    let contentCommentCount = await knex("community_content_comments")
        .select("community_content_id")
        .count("id as count")
        .whereIn("community_content_id", contentIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_content_id");

    contentList.forEach((content) => {
        const conLikeCount = contentLikeCount.find((like) => like.content_id === content.id);
        const conCommentCount = contentCommentCount.find((comment) => comment.community_content_id === content.id);

        content.commentCount = conCommentCount ? conCommentCount.count : 0;

        content.likeCount = conLikeCount ? conLikeCount.count : 0;
        content.isLiked = currentUserLikedContent.some((like) => like.community_content_id === content.id);
    });
    returnData.contentList = contentList.reverse();

    return returnData;
};

const FollowedCommunityContentComments = async (contentId) => {
    let commentList = await knex("community_content_comments")
        .select("id", "comments")
        .where("community_content_id", contentId)
        .andWhere("is_deleted", false)
        .andWhere("parent_community_content_comment_id", 0);

    let commentIdList = commentList.map((comment) => comment.id);

    let commentChildList = await knex("community_content_comments")
        .select("id", "comments", "parent_community_content_comment_id")
        .whereIn("parent_community_content_comment_id", commentIdList)
        .andWhere("is_deleted", false);

    let commentLikeCount = await knex("community_content_comment_likes")
        .count("community_content_comment_id")
        .whereIn("community_content_comment_id", commentIdList)
        .andWhere("is_deleted", false)
        .groupBy("community_content_comment_id");

    commentList.forEach((comment) => {
        let likeCount = commentLikeCount.find((like) => like.community_content_id === comment.id);
        comment.likeCount = likeCount ? likeCount.count : 0;

        comment.childComments = commentChildList.filter((child) => child.parent_community_content_comment_id === comment.id);
    });

    return commentList;
};

module.exports = {NearbyLocations, UserFollowedCommunities, FollowedCommunityContents, FollowedCommunityContentComments};
