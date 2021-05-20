// import { create, ApisauceInstance } from 'apisauce';
// import { getDefaultApiConfig } from './api-config';
// import { getUserData, generateUUID, logoutUserBecauseExpiredToken } from '../../utils/general';
// import { Platform } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// // import { ErrorLogger } from '../../utils/errorLogger';

// /**
//  * a .ts file that contains interceptors
//  */

// /**
// * constants
 
// * CURRENT_USER_ID is a constant that is known and understandable to interceptor
//   request interceptor should replace this with user id
// */
// export const CURRENT_USER_ID = 'CURRENT_USER_ID';

// /**
//  * interceptor functions helpers
//  */


// const addHeadersToRequest = async (requestHeaders: any): Promise<Object> => {
//   try {

//     //constants
//     // const userRole = await helpers.preferencesHelper.getUserRole();

//     // let user;
//     // if (userRole == 'user') {
//     //   user = await helpers.user.getUser();
//     // }
//     // else {
//     //   user = await helpers.adminHelper.getAdmin();
//     // }

//     /**
//      * get current request headers
//      * combine common headers with requeat headers
//      * retuns combination of headers request and common headers
//      */
//     const versionName = await DeviceInfo.getReadableVersion();
//     // const codePushVersionLabel = codepushVersion == null ? '' : ` - ${codepushVersion.label}`;
//     const commonHeaders = {
//       // 'X-Version-Name': `${versionName}${codePushVersionLabel}`,
//       // 'X-Platform': `${userRole == 'user' ? '' : 'admin-'}${Platform.OS}`,
//       'x-api-version': '3.4',
//       'x-ruuid': generateUUID(),
//       // 'Authorization': user.access_token,
//       // 'user_role': userRole,
//       'device_id': await DeviceInfo.getDeviceId(),
//       'device_unique_id': await DeviceInfo.getUniqueId()
//     };

//     const newCombinationOfHeaders = Object.assign(requestHeaders, commonHeaders);

//     return newCombinationOfHeaders;
//   }
//   catch (error) {
//     console.log('error in addHeadersToRequest', error);
//     return {};
//   }
// }


// class Api {

//   api: ApisauceInstance
//   offlineApi: ApisauceInstance
//   isConnected: boolean

//   constructor() {

//     //create instance
//     getDefaultApiConfig().then(defaultConfig => {
//       this.api = create({
//         baseURL: defaultConfig.url,
//         timeout: defaultConfig.timeout,
//         headers: defaultConfig.commonHeaders
//       });
//       this.configureApi(this.api);

//       this.offlineApi = create({
//         baseURL: defaultConfig.url,
//         timeout: 2000,
//         headers: defaultConfig.commonHeaders
//       });
//       this.configureApi(this.offlineApi);
//       this.isConnected = false;
//     })
//       .catch(error => { });
//   }

//   configureApi = (api: ApisauceInstance) => {

//     /**
//     * request interceptor to add some things
//     * and make any edition in request before send
//     */
//     api.axiosInstance.interceptors.request.use(async (request: any) => {

//       //constnats
//       const requestUrl: string = request.url;
//       const requestHeaders: string = request.headers;
//       const requestMethod: string = request.method.toLowerCase();
//       const requestBody: any = request.data;

//       /**
//        * here at the begging of axios request interceptor,
//        * should store some of 'POST' request.
       
//        * in future maybe store some of 'PUT' requests also,
//        * but now store only 'POST' request.
//        */
//       if (requestMethod == 'post') {

//         /**
//          * not all of 'POST' requests, should be stored.
         
//          * if thisRequestShouldBeStored returns null, that means request
//          * should not be stored 
//          */
//         const requestType = detectIfRequestShouldBeStored(requestUrl);

//         if (requestType != null) {

//           /**
//            * prepare request object to realm
//            * 
//            * here in request interceptor, add request to unsynced request realm.
//            * and in response interceptor, delete request if success
//            */
//           const requestToRealm: UnSynced = {
//             sync_id: requestBody.sync_id,
//             payload: JSON.stringify(requestBody),

//             /**
//              * currently always will be post, but at the future maybe
//              * put or other.
//              */
//             method: 'POST',
//             type: requestType,
//             url: requestUrl,
//             time: parseInt(requestBody.time)
//           };

