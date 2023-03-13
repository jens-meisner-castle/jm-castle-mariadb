import { Pool } from "mariadb";

export interface MariaInterface {
  getSetupPool: () => Pool;
  getDatabasePool: () => Pool;
}
