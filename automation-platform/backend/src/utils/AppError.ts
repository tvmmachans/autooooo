export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  // Vercel error code to status code mapping
  private static vercelErrorMap: Record<string, number> = {
    // Function errors
    'BODY_NOT_A_STRING_FROM_FUNCTION': 502,
    'EDGE_FUNCTION_INVOCATION_FAILED': 500,
    'EDGE_FUNCTION_INVOCATION_TIMEOUT': 504,
    'FUNCTION_INVOCATION_FAILED': 500,
    'FUNCTION_INVOCATION_TIMEOUT': 504,
    'FUNCTION_PAYLOAD_TOO_LARGE': 413,
    'FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE': 500,
    'FUNCTION_THROTTLED': 503,
    'MICROFRONTENDS_MIDDLEWARE_ERROR': 500,
    'MICROFRONTENDS_MISSING_FALLBACK_ERROR': 400,
    'MIDDLEWARE_INVOCATION_FAILED': 500,
    'MIDDLEWARE_INVOCATION_TIMEOUT': 504,
    'NO_RESPONSE_FROM_FUNCTION': 502,

    // Deployment errors
    'DEPLOYMENT_BLOCKED': 403,
    'DEPLOYMENT_DELETED': 410,
    'DEPLOYMENT_DISABLED': 402,
    'DEPLOYMENT_NOT_FOUND': 404,
    'DEPLOYMENT_NOT_READY_REDIRECTING': 303,
    'DEPLOYMENT_PAUSED': 503,
    'NOT_FOUND': 404,

    // DNS errors
    'DNS_HOSTNAME_EMPTY': 502,
    'DNS_HOSTNAME_NOT_FOUND': 502,
    'DNS_HOSTNAME_RESOLVE_FAILED': 502,
    'DNS_HOSTNAME_RESOLVED_PRIVATE': 404,
    'DNS_HOSTNAME_SERVER_ERROR': 502,

    // Request errors
    'INVALID_REQUEST_METHOD': 405,
    'MALFORMED_REQUEST_HEADER': 400,
    'RANGE_END_NOT_VALID': 416,
    'RANGE_GROUP_NOT_VALID': 416,
    'RANGE_MISSING_UNIT': 416,
    'RANGE_START_NOT_VALID': 416,
    'RANGE_UNIT_NOT_SUPPORTED': 416,
    'REQUEST_HEADER_TOO_LARGE': 431,
    'RESOURCE_NOT_FOUND': 404,
    'TOO_MANY_RANGES': 416,
    'URL_TOO_LONG': 414,

    // Cache errors
    'FALLBACK_BODY_TOO_LARGE': 502,

    // Image errors
    'INVALID_IMAGE_OPTIMIZE_REQUEST': 400,
    'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED': 502,
    'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID': 502,
    'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED': 502,
    'OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS': 502,

    // Routing errors
    'ROUTER_CANNOT_MATCH': 502,
    'ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR': 502,
    'ROUTER_EXTERNAL_TARGET_ERROR': 502,
    'ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR': 502,
    'ROUTER_TOO_MANY_HAS_SELECTIONS': 502,
    'TOO_MANY_FILESYSTEM_CHECKS': 502,
    'TOO_MANY_FORKS': 502,

    // Sandbox errors
    'SANDBOX_NOT_FOUND': 404,
    'SANDBOX_NOT_LISTENING': 502,
    'SANDBOX_STOPPED': 410,

    // Runtime errors
    'INFINITE_LOOP_DETECTED': 508,
    'MIDDLEWARE_RUNTIME_DEPRECATED': 503,

    // Platform/Internal errors (all 500)
    'INTERNAL_CACHE_ERROR': 500,
    'INTERNAL_CACHE_KEY_TOO_LONG': 500,
    'INTERNAL_CACHE_LOCK_FULL': 500,
    'INTERNAL_CACHE_LOCK_TIMEOUT': 500,
    'INTERNAL_DEPLOYMENT_FETCH_FAILED': 500,
    'INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED': 500,
    'INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT': 500,
    'INTERNAL_FUNCTION_INVOCATION_FAILED': 500,
    'INTERNAL_FUNCTION_INVOCATION_TIMEOUT': 500,
    'INTERNAL_FUNCTION_NOT_FOUND': 500,
    'INTERNAL_FUNCTION_NOT_READY': 500,
    'INTERNAL_FUNCTION_SERVICE_UNAVAILABLE': 500,
    'INTERNAL_MICROFRONTENDS_BUILD_ERROR': 500,
    'INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR': 500,
    'INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR': 500,
    'INTERNAL_MISSING_RESPONSE_FROM_CACHE': 500,
    'INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED': 500,
    'INTERNAL_ROUTER_CANNOT_PARSE_PATH': 500,
    'INTERNAL_STATIC_REQUEST_FAILED': 500,
    'INTERNAL_UNARCHIVE_FAILED': 500,
    'INTERNAL_UNEXPECTED_ERROR': 500,
  };

  // Predefined error types
  static badRequest(message: string, details?: any) {
    return new AppError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflict(message: string, details?: any) {
    return new AppError(message, 409, 'CONFLICT', details);
  }

  static tooManyRequests(message: string = 'Too many requests') {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS');
  }

  static internal(message: string = 'Internal server error', details?: any) {
    return new AppError(message, 500, 'INTERNAL_ERROR', details, false);
  }

  // Vercel error helper
  static vercelError(code: string, message?: string, details?: any) {
    const statusCode = this.vercelErrorMap[code] || 500;
    const errorMessage = message || code.replace(/_/g, ' ').toLowerCase();
    const isOperational = !code.startsWith('INTERNAL_');
    return new AppError(errorMessage, statusCode, code, details, isOperational);
  }
}

