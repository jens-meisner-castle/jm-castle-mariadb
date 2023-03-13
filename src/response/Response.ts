import { ErrorCode } from "jm-castle-types";

export interface CreateDbResponse {
  cmds: string[];
  result: Record<string, unknown>;
}

export interface CreateTablesResponse {
  cmds: string[];
  result: Record<string, unknown>;
}

export interface AlterTablesResponse {
  cmds: string[];
  result: Record<string, unknown>;
}

export interface ExecuteSetupResponse {
  setup: {
    createDb: CreateDbResponse;
    createTables: CreateTablesResponse;
    alterTables: AlterTablesResponse;
  };
}

export type InsertResponse<R> =
  | {
      result: { cmd: string; affectedRows: number; data: R };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };

export type UpdateResponse<R> =
  | {
      result: { cmd: string; affectedRows: number; data: R };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };

export type SelectResponse<R> =
  | {
      result: { cmd: string; rows: R[] };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };

export type FindResponse<R> =
  | {
      result: { cmd: string; row: R | undefined };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };

export type DeleteResponse =
  | {
      result: { cmd: string; affectedRows: number };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };

export type BatchResponse =
  | {
      result: { cmds: string[] };
      error?: never;
      errorCode?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
      errorCode?: ErrorCode;
      errorDetails?: Record<string, unknown>;
    };
