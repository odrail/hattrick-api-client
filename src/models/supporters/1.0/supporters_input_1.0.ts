type File = "supporters";
type Version = "1.0";
type ActionType = "supportedTeams" | "mysupporters";
export const defaultVersion: Version = "1.0";

export const defaultActionType: ActionType = "supportedTeams";

export interface SupportersBaseInput {
  file: File,
  version?: Version
  actionType: ActionType
  pageIndex?: number
  pageSize?: number
}

export interface SupportedTeamInput extends SupportersBaseInput {
  actionType: "supportedTeams",
  userId?: number
}

export interface MySupportersInput extends SupportersBaseInput {
  actionType: "mysupporters",
  teamId?: number
}

export type SupportersInput_1_0 = SupportedTeamInput | MySupportersInput;