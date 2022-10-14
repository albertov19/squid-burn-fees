module.exports = class Data1664823255884 {
  name = 'Data1664823255884'

  async up(db) {
    await db.query(`CREATE TABLE "burn_data" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, "account" text NOT NULL, CONSTRAINT "PK_d9f7336d20d0038d97e143e82b0" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "burn_data"`)
  }
}
