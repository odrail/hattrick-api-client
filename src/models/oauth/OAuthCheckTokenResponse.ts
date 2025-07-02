import { Scope } from "../..";
import HattrickDataContainer from "../HattrickDataModel";

type OAuthCheckTokenData = {
    Token: string, //>4E7lEYyIhCPSninp</Token>
    Created: Date, //>2025-06-27 17:53:00</Created>
    User: number, //>14262221</User>
    Expires: Date, //>9999-12-31 23:59:59</Expires>
    ExtendedPermissions: Scope[], //>manage_challenges,set_matchorder,manage_youthplayers,set_training,place_bid</ExtendedPermissions>
}

type OAuthCheckTokenResponse = HattrickDataContainer<OAuthCheckTokenData>;

export default OAuthCheckTokenResponse;