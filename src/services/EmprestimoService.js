// src/services/EmprestimoService.js
import { API } from '../services/api';

const API_URL = '/emprestimos'; // Ajuste conforme sua configuração de backend

/**
 * Cria um empréstimo de itens para um cliente
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
 * Obtém todos os empréstimos
 * @returns {Promise}
 */
export const getEmprestimos = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error);
    throw error;
  }
};

/**
 * Obtém um empréstimo pelo ID
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
 * Finaliza um empréstimo (muda o status, por exemplo, para "Devolvido")
 * @param {number} id
 * @param {Object} updateData - Dados para atualizar, por exemplo, { status: 'Devolvido' }
 * @returns {Promise}
 */
export const finalizeEmprestimo = async (id, updateData) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao finalizar empréstimo ID ${id}:`, error);
    throw error;
  }
};
