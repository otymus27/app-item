import { API } from '../services/api';

const API_URL = '/categoria'; // Ajuste conforme sua configuração de backend

/**
 * Busca todas as categorias
 * @returns {Promise}
 */
export const getCategories = async () => {
  try {
    const response = await API.get(API_URL); // Rota correta na API para categorias
    return response.data; // Retorna [{ id, nome }]
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await API.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

/**
 * Atualiza uma categoria existente
 * @param {number} id
 * @param {Object} category
 * @returns {Promise}
 */
export const updateCategory = async (id, category) => {
  try {
    const response = await API.put(`${API_URL}/${id}`, {
      nome: category.nome,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar categoria:', error);
    throw error;
  }
};

/**
 * Exclui uma categoria
 * @param {number} id
 * @returns {Promise}
 */
export const deleteCategory = async (id) => {
  try {
    await API.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    throw error;
  }
};

/**
 * Busca categorias paginadas
 * @param {number} page Número da página
 * @param {number} size Quantidade por página
 * @returns {Promise}
 */
export const getCategoriesPaginated = async (page, size) => {
  try {
    const response = await API.get(`/categorias?page=${page}&size=${size}`);
    return response.data; // Retorna [{ id, nome }]
  } catch (error) {
    console.error('Erro ao buscar categorias paginadas:', error);
    throw error;
  }
};
