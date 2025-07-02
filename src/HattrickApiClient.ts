import { OAuth } from "oauth";
import { XMLParser } from "fast-xml-parser";

export enum Scope {

  MANAGE_CHALLENGES = "manage_challenges",
  SET_MATCH_ORDER = "set_matchorder",
  MANAGE_YOUTH_PLAYERS = "manage_youthplayers",
  SET_TRAINING = "set_training",
  PLACE_BID = "place_bid",
}

interface HattrickApiClientConfig {
  oauth_consumer_key: string;
  oauth_consumer_secret: string;
  oauth_access_token?: string;
  oauth_access_token_secret?: string;
  oauth_callback?: string; // Optional callback URL, default is "oob"
}

interface OAuthAccessTokenResponse {
  oauth_access_token: string;
  oauth_access_token_secret: string;
}

interface OAuthRequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_authorize_url: string;
}

interface OAuthAccessTokenRequest {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_verifier: string
}

interface OAuthCheckTokenResponseRaw {
  HattrickData: {
    FileName: string, //>check_token</FileName>
    Version: string, //>1.0</Version>
    UserID: string, //>14262221</UserID>
    FetchedDate: string, //>2025-07-01 13:06:39</FetchedDate>
    Token: string, //>4E7lEYyIhCPSninp</Token>
    Created: string, //>2025-06-27 17:53:00</Created>
    User: string, //>14262221</User>
    Expires: string, //>9999-12-31 23:59:59</Expires>
    ExtendedPermissions: string, //>manage_challenges,set_matchorder,manage_youthplayers,set_training,place_bid</ExtendedPermissions>
  }
}

interface OAuthCheckTokenResponse {
  HattrickData: {
    FileName: string, //>check_token</FileName>
    Version: string, //>1.0</Version>
    UserID: number, //>14262221</UserID>
    FetchedDate: Date, //>2025-07-01 13:06:39</FetchedDate>
    Token: string, //>4E7lEYyIhCPSninp</Token>
    Created: Date, //>2025-06-27 17:53:00</Created>
    User: number, //>14262221</User>
    Expires: Date, //>9999-12-31 23:59:59</Expires>
    ExtendedPermissions: Scope[], //>manage_challenges,set_matchorder,manage_youthplayers,set_training,place_bid</ExtendedPermissions>
  }
}

interface IHattrickApiClient {
  getRequestToken(): Promise<OAuthRequestTokenResponse>;
  getAccessToken(config: OAuthAccessTokenRequest): Promise<OAuthAccessTokenResponse>;
  checkToken(): Promise<OAuthCheckTokenResponse>;
  invalidateToken(): Promise<string>;
}


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
  async checkToken(): Promise<OAuthCheckTokenResponse> {
    const data = await this.callAuthenticatedAPI(HattrickApiClient.checkTokenPath);
    const parsedData = this.parser.parse(data as string) as OAuthCheckTokenResponseRaw;
    console.log("Parsed Data:", parsedData);
    return {
      HattrickData: {
        ...parsedData.HattrickData,
        UserID: parseInt(parsedData.HattrickData.UserID, 10),
        User: parseInt(parsedData.HattrickData.User, 10),
        FetchedDate: new Date(parsedData.HattrickData.FetchedDate),
        Created: new Date(parsedData.HattrickData.Created),
        Expires: new Date(parsedData.HattrickData.Expires),
        ExtendedPermissions: parsedData.HattrickData.ExtendedPermissions != "" ? parsedData.HattrickData.ExtendedPermissions.split(',').map((scope: string) => scope.trim() as Scope) : [],
      }
    };
  }

  invalidateToken(): Promise<string> {
    if (!this.oauth_access_token || !this.oauth_access_token_secret) {
      return Promise.reject(new Error("OAuth access token and secret are required to check the token."));
    }
    return this.callAuthenticatedAPI(HattrickApiClient.invalidateTokenPath)
  }

  private callAuthenticatedAPI(url: string): Promise<string> {
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
          return resolve(data as string);
        }
      );
    });
  }

}