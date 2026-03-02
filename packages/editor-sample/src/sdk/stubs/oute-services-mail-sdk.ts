class Email {
  constructor(_config: any = {}) {}

  async save(payload: any): Promise<any> {
    throw new Error('Mail SDK not configured. Please use a real backend API.');
  }

  async findOne(payload: any): Promise<any> {
    throw new Error('Mail SDK not configured. Please use a real backend API.');
  }
}

export default Email;
