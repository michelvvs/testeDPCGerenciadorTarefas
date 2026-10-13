import { describe, expect, it } from 'vitest';
import { STATUS_ACTIONS, STATUSES } from './constants';

describe('STATUS_ACTIONS', () => {
  it('define ao menos uma ação para cada status', () => {
    for (const status of STATUSES) {
      expect(STATUS_ACTIONS[status].length).toBeGreaterThan(0);
    }
  });

  it('nunca oferece ação que leve ao próprio status', () => {
    for (const status of STATUSES) {
      expect(STATUS_ACTIONS[status].every((a) => a.target !== status)).toBe(true);
    }
  });

  it('uma tarefa concluída só pode ser reaberta (voltar a Pending)', () => {
    expect(STATUS_ACTIONS.Done.map((a) => a.target)).toEqual(['Pending']);
  });
});