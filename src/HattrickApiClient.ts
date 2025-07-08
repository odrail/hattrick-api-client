import { OAuth } from "oauth";
import { XMLParser } from "fast-xml-parser";
import OAuthCheckTokenResponse from "./models/oauth/OAuthCheckTokenResponse";
import OAuthCheckTokenResponseRaw from "./models/oauth/OAuthCheckTokenResponseRaw";
import { Scope } from "./models/oauth/Scope";
import OAuthRequestTokenResponse from "./models/oauth/OAuthRequestTokenResponse";
import OAuthAccessTokenResponse from "./models/oauth/OAuthAccessTokenResponse";
import IHattrickApiClient from "./interfaces/IHattrickApiClient";
import OAuthAccessTokenRequest from "./models/oauth/OAuthAccessTokenRequest";
import HattrickApiClientConfig from "./interfaces/HattrickApiClientConfig";
import { defaultVersion, RegionDetailsConfig, RegionDetailsInput, RegionDetailsOutput } from "./models/regionDetails/RegionDetails_1.2";
import ErrorResponse from "./models/ErrorResponse";
import HattrickDataContainer from "./models/HattrickDataModel";

export default class HattrickApiClient implements IHattrickApiClient {
  private oauth: OAuth;
  private oauth_access_token?: string;
  private oauth_access_token_secret?: string;
  private oauth_callback: string = "oob";

  private static readonly requestTokenPath = "https://chpp.hattrick.org/oauth/request_token.ashx"
  private static readonly authorizePath = "https://chpp.hattrick.org/oauth/authorize.aspx"
  private static readonly authenticatePath = "https://chpp.hattrick.org/oauth/authenticate.aspx"
  private static readonly accessTokenPath = "https://chpp.hattrick.org/oauth/access_token.ashx"
  private static readonly checkTokenPath = "https://chpp.hattrick.org/oauth/check_token.ashx"
  private static readonly invalidateTokenPath = "https://chpp.hattrick.org/oauth/invalidate_token.ashx"
  private static readonly protectedPath = "https://chpp.hattrick.org/chppxml.ashx"
  private readonly parser = new XMLParser({ ignoreDeclaration: true, numberParseOptions: { hex: false, leadingZeros: false, skipLike: new RegExp(/\d+.\d+/) } });

  constructor(config: HattrickApiClientConfig) {
    this.oauth_access_token = config.oauth_access_token;
    this.oauth_access_token_secret = config.oauth_access_token_secret;
    this.oauth_callback = config.oauth_callback || this.oauth_callback;

    this.oauth = new OAuth(
      HattrickApiClient.requestTokenPath,
      HattrickApiClient.accessTokenPath,
      config.oauth_consumer_key,
      config.oauth_consumer_secret,
      '1.0A',
      config.oauth_callback || this.oauth_callback,
      'HMAC-SHA1'
    );
  }

  async getRequestToken(scopes: Scope[] = []): Promise<OAuthRequestTokenResponse> {
    return new Promise<OAuthRequestTokenResponse>((resolve, reject) => {
      this.oauth.getOAuthRequestToken((err,
        token,
        token_secret,
        parsedQueryString) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          oauth_token: token,
          oauth_token_secret: token_secret,
          oauth_authorize_url: `${HattrickApiClient.authorizePath}?oauth_token=${token}${scopes.length > 0 ? `&scope=${scopes.join(',')}` : ''}`
        });
      })
    })
  }
  getAccessToken(config: OAuthAccessTokenRequest): Promise<OAuthAccessTokenResponse> {
    return new Promise<OAuthAccessTokenResponse>((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        config.oauth_token,
        config.oauth_token_secret,
        config.oauth_verifier,
        (err, access_token, access_token_secret, parsedQueryString) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            oauth_access_token: access_token,
            oauth_access_token_secret: access_token_secret
          })
        }
      );
    })
  }
  async checkToken(): Promise<HattrickDataContainer<OAuthCheckTokenResponse>> {
    const parsedData = await this.callAuthenticatedAPI<OAuthCheckTokenResponse>(HattrickApiClient.checkTokenPath);
    console.log("Parsed Data:", parsedData);
    return parsedData
  }

  async invalidateToken(): Promise<void> {
    if (!this.oauth_access_token || !this.oauth_access_token_secret) {
      return Promise.reject(new Error("OAuth access token and secret are required to check the token."));
    }
    await this.callAuthenticatedAPI<unknown>(HattrickApiClient.invalidateTokenPath)
  }

  async getRegionDetails(config?: RegionDetailsConfig): Promise<HattrickDataContainer<RegionDetailsOutput>> {
    const input : RegionDetailsInput = {
      file: "regiondetails",
      version: config?.version || defaultVersion,
      regionID: config?.regionID,
    }

    const response = await this.callAuthenticatedAPI<RegionDetailsOutput>(`${HattrickApiClient.protectedPath}?${new URLSearchParams(input as any).toString()}`);
    return response
  }

  private callAuthenticatedAPI<T>(url: string): Promise<HattrickDataContainer<T>> {
    if (!this.oauth_access_token || !this.oauth_access_token_secret) {
      return Promise.reject(new Error("OAuth access token and secret are required to check the token."));
    }
    return new Promise((resolve, reject) => {
      this.oauth.get(
        url,
        this.oauth_access_token!,
        this.oauth_access_token_secret!,
        (err, data, res) => {
          if (err) {
            return reject(err);
          }
          const parsedData = this.parser.parse(data as string);

          if ((parsedData as ErrorResponse).HattrickData.Error) {
            return reject((parsedData as ErrorResponse));
          }
          const _parsedData: HattrickDataContainer<T> = {
            HattrickData: {
              ...parsedData.HattrickData,
              FileName: parsedData.HattrickData.FileName as string,
              Version: parsedData.HattrickData.Version as string,
              UserID: parseInt(parsedData.HattrickData.UserID as string, 10),
              FetchedDate: new Date(parsedData.HattrickData.FetchedDate as string)
            }
          }
          return resolve(_parsedData);
        }
      );
    });
  }

}