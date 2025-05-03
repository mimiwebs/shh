const dbConfig = require("./db-config");
const knex = require("knex")(dbConfig.development);

const {createDummyUser} = require("./dummy.datas");

const createUsersTable = async () => {
    await knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();
            table.string("username").notNullable();
            table.string("password").notNullable();
            table.string("email").notNullable();
            table.string("latitude").notNullable();
            table.string("longitude").notNullable();
            table.boolean("is_agreed").notNullable().defaultTo(false);
            table.boolean("is_active").notNullable().defaultTo(true);
            table.timestamp("last_login_date").defaultTo(knex.fn.now());
            table.timestamp("modified_date").defaultTo(knex.fn.now());
            table.timestamp("created_date").defaultTo(knex.fn.now());
            table.boolean("is_deleted").notNullable().defaultTo(false);
        })
        .alterTable("users", function (t) {
            t.unique("email");
            t.unique("username");
        });
};

const createCommunitiesTable = async () => {
    await knex.schema.createTable("communities", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("description").notNullable();
        table.string("latitude").notNullable();
        table.string("longitude").notNullable();
        table.string("address").notNullable();
        table.string("place_type").notNullable();
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table.unique(["latitude", "longitude"]);
    });
};

const createCommunityTypeListTable = async () => {
    await knex.schema.createTable("community_type_list", (table) => {
        table.increments("id").primary();
        table.integer("community_id").unsigned().notNullable().references("id").inTable("communities");
        table.integer("type_enum").notNullable();
        table.string("type_name").notNullable();
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createUserCommunityListTable = async () => {
    await knex.schema.createTable("user_community_list", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("community_id").unsigned().notNullable().references("id").inTable("communities");
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createCommunityContentTable = async () => {
    await knex.schema.createTable("community_contents", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("community_id").unsigned().notNullable().references("id").inTable("communities");
        table.string("content").notNullable();
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createCommunityContentLikeTable = async () => {
    await knex.schema.createTable("community_content_likes", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("community_content_id").unsigned().notNullable().references("id").inTable("community_contents");
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createCommunityContentCommentTable = async () => {
    await knex.schema.createTable("community_content_comments", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("community_content_id").unsigned().notNullable().references("id").inTable("community_contents");
        table.string("comments").notNullable();
        table.integer("parent_community_content_comment_id").unsigned().references("id").inTable("community_content_comments");
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createCommunityContentCommentLikeTable = async () => {
    await knex.schema.createTable("community_content_comment_likes", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable().references("id").inTable("users");
        table.integer("community_content_comment_id").unsigned().notNullable().references("id").inTable("community_content_comments");
        table.timestamp("modified_date").defaultTo(knex.fn.now());
        table.timestamp("created_date").defaultTo(knex.fn.now());
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

const createTables = async () => {
    const hasUsersTable = await knex.schema.hasTable("users");
    const hasCommunitiesTable = await knex.schema.hasTable("communities");
    const hasCommunityTypeListTable = await knex.schema.hasTable("community_type_list");
    const hasUserCommunityListTable = await knex.schema.hasTable("user_community_list");
    const hasCommunityContentTable = await knex.schema.hasTable("community_contents");
    const hasCommunityContentLikeTable = await knex.schema.hasTable("community_content_likes");
    const hasCommunityContentCommentTable = await knex.schema.hasTable("community_content_comments");
    const hasCommunityContentCommentLikeTable = await knex.schema.hasTable("community_content_comment_likes");

    if (!hasUsersTable) await createUsersTable();
    if (!hasCommunitiesTable) {
        await createCommunitiesTable();
    }
    if (!hasCommunityTypeListTable) await createCommunityTypeListTable();
    if (!hasUserCommunityListTable) await createUserCommunityListTable();
    if (!hasCommunityContentTable) await createCommunityContentTable();
    if (!hasCommunityContentLikeTable) await createCommunityContentLikeTable();
    if (!hasCommunityContentCommentTable) await createCommunityContentCommentTable();
    if (!hasCommunityContentCommentLikeTable) await createCommunityContentCommentLikeTable();

    const users = await knex("users").select();
    if (users.length === 0) {
        await createDummyUser();
    }
};

module.exports = {
    createTables,
};
