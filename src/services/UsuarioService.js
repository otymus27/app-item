import { API } from '../services/api';

/**
 * Busca todos os usuários.
 * Retorna um array com objetos usuário.
 * Cada usuário possui, por exemplo: { id, login, roles }.
 */
export const getUsuarios = async () => {
  try {
    const response = await API.get('/usuarios');
    return response.data; // Ex.: [{ id, login, roles }, ...]
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

/**
 * Busca usuários de forma paginada.
 * @param {number} page - Número da página (normalmente começando em 0 ou 1, conforme seu backend).
 * @param {number} size - Quantidade de registros por página.
 * Retorna um objeto com a estrutura: { content, totalPages, totalElements }.
 */
export const getUsuariosPaginated = async (page, size) => {
  try {
    const response = await API.get(`/usuarios?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários paginados:', error);
    throw error;
  }
};

/**
 * Adiciona um novo usuário.
 * O objeto "usuario" deve conter as propriedades necessárias, por exemplo:
 * { login: 'fulano', roles: [{ id: 1, nome: 'ADMIN' }] }
 */
export const addUsuario = async (usuario) => {
  try {
    const response = await API.post('/usuarios', usuario);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
};

/**
 * Atualiza um usuário existente.
 * @param {number} id - ID do usuário que será atualizado.
 * @param {Object} usuario - Objeto com os dados atualizados do usuário.
 */
export const updateUsuario = async (id, usuario) => {
  try {
    const response = await API.put(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    throw error;
  }
};

/**
 * Exclui um usuário.
 * @param {number} id - ID do usuário a ser excluído.
 */
export const deleteUsuario = async (id) => {
  try {
    await API.delete(`/usuarios/${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};
