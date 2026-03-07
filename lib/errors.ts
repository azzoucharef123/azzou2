export class AppError extends Error {
  constructor(message: string, readonly statusCode = 500, readonly code = "APP_ERROR") {
    super(message);
    this.name = new.target.name;
  }
}

export class ConfigurationError extends AppError {
  constructor(message = "Required environment configuration is missing.") {
    super(message, 503, "CONFIGURATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication is required.") {
    super(message, 401, "AUTHENTICATION_REQUIRED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "The request conflicts with the current resource state.") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationFailureError extends AppError {
  constructor(message = "The request payload is invalid.") {
    super(message, 400, "VALIDATION_ERROR");
  }
}
