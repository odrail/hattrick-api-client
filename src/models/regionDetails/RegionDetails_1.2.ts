import { WeatherID } from "../dataTypes/WeatherId";

type Version = "1.2";

export const defaultVersion: Version = "1.2";

type File = "regiondetails";

export interface RegionDetailsInput {
  file: File,
  version? : Version
  regionID? : number
}

export type RegionDetailsConfig = Omit<RegionDetailsInput, "file">

type RegionDatilsDataOutput_1_2 = {
  League: {
    LeagueID: number,
    LeagueName: string,
    Region: {
      RegionID: number,
      RegionName: string,
      NumberOfUsers: number,
      NumberOfOnline: number,
      WeatherID: WeatherID,
      TomorrowWeatherID: WeatherID,
    }
  }
}

export type RegionDetailsOutput_1_2 = RegionDatilsDataOutput_1_2;
export type RegionDetailsOutput = RegionDetailsOutput_1_2;