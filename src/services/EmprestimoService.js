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
    if (error.response) {
      console.error('Erro ao criar empréstimo:', error.response.data); // <-- aqui está o detalhe
    } else {
      console.error('Erro desconhecido:', error);
    }
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

//metodo para filtragem de emprestimos por status e data
export async function getEmprestimosFiltrados(filtros) {
  try {
    // Monta query params dinamicamente
    const params = {};
    if (filtros.status && filtros.status !== 'TODOS') {
      params.status = filtros.status;
    }
    if (filtros.dataInicio) {
      params.dataInicio = filtros.dataInicio;
    }
    if (filtros.dataFim) {
      params.dataFim = filtros.dataFim;
    }

    const response = await API.get(`${API_URL}/relatorio`, { params });
    return response.data; // Espera um array de empréstimos conforme seu DTO
  } catch (error) {
    console.error('Erro ao buscar empréstimos filtrados:', error);
    return [];
  }
}
