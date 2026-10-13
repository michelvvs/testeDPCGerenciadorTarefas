import { AxiosError, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './http';

function httpError(status: number, data: unknown) {
  return new AxiosError('falhou', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    data,
  } as AxiosResponse);
}

describe('getErrorMessage', () => {
  it('usa o "detail" do ProblemDetails', () => {
    expect(getErrorMessage(httpError(404, { detail: 'Tarefa 1 não encontrada.' })))
      .toBe('Tarefa 1 não encontrada.');
  });

  it('junta as mensagens de validação por campo', () => {
    const error = httpError(400, { errors: { Title: ['Título obrigatório.'], Password: ['Senha curta.'] } });
    expect(getErrorMessage(error)).toBe('Título obrigatório. Senha curta.');
  });

  it('informa falha de conexão quando não há resposta do servidor', () => {
    expect(getErrorMessage(new AxiosError('Network Error'))).toBe('Não foi possível conectar ao servidor.');
  });

  it('devolve mensagem genérica para erros desconhecidos', () => {
    expect(getErrorMessage(new Error('x'))).toBe('Ocorreu um erro inesperado.');
  });
});