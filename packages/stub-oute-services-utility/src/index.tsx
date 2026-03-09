class Utility {
  constructor(_config?: any) {}
  refreshToken(_payload?: any) { return Promise.resolve({}); }
  logout(_payload?: any) { return Promise.resolve({}); }
  getAssetAccessInfo(_payload?: any) { return Promise.resolve({ result: {} }); }
}

export default Utility;
