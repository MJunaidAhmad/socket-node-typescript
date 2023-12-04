// Default Port
export const port = Number(process.env.PORT || "8080");

// Target logging level
export const logLevel = process.env.LOG_LEVEL || "debug";

export const OAuth2JwksUri = process.env.OAUTH2_JWKS_URI || "https://www.gstatic.com/iap/verify/public_key-jwk";

export const gcpProjectId = process.env.GCLOUD_PROJECT || "test";
