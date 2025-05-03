##Create Migrations

```
npx knex migrate:make add_unique_constraint_to_communities

exports.up = async function(knex) {
    await knex.schema.alterTable("communities", (table) => {
        table.unique(["latitude", "longitude"]);
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable("communities", (table) => {
        table.dropUnique(["latitude", "longitude"]);
    });
};
npx knex migrate:latest

```
