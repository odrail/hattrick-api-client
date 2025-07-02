export default interface OAuthAccessTokenRequest {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_verifier: string
}