const express = require("express");
const router = express.Router();

const dbConfig = require("../_db/db-config");
const db = require("knex")(dbConfig.development);

const tokenControl = require("../middleware/token-control");
const {FollowedCommunityContents, FollowedCommunityContentComments} = require("../utils/community.helpers");

router.get("/:communityId/contents", tokenControl, async (req, res) => {
    try {
        const {userId} = req;
        const {communityId} = req.params;
        if (!userId || !communityId) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        const contents = await FollowedCommunityContents(userId, communityId);
        return res.status(200).send({
            data: contents,
            message: "Success",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error occurred.",
            status: 500,
        });
    }
});

router.post("/:communityId/create-content", tokenControl, async (req, res) => {
    try {
        const {content} = req.body;
        const {communityId} = req.params;
        const {userId} = req;

        if (!communityId || !content) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        await db("community_contents").insert({
            user_id: userId,
            community_id: communityId,
            content: content,
        });

        return res.status(200).send({
            message: "Success",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error occurred.",
            status: 500,
        });
    }
});

// status: 1 => follow, status: 0 => unfollow
router.post("/:communityId/contents/:contentId/like-content", tokenControl, async (req, res) => {
    try {
        const {status} = req.body;
        const {contentId} = req.params;

        const {userId} = req;

        if (!contentId) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        if (status === 1) {
            await db("community_content_likes").insert({
                user_id: userId,
                community_content_id: contentId,
            });
        }

        if (status === 0) {
            await db("community_content_likes").where("user_id", userId).andWhere("community_content_id", contentId).update({
                is_deleted: true,
            });
        }

        return res.status(200).send({
            message: "Success",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error occurred.",
            status: 500,
        });
    }
});

router.get("/:communityId/contents/:contentId/comments", tokenControl, async (req, res) => {
    try {
        const {contentId} = req.params;
        if (!contentId) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        const comments = await FollowedCommunityContentComments(contentId);

        return res.status(200).send({
            data: {
                commentList: comments,
            },
            message: "Success",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error occurred.",
            status: 500,
        });
    }
});

router.post("/:communityId/contents/:contentId/create-comment", tokenControl, async (req, res) => {
    try {
        const {comment, parentId} = req.body;
        const {userId} = req;
        const {contentId} = req.params;

        if (!contentId || !comment) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        await db("community_content_comments").insert({
            user_id: userId,
            community_content_id: contentId,
            parent_community_content_comment_id: parentId,
            comments: comment,
        });

        return res.status(200).send({
            message: "Success",
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error occurred.",
            status: 500,
        });
    }
});

module.exports = router;
