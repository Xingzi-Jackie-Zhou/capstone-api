/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Create the weather table
  await knex.schema.createTable("weather", (table) => {
    table.increments("id").primary().index(); // Primary key, already indexed
    table.string("city_name").notNullable();
    table.integer("climate_id").unsigned().notNullable().index();
    table.date("date").notNullable();
    table.decimal("ave_temperature", 5, 1).nullable(); // using decimal for temperature
    table.decimal("total_preciptation", 5, 1).nullable(); // using decimal for precipitation
  });

  await knex.schema.createTable("discharge", (table) => {
    table.increments("id").primary().index(); // Primary key, already indexed
    table.string("station_id").notNullable().index();
    // .onUpdate("CASCADE")
    // .onDelete("CASCADE")
    table.date("date").notNullable();
    table.decimal("discharge", 5, 2).nullable(); // using decimal for discharge
    table.decimal("water_level", 5, 3).nullable(); // using decimal for water_level
  });

  await knex.schema.createTable("main_record", (table) => {
    table.increments("id").primary().index(); // Primary key, already indexed
    table.string("site_name").notNullable();
    table.string("site_id").notNullable().references("discharge.station_id");
    table.string("river").notNullable();
    table.integer("city_id").unsigned().index();
    // .onUpdate("CASCADE")
    // .onDelete("CASCADE")
  });
  await knex.schema.createTable("weather_main_record", (table) => {
    table.increments("id").primary().index(); // Primary key, already indexed
    table
      .integer("weather_id")
      .unsigned()
      .notNullable()
      .references("weather.climate_id")
      .references("main_record.city_id");
    table.string("weather_site").notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Drop tables in reverse order of creation to avoid foreign key constraint issues
  await knex.schema.dropTableIfExists("weather");
  await knex.schema.dropTableIfExists("weather_main_record");
  await knex.schema.dropTableIfExists("main_record");
  await knex.schema.dropTableIfExists("discharge");
}
