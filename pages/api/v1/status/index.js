import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
    const updatedAt = new Date().toISOString();

    const databaseName = process.env.POSTGRES_DB;
    const version = await database.query("SHOW server_version;");
    const databaseVersionValue = Number(version.rows[0].server_version);
    const maxConnections = await database.query("SHOW max_connections;");
    const maxConnectionsValue = Number(maxConnections.rows[0].max_connections);

    const dbOpenConnectionResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });
    const dbOpenedConnectionValue = dbOpenConnectionResult.rows[0].count;

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: maxConnectionsValue,
          opened_connections: dbOpenedConnectionValue,
        },
      },
    });

}