//           /**
//            * add request to realm
//            */
//           try { await helpers.unSynced.addUnsyncedRequest(requestToRealm); }
//           catch (error) {
//             console.log('error when add request to realm', error);
//           }
//         }
//       }

//       /**
//        * '/api/v2/upload-image' is an api
//        * that recieves base64 iamge and returns img url
//        * deaing with this api has a differant bit
//        * so to nake easiesr should be handle alone
//        * and habe no 'CURRENT_USER_ID' to reolace it
//        * so after handle it will return
//        */
//       if (requestUrl.includes("upload-image")) {
//         try { request["headers"] = await addUploadImageHeadersToRequest(requestHeaders); }
//         catch{ request["headers"] = {}; }
//         return request;
//       }

//       /**
//        * another apis will be handled with same headers
//        */
//       //add headers to request
//       try { request["headers"] = await addHeadersToRequest(requestHeaders); }
//       catch{ request["headers"] = {} }

//       //replace user id to request url
//       try { request["url"] = await addUserIdToRequest(requestUrl); }
//       catch{ request["url"] = CURRENT_USER_ID }

//       //return edited request
//       return request;
//     });

//     /**
//   * A function that gets a headers to reauth to user or admin
//   */
//     const getHeadersToReauth = (userRole: UserRole, refreshToken: string, namespace: string): any => {
//       try {

//         //for user 'deafult'
//         let headers = {
//           'x-name-space': namespace,
//           'refresh_token': refreshToken,
//           'user-platform': userRole == 'admin' ? `${Platform.OS}-admin` : Platform.OS
//         };

//         return headers;
//       }
//       catch (error) {
//         console.log('error in getHeadersToReauth', error);
//         return error;
//       }
//     };

//     /**
//      * response interceptors to edit request and retry
//      * such as reauthintication
//      */
//     api.axiosInstance.interceptors.response.use(function (value) {
//       helpers.unSynced.removeUnsyncedRequest(value.data.sync_id);
//       return value;
//     }, async function (err) {
//       try {


//         const response = err.response;
//         const editedRequest = err.config;

//         const userHelper = helpers.user;
//         const adminHelper = helpers.adminHelper;

//         const currentUser: UserCollection | any = await userHelper.getUser();
//         const currentAdmin = await helpers.adminHelper.getAdmin();
//         const userRoleFromRealm: UserRole = await helpers.preferencesHelper.getUserRole();

//         const namespace = userRoleFromRealm == 'admin' ? currentAdmin.namespace : currentUser.namespace;
//         const refreshToken = userRoleFromRealm == 'admin' ? currentAdmin.refresh_token : currentUser.refresh_token;

//         //get headers for reauth api
//         const headers = getHeadersToReauth(userRoleFromRealm, refreshToken, namespace);

//         if (response.status === 401 && namespace.length > 0 && refreshToken.length > 0) {

//           const repEndPoint = '/api/v2/rep/identity/reauthenticate';
//           const adminEndPoint = '/api/v2/admin/identity/reauthenticate';
//           const reauthEndpoint = userRoleFromRealm == 'user' ? repEndPoint : adminEndPoint;
//           const res = await fetch(`${api.getBaseURL()}${reauthEndpoint}`, { method: 'GET', headers });

//           if (res.ok) {

//             const data = await res.json();

//             //update access token to rep or admin
//             if (userRoleFromRealm == 'admin') {
//               await adminHelper.updateAdminProp('access_token', data.access_token);
//             }
//             else if (userRoleFromRealm == 'user') {
//               await userHelper.addOrUpdateUserData({
//                 'access_token': data.access_token
//               });
//             }

//             //edit current request and re-request
//             editedRequest.headers['Authorization'] = data.access_token;
//             await api.axiosInstance.request(editedRequest);
//           } else {
//             logoutUserBecauseExpiredToken(userRoleFromRealm);
//           }
//         }
//       } catch (error) {
//         return error;
//       }
//     });
//   }

//   get = (): ApisauceInstance => {
//     if (this.isConnected) {
//       return this.api;
//     } else {
//       return this.offlineApi;
//     }
//   }

//   setIsConnected = (isConnected: boolean) => {
//     this.isConnected = isConnected;
//   }
// }

// const apiInstance = new Api();

// //export apisauce with transform
// export const apisauce = apiInstance;