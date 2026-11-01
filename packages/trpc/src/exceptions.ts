export type TRPCErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR";

export interface AppExceptionOptions {
  message?: string;
  messageKey?: string;
  params?: Record<string, unknown>;
}

export class AppException extends Error {
  constructor(
    readonly code: TRPCErrorCode,
    input: string | AppExceptionOptions,
  ) {
    super(typeof input === "string" ? input : (input.message ?? input.messageKey ?? "Error"));
    this.name = "AppException";
    this.messageKey = typeof input === "string" ? undefined : input.messageKey;
    this.params = typeof input === "string" ? undefined : input.params;
  }

  readonly messageKey?: string;
  readonly params?: Record<string, unknown>;
}

export class BadRequestException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("BAD_REQUEST", input);
  }
}

export class UnauthorizedException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("UNAUTHORIZED", input);
  }
}

export class ForbiddenException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("FORBIDDEN", input);
  }
}

export class NotFoundException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("NOT_FOUND", input);
  }
}

export class ConflictException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("CONFLICT", input);
  }
}

export class TooManyRequestsException extends AppException {
  constructor(input: string | AppExceptionOptions) {
    super("TOO_MANY_REQUESTS", input);
  }
}
