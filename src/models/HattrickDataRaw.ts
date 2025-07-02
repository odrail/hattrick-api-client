interface HattrickDataRaw {
  FileName: string, //	The name of the file that your request was sent to.
  Version: string, //	The delivered version of the XML output.
  UserID: string, //	The logged on User's UserID (not to be confused with TeamID). If not logged on, it defaults to 0.
  FetchedDate: string, //	Date and time when the XML file was fetched. Format is DateTime
}

export default interface HattrickDataRawContainer<T> {
  HattrickData: HattrickDataRaw & T, //	The HattrickData element contains information about the file that was fetched.
}