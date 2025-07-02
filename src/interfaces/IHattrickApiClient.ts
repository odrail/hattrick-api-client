import OAuthAccessTokenRequest from "../models/oauth/OAuthAccessTokenRequest";
import OAuthAccessTokenResponse from "../models/oauth/OAuthAccessTokenResponse";
import OAuthCheckTokenResponse from "../models/oauth/OAuthCheckTokenResponse";
import OAuthRequestTokenResponse from "../models/oauth/OAuthRequestTokenResponse";

export default interface IHattrickApiClient {
  getRequestToken(): Promise<OAuthRequestTokenResponse>;
  getAccessToken(config: OAuthAccessTokenRequest): Promise<OAuthAccessTokenResponse>;
  checkToken(): Promise<OAuthCheckTokenResponse>;
  invalidateToken(): Promise<string>;
}