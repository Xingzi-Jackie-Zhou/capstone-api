/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  //users table
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
  });
  // Create the weather table
  await knex.schema.createTable("weather", (table) => {
    table.increments("id").primary().index();
    table.string("city_name").notNullable();
    table.integer("climate_id").unsigned().notNullable().index();
    table.date("date").notNullable();
    table.decimal("ave_temperature", 5, 1).nullable();
    table.decimal("total_preciptation", 5, 1).nullable();
    table.integer("user_id").unsigned().nullable();
    table.foreign("user_id").references("id").inTable("users");
  });

  await knex.schema.createTable("discharge", (table) => {
    table.increments("id").primary().index();
    table.string("station_id").notNullable().index();
    table.date("date").notNullable();
    table.decimal("discharge", 5, 2).nullable();
    table.decimal("water_level", 5, 3).nullable();
    table.integer("user_id").unsigned().nullable();
    table.foreign("user_id").references("id").inTable("users");
  });

  await knex.schema.createTable("main_record", (table) => {
    table.increments("id").primary().index();
    table.string("site_name").notNullable();
    table.string("site_id").notNullable().references("discharge.station_id");
    table.string("river").notNullable();
    table.integer("city_id").unsigned().index();
    table.integer("user_id").unsigned().nullable();
    table.foreign("user_id").references("id").inTable("users");
  });
  await knex.schema.createTable("weather_main_record", (table) => {
    table.increments("id").primary().index();
    table
      .integer("weather_id")
      .unsigned()
      .notNullable()
      .references("weather.climate_id")
      .references("main_record.city_id");
    table.string("weather_site").notNullable();
    table.integer("user_id").unsigned().nullable();
    table.foreign("user_id").references("id").inTable("users");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("weather");
  await knex.schema.dropTableIfExists("weather_main_record");
  await knex.schema.dropTableIfExists("main_record");
  await knex.schema.dropTableIfExists("discharge");
  await knex.schema.dropTable("users");
}
