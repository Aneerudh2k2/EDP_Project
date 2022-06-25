const pg = require("pg");
const connectionString =
  "postgresql://postgres:password@localhost:5432/interviewcat";
const pool = new pg.Pool({ connectionString });

pool.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log("DB Connected!");
  }
  console.log(err);
});

module.exports = { pool };
