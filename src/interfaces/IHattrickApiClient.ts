import HattrickDataContainer from "../models/HattrickDataModel";
import OAuthAccessTokenRequest from "../models/oauth/OAuthAccessTokenRequest";
import OAuthAccessTokenResponse from "../models/oauth/OAuthAccessTokenResponse";
import OAuthCheckTokenResponse from "../models/oauth/OAuthCheckTokenResponse";
import OAuthRequestTokenResponse from "../models/oauth/OAuthRequestTokenResponse";
import { RegionDetailsConfig, RegionDetailsOutput } from "../models/regionDetails/RegionDetails_1.2";
import { SupportersConfig, SupportersOutput } from "../models/supporters";
import { MySupportersDataOutput_1_0, SupportedTeamsDataOutput_1_0 } from "../models/supporters/1.0/supporters_output_1.0";

export default interface IHattrickApiClient {
  getRequestToken(): Promise<OAuthRequestTokenResponse>;
  getAccessToken(config: OAuthAccessTokenRequest): Promise<OAuthAccessTokenResponse>;
  checkToken(): Promise<HattrickDataContainer<OAuthCheckTokenResponse>>;
  invalidateToken(): Promise<void>;
  getRegionDetails(input?: RegionDetailsConfig): Promise<HattrickDataContainer<RegionDetailsOutput>>
  // Version 1.0 of the Supporters API
  getSupporters(config?: { version: "1.0"; actionType: "supportedTeams" } & SupportersConfig): Promise<HattrickDataContainer<SupportedTeamsDataOutput_1_0>>
  getSupporters(config?: { version: "1.0"; actionType: "mysupporters" } & SupportersConfig): Promise<HattrickDataContainer<MySupportersDataOutput_1_0>>
  getSupporters(config?: SupportersConfig): Promise<HattrickDataContainer<SupportersOutput>>
}