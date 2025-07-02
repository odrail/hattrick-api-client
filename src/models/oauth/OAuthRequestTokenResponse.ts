export default interface OAuthRequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_authorize_url: string;
}