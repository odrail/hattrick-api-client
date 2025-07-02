interface HattrickDataModel {
  FileName: string, //	The name of the file that your request was sent to.
  Version: string, //	The delivered version of the XML output.
  UserID: number, //	The logged on User's UserID (not to be confused with TeamID). If not logged on, it defaults to 0.
  FetchedDate: Date, //	Date and time when the XML file was fetched. Format is DateTime
}

export default interface HattrickDataContainer<T> {
  HattrickData: HattrickDataModel & T, //	The HattrickData element contains information about the file that was fetched.
}