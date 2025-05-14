import { API } from '../services/api';

const API_URL = '/emprestimos';
const API_URL1 = '/emprestimos/paginado';

/**
 * Cria um empréstimo de itens para um cliente.
 * @param {Object} emprestimoData - { clientId, items, emprestimoDate, status }
 * @returns {Promise}
 */
export const createEmprestimo = async (emprestimoData) => {
  try {
    const response = await API.post(API_URL, emprestimoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    throw error;
  }
};

/**
 * Obtém todos os empréstimos (sem paginação).
 * @returns {Promise}
 */
export const getAllEmprestimos = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os empréstimos:', error);
    throw error;
  }
};

/**
 * Obtém empréstimos com filtros e paginação.
 * @param {Object} params - { page, size, status, clienteId, etc. }
 * @returns {Promise}
 */
export const getEmprestimos = async (params) => {
  try {
    const response = await API.get(API_URL1, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar empréstimos com filtros:', error);
    throw error;
  }
};

/**
 * Obtém um empréstimo pelo ID.
 * @param {number} id
 * @returns {Promise}
 */
export const getEmprestimoById = async (id) => {
  try {
    const response = await API.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar empréstimo ID ${id}:`, error);
    throw error;
  }
};

/**
 * Atualiza um empréstimo (ex: alteração de status).
 * @param {number} id
 * @param {Object} updateData - { status: 'DEVOLVIDO' }
 * @returns {Promise}
 */
export const finalizeEmprestimo = async (id, updateData) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar empréstimo ID ${id}:`, error);
    throw error;
  }
};

/**
 * Finaliza diretamente um empréstimo pelo ID (endpoint específico).
 * @param {number} id
 * @returns {Promise}
 */
export const finalizarEmprestimoById = async (id) => {
  try {
    const response = await API.put(`${API_URL}/${id}/devolver`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao finalizar empréstimo ID ${id}:`, error);
    throw error;
  }
};
