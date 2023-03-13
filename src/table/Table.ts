export interface ColumnStatus {
  name: string;
  type: string;
  autoIncrement?: boolean;
}
export interface Table {
  id: string;
  primaryKey: string;
  columns: ColumnStatus[];
  preferredOrderBy?: { column: string; direction: "ASC" | "DESC" }[];
}

export interface TableStatus {
  name: string;
  table: Table;
  columns: ColumnStatus[];
  isCreated: boolean;
}
