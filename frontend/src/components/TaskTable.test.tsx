import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Task } from '../types/task';
import { TaskTable } from './TaskTable';

const task: Task = {
  id: 1,
  title: 'Escrever README',
  description: 'Seção de decisões',
  status: 'Pending',
  priority: 'High',
  dueDate: null,
  createdAt: '2026-10-13T10:00:00Z',
  updatedAt: '2026-10-13T10:00:00Z',
  completedAt: null,
};

function setup(overrides: Partial<Task> = {}, busy: number[] = []) {
  const current = { ...task, ...overrides };
  const handlers = { onEdit: vi.fn(), onDelete: vi.fn(), onStatusChange: vi.fn() };
  render(<TaskTable tasks={[current]} busyIds={new Set(busy)} {...handlers} />);
  return { current, ...handlers };
}

describe('TaskTable', () => {
  it('pendente: iniciar envia o status InProgress', async () => {
    const { current, onStatusChange } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar' }));

    expect(onStatusChange).toHaveBeenCalledWith(current, 'InProgress');
  });

  it('em andamento: concluir envia Done e há opção de voltar para pendente', async () => {
    const { current, onStatusChange } = setup({ status: 'InProgress' });

    await userEvent.click(screen.getByRole('button', { name: 'Concluir' }));

    expect(onStatusChange).toHaveBeenCalledWith(current, 'Done');
    expect(screen.getByRole('button', { name: 'Voltar para pendente' })).toBeInTheDocument();
  });

  it('concluída: título riscado e só a ação de reabrir', () => {
    setup({ status: 'Done' });

    expect(screen.getByText('Escrever README')).toHaveClass('line-through');
    expect(screen.getByRole('button', { name: 'Reabrir' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar' })).not.toBeInTheDocument();
  });

  it('desabilita os botões de status enquanto a tarefa está em requisição', () => {
    setup({}, [1]);

    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeDisabled();
  });

  it('editar e excluir chamam os callbacks da tarefa', async () => {
    const { current, onEdit, onDelete } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(onEdit).toHaveBeenCalledWith(current);
    expect(onDelete).toHaveBeenCalledWith(current);
  });
});