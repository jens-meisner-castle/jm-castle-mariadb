import { MariaInterface } from "../client/MariaInterface.js";
import { columns, columnsFragment } from "../query/Table.js";
import { ExecuteSetupResponse } from "../response/Response.js";
import { ColumnStatus, Table } from "../table/Table.js";

const getResultFromCreateTableOrDbResponse = (
  response: any | undefined
): Record<string, unknown> => {
  const { affectedRows, insertId, warningStatus } = response || {};
  const jsonStr = JSON.stringify(
    { affectedRows, insertId, warningStatus },
    (key: string, value: any) => {
      if (!key.length) {
        return value;
      }
      if (typeof value === "bigint") {
        return Number.parseInt(value.toString());
      }
      return value;
    }
  );
  return JSON.parse(jsonStr);
};

const alterTableCommand = (table: Table, addColumns: ColumnStatus[]) => {
  const alterSpecs = addColumns
    .map((col) => `ADD COLUMN ${col.name} ${col.type}`)
    .join(", ");
  return `ALTER TABLE ${table.id} NOWAIT ${alterSpecs}`;
};

export const executeSetup = async (
  mariaClient: MariaInterface,
  databaseName: string,
  allTables: Table[]
) => {
  // Create a database
  const createDbCmd = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  const responseCreateDb = await mariaClient.getSetupPool().query(createDbCmd);
  const resultCreateDb = getResultFromCreateTableOrDbResponse(responseCreateDb);
  // Create the tables
  const resultCreateTables: Record<string, any> = {};
  const createTableCmds = allTables.map(
    (table) =>
      `CREATE TABLE IF NOT EXISTS ${table.id} (${columnsFragment(table)})`
  );
  const createTableResponses = await Promise.all(
    createTableCmds.map((create) => mariaClient.getDatabasePool().query(create))
  );
  allTables.forEach((table, i) => {
    resultCreateTables[table.id] = getResultFromCreateTableOrDbResponse(
      createTableResponses[i]
    );
  });
  // Check all columns
  const allColumns = await Promise.all(
    allTables.map((table) => columns(table, mariaClient, databaseName))
  );
  const tablesWithColumns = allTables.map((table, i) => {
    const existingColumns = allColumns[i].result;
    const missingColumns = table.columns.filter(
      (col) => !existingColumns.find((existing) => existing.name === col.name)
    );
    return { table, existingColumns, missingColumns };
  });
  const tablesWithMissingColumns = tablesWithColumns.filter(
    (d) => d.missingColumns.length
  );
  // Alter tables if needed
  const alterTableCmds = tablesWithMissingColumns.map((d) =>
    alterTableCommand(d.table, d.missingColumns)
  );
  const alterTableResponses = await Promise.all(
    alterTableCmds.map((alter) => mariaClient.getDatabasePool().query(alter))
  );
  const resultAlterTables: Record<string, any> = {};
  allTables.forEach((table, i) => {
    resultAlterTables[table.id] = getResultFromCreateTableOrDbResponse(
      alterTableResponses[i]
    );
  });

  const response: ExecuteSetupResponse["setup"] = {
    createDb: { cmds: [createDbCmd], result: resultCreateDb },
    createTables: { cmds: createTableCmds, result: resultCreateTables },
    alterTables: { cmds: alterTableCmds, result: resultAlterTables },
  };
  return response;
};
