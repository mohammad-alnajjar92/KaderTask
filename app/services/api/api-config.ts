// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")
// Or just specify it directly like this:
import { Platform } from "react-native";
import deviceInfo from 'react-native-device-info';

// const stagingBaseUrl = 'https://staging.api.repzo.me';
const masterBaseUrl = 'https://api.repzo.me';
export const salesVanBaseUrl = 'https://sv.api.repzo.me';
//  export const salesVanBaseUrl = 'https://staging.sv.api.repzo.me';
 export const ssoBaseUrl = 'https://sso.api.repzo.me';
//  export const ssoBaseUrl = 'https://staging.sso.api.repzo.me'

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number


  // commonHeaders: {
  //   'x-api-version': string,
  //   'x-platform': string,
  //   'x-version-name': string
  // }

}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url:masterBaseUrl,
  timeout: 120000,
  // commonHeaders: {
  //   'x-api-version': '3.4.x',
  //   'x-platform': Platform.OS,
  //   'x-version-name': ''
  // }
}

export const getDefaultApiConfig = async (): Promise<ApiConfig> => {
  return {
    url:masterBaseUrl,
    timeout: 120000,
    // commonHeaders: {
    //   'x-api-version': '3.4.x',
    //   'x-platform': Platform.OS,
    //   'x-version-name': await deviceInfo.getReadableVersion(),
    // }
  }
}
