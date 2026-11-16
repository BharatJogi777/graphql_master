import { HealthController } from './health.controller';

describe('HealthController', () => {
  const queryRaw = jest.fn();
  const controller = new HealthController({ $queryRaw: queryRaw } as never);

  beforeEach(() => queryRaw.mockReset());

  it('reports liveness without touching the database', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('reports readiness after a successful database probe', async () => {
    queryRaw.mockResolvedValueOnce(1);
    await expect(controller.ready()).resolves.toEqual({
      status: 'ok',
      dependencies: { database: 'ok' },
    });
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('propagates database failure so readiness can fail', async () => {
    queryRaw.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(controller.ready()).rejects.toThrow('database unavailable');
  });
});
