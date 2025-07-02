import HattrickDataRawContainer from "../HattrickDataRaw";

type OAuthCheckTokenDataRaw = {
    Token: string, //>4E7lEYyIhCPSninp</Token>
    Created: string, //>2025-06-27 17:53:00</Created>
    User: string, //>14262221</User>
    Expires: string, //>9999-12-31 23:59:59</Expires>
    ExtendedPermissions: string, //>manage_challenges,set_matchorder,manage_youthplayers,set_training,place_bid</ExtendedPermissions>
}

type OAuthCheckTokenResponseRaw = HattrickDataRawContainer<OAuthCheckTokenDataRaw>;

export default OAuthCheckTokenResponseRaw;