export default interface CommonResponse {
  successOrNot: string;
  statusCode: string;
  result?: any;
  data?: any;
  header?: any;
  resultStatus?: string;
  paramsMap?: any;
  resultMessage?: any;
  resultData?: any;
  status?: number;
  message?: string;
  id_token?: string;
  HeaderCd?: string;
  HeaderMsg?: string;
  errorCode?: string;
  errorMessage?: string;
  TotalCount?: number;
  ItemCount?: number;
}

export class StatusCode {
  public static readonly BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR';
  public static readonly PARAMETER_VALUE_ERROR = 'PARAMETER_VALUE_ERROR';
  public static readonly MANDATORY_PARAM_ERROR = 'MANDATORY_PARAM_ERROR';

  public static readonly SUCCESS = 'SUCCESS';
  public static readonly FAIL = 'FAIL';
  public static readonly BLOCKED_USER = 'BLOCKED_USER';

  public static readonly NO_CONTENT = 'NO_CONTENT';
  public static readonly NOT_FOUND = 'NOT_FOUND';

  public static readonly WRONG_EMAIL_OR_PASSWORD = 'WRONG_EMAIL_OR_PASSWORD';
  public static readonly LOCK = 'lock';

  public static readonly SESSION_EXPIRED = 'SESSION_EXPIRED';
  public static readonly UNKNOWN_ERROR = 'UNKNOWN_ERROR';
  public static readonly DUPLICATED_KEY = 'DUPLICATED_KEY';
  public static readonly DOWNLOAD_SIZE_EXCEEDS = 'DOWNLOAD_SIZE_EXCEEDS';
}

export class UserStateCode {
  public static readonly INITIAL = 'initial';
  public static readonly NORMAL = 'normal';
  public static readonly DORMANT = 'dormant';
  public static readonly DELETE = 'delete';
  public static readonly LOCK = 'lock';
}
