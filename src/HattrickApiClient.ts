// import { OAuth } from "oauth";
// import readline from "readline";

// import { XMLParser } from "fast-xml-parser";

// const parser = new XMLParser({ ignoreDeclaration: true });

// const ConsumerKey = "8OLY975uW761989SmI8LFh"
// const ConsumerSecret = "c9HLQDQoHqLAhT2Qt84tHerBZLMoDWnJBYbVg8WnwYk"
// const RequestTokenPath = "https://chpp.hattrick.org/oauth/request_token.ashx"
// const AuthorizePath = "https://chpp.hattrick.org/oauth/authorize.aspx"
// const AuthenticatePath = "https://chpp.hattrick.org/oauth/authenticate.aspx"
// const AccessTokenPath = "https://chpp.hattrick.org/oauth/access_token.ashx"
// const CheckTokenPath = "https://chpp.hattrick.org/oauth/check_token.ashx"
// const InvalidateTokenPath = "https://chpp.hattrick.org/oauth/invalidate_token.ashx"

// const getAccessToken = (oauth_token: string, oauth_token_secret: string) => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   rl.question("Inserisci il PIN ricevuto dopo l'autorizzazione: ", function (oauth_verifier) {
//     oauth.getOAuthAccessToken(
//       oauth_token,
//       oauth_token_secret,
//       oauth_verifier,
//       function (err, access_token, access_token_secret, parsedQueryString) {
//         if (err) {
//           console.error("Errore nell'ottenere l'access token:", err);
//         } else {
//           console.log("Access Token:", access_token);
//           console.log("Access Token Secret:", access_token_secret);
//           console.log("Risultati:", parsedQueryString);
//         }
//         rl.close();
//       }
//     );
//   });
// }

// const oauth = new OAuth(
//   `${RequestTokenPath}`,
//   AccessTokenPath,
//   ConsumerKey,
//   ConsumerSecret,
//   '1.0A',
//   'oob', // This should be your callback URL
//   'HMAC-SHA1'
// );

// // oauth.getOAuthRequestToken({}, function (err, oauth_token, oauth_token_secret, oauth_callback_confirmed, parsedQueryString) {
// //   console.log("Error:", err);
// //   console.log("oauth_token:", oauth_token);
// //   console.log("oauth_token_secret:", oauth_token_secret);
// //   console.log("oauth_callback_confirmed:", oauth_callback_confirmed);
// //   console.log("Parsed Query String:", parsedQueryString);
// //   console.log("Authorize URL:", `${AuthorizePath}?oauth_token=${oauth_token}`);

// //   getAccessToken(oauth_token, oauth_token_secret);

// // })

// const oauth_access_token = "OvRVOr3pKqFAZ1B3"
// const oauth_access_token_secret = "dbDDSwpSOMWWlZnj"

// // oauth.get(
// //   'https://chpp.hattrick.org/chppxml.ashx?file=club&version=1.5',
// //   oauth_access_token, //test user token
// //   oauth_access_token_secret, //test user secret
// //   function (e, data, res) {
// //     if (e) console.error(e);
// //     console.log("Response Data:", data);

// //     const jObj = parser.parse(data);
// //     console.log("Parsed JSON Object:", jObj);
// //     // console.log("Response:", res);
// //   }); 

// oauth.get(
//   'https://chpp.hattrick.org/oauth/check_token.ashx',
//   oauth_access_token, //test user token
//   oauth_access_token_secret, //test user secret
//   function (e, data, res) {
//     if (e) console.error(e);
//     console.log("Response Data:", data);

//     const jObj = parser.parse(data as string);
//     console.log("Parsed JSON Object:", jObj);
//     // console.log("Response:", res);
//   }); 

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