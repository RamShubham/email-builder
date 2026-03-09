class UserPhotos {
  constructor(_config?: any) {}
  getList(_payload?: any) { return Promise.resolve({ result: { docs: [], has_next_page: false } }); }
  upload(_payload?: any) { return Promise.resolve({ status: 'success', result: {} }); }
  delete(_payload?: any) { return Promise.resolve({ status: 'success', result: {} }); }
}

export default UserPhotos;
