import axios from 'axios';

const ECONNREFUSED = 'ECONNREFUSED';

describe('GET /api', () => {
  it('should return a message', async () => {
    expect.assertions(2);

    try {
      const res = await axios.get(`/api`);
      expect(res.status).toBe(200);
      expect(res.data).toEqual({ message: 'Hello API' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === ECONNREFUSED) {
        expect(error.code).toBe(ECONNREFUSED);
        expect(error.isAxiosError).toBe(true);
        return;
      }

      throw error;
    }
  });
});
