class Email {
  constructor(_config?: any) {}
  save(_payload?: any) { return Promise.resolve({ status: 'success', result: {} }); }
  findOne(_payload?: any) { return Promise.resolve({ status: 'success', result: {} }); }
}

export default Email;
