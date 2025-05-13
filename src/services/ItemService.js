import { API } from '../services/api';

const API_URL = '/item'; // Ajuste conforme sua configuração de backend

/**
 * Busca todos os itens
 * @returns {Promise}
 * Retorna [{ id, nome, descricao, qrCode, categorias, disponivel }]
 */
export const getItems = async () => {
  try {
    const response = await API.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};

/**
 * Adiciona um item
 * @param {Object} itemData
 * @returns {Promise}
 */
export const addItem = async (itemData) => {
  try {
    const response = await API.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
};

/**
 * Atualiza um item existente
 * @param {number} id
 * @param {Object} item
 * @returns {Promise}
 * Atualiza com os dados: { nome, descricao, qrCode, categorias, disponivel }
 */
export const updateItem = async (id, item) => {
  try {
    // Garanta que o campo de categorias seja um array (mesmo vazio) e envie com a chave "categoriasIds"
    const payload = {
      nome: item.nome,
      descricao: item.descricao,
      qrCode: item.qrCode, // Certifique-se de que está usando "qrCode" conforme o backend espera
      categoriasIds: item.categorias || [], // Se não houver categorias, envia um array vazio
      disponivel: item.disponivel,
    };
    const response = await API.put(`/item/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar item:', error);
    throw error;
  }
};

/**
 * Exclui um item
 * @param {number} id
 * @returns {Promise}
 */
export const deleteItem = async (id) => {
  try {
    await API.delete(`/item/${id}`);
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    throw error;
  }
};

/**
 * Busca itens paginados
 * @param {number} page Número da página
 * @param {number} size Quantidade por página
 * @returns {Promise}
 * Retorna [{ id, nome, descricao, qrCode, categorias, disponivel }]
 */
export const getItemsPaginated = async (page, size) => {
  try {
    const response = await API.get(`/items?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens paginados:', error);
    throw error;
  }
};
