import { API } from '../services/api';

const API_URL = '/cliente'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os clientes
 * @returns {Promise}
 */
export const getCustomers = async () => {
  try {
    const response = await API.get(API_URL); // Rota correta na API
    return response.data; // Retorna [{ id, nome, email, telefone }]
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await API.post('cliente', customerData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    throw error;
  }
};

/**
 * Atualiza um cliente existente
 * @param {number} id
 * @param {Object} customer
 * @returns {Promise}
 */
export const updateCustomer = async (id, customer) => {
  try {
    const response = await API.put(`/cliente/${id}`, {
      nome: customer.nome,
      email: customer.email,
      telefone: customer.telefone,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar cliente:', error);
    throw error;
  }
};

/**
 * Exclui um cliente
 * @param {number} id
 * @returns {Promise}
 */
export const deleteCustomer = async (id) => {
  try {
    await API.delete(`/cliente/${id}`);
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
};

/**
 * Busca clientes paginados
 * @param {number} page Número da página
 * @param {number} size Quantidade por página
 * @returns {Promise}
 */
export const getCustomersPaginated = async (page, size) => {
  try {
    const response = await API.get(`/clientes?page=${page}&size=${size}`);
    return response.data; // Retorna [{ id, nome, email, telefone }]
  } catch (error) {
    console.error('Erro ao buscar clientes paginados:', error);
    throw error;
  }
};
