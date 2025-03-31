import database from 'infra/database.js'

async function status(request, response) {
  const updatedAt = new Date().toISOString()

  const databaseVersionResult = await database.query("SHOW server_version;")
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResults = await database.query("SHOW max_connections;")
  const databaseMaxConnectionsValue = databaseMaxConnectionsResults.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenConnectionsResults = await database.query(
    {
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    },
  );
  // ""
  const databaseOpenConnectionsValue = databaseOpenConnectionsResults.rows[0].count;

  response
    .status(200)
    .json({
      updated_at: updatedAt,
      dependencies:{
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          open_connections: databaseOpenConnectionsValue,
        }
      }
    });
}

export default status;
