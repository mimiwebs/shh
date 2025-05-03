const express = require("express");
const router = express.Router();

const dbConfig = require("../_db/db-config");
const db = require("knex")(dbConfig.development);

const tokenControl = require("../middleware/token-control");
const {NearbyLocations, UserFollowedCommunities} = require("../utils/community.helpers");

// status: 1 => follow, status: 0 => unfollow
router.post("/follow-community", tokenControl, async (req, res) => {
    try {
        const {communityId, status} = req.body;
        const {userId} = req;

        if (!communityId || !status) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        let community = await db("communities").select("id").where("id", communityId);
        if (community.length === 0) {
            return res.status(404).send({
                message: "Community not found.",
                status: 404,
            });
        }

        let id = 0;
        if (parseInt(status) == 1) {
            let isExist = await db("user_community_list").select("id").where("user_id", userId).andWhere("community_id", communityId).andWhere("is_deleted", false);

            if (isExist.length > 0) {
                return res.status(400).send({
                    message: "You are already following this community.",
                    status: 400,
                });
            }

            await db("user_community_list")
                .insert({
                    user_id: userId,
                    community_id: communityId,
                })
                .then((response) => {
                    id = response[0];
                });
        }

        if (parseInt(status) === 0) {
            let isExist = await db("user_community_list").select("id").where("user_id", userId).andWhere("community_id", communityId).andWhere("is_deleted", false);

            if (isExist.length === 0) {
                return res.status(400).send({
                    message: "You are not following this community.",
                    status: 400,
                });
            }

            await db("user_community_list")
                .where("user_id", userId)
                .andWhere("community_id", communityId)
                .update({
                    is_deleted: true,
                })
                .then((response) => {
                    id = response[0];
                });
        }

        return res.status(200).send({
            data: {
                id,
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

router.get("/nearby-communities", tokenControl, async (req, res) => {
    try {
        const {latitude, longitude} = req;
        if (!latitude || !longitude) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        const communities = await NearbyLocations(latitude, longitude, req.userId);
        return res.status(200).send({
            data: {
                communityList: communities,
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

router.get("/my-communities", tokenControl, async (req, res) => {
    try {
        const {userId} = req;
        if (!userId) {
            return res.status(400).send({
                message: "Invalid input.",
                status: 400,
            });
        }

        const communities = await UserFollowedCommunities(userId);

        return res.status(200).send({
            data: {
                communityList: communities,
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

module.exports = router;
