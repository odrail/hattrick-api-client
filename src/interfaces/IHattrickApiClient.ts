import HattrickDataContainer from "../models/HattrickDataModel";
import OAuthAccessTokenRequest from "../models/oauth/OAuthAccessTokenRequest";
import OAuthAccessTokenResponse from "../models/oauth/OAuthAccessTokenResponse";
import OAuthCheckTokenResponse from "../models/oauth/OAuthCheckTokenResponse";
import OAuthRequestTokenResponse from "../models/oauth/OAuthRequestTokenResponse";
import { RegionDetailsConfig, RegionDetailsOutput } from "../models/regionDetails/RegionDetails_1.2";

export default interface IHattrickApiClient {
  getRequestToken(): Promise<OAuthRequestTokenResponse>;
  getAccessToken(config: OAuthAccessTokenRequest): Promise<OAuthAccessTokenResponse>;
  checkToken(): Promise<HattrickDataContainer<OAuthCheckTokenResponse>>;
  invalidateToken(): Promise<void>;
  getRegionDetails(input?: RegionDetailsConfig): Promise<HattrickDataContainer<RegionDetailsOutput>>
}