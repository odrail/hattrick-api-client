import HattrickDataContainer from "./HattrickDataModel"

type ErrorResponseData = {
    Error: string
    ErrorCode: string
    ErrorGUID: string
    Server: string
    Request: string
    LineNumber: number
}

type ErrorResponse = HattrickDataContainer<ErrorResponseData>

export default ErrorResponse