export type MySupportersDataOutput_1_0 = {
  MySupporters: {
    TotalItems: number,
    SupporterTeam?: [{
      UserId: number
      LoginName: string
      TeamId: number
      TeamName: string
      LeagueID: number
      LeagueName: string
      LeagueLevelUnitID: number
      LeagueLevelUnitName: string
    }]
  }
}

export type SupportedTeamsDataOutput_1_0 = {
  SupportedTeams: {
    TotalItems: number,
    SupportedTeam?: [{
      UserId: number
      LoginName: string
      TeamId: number
      TeamName: string
      LeagueID: number
      LeagueName: string
      LeagueLevelUnitName: string
      LastMatch: {
        LastMatchId: number
        LastMatchDate: Date
        LastMatchHomeTeamId: number
        LastMatchHomeTeamName: string
        LastMatchHomeGoals: number
        LastMatchAwayTeamId: number
        LastMatchAwayTeamName: string
        LastMatchAwayGoals: number
      }
      NextMatch: {
        NextMatchId: number
        NextMatchDate: Date
        NextMatchHomeTeamId: number
        NextMatchHomeTeamName: string
        NextMatchAwayTeamId: number
        NextMatchAwayTeamName: string
      }
      PressAnnouncement: {
        PressAnnouncementSendDate: Date
        PressAnnouncementSubject: string
        PressAnnouncementBody: string
      }
    }]
  }
}

export type SupportersOutput_1_0 = MySupportersDataOutput_1_0 | SupportedTeamsDataOutput_1_0;