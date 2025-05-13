// src/hooks/useItemLogic.jsx
import { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem } from '../../services/ItemService.js';
import { getCategories } from '../../services/CategoriaService.js';

export const useItemLogic = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [searchTerm, setSearchTerm] = useState('');

  // Carrega itens do backend
  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  // Carrega categorias do backend
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Cadastro de item – observe que antes de enviar, transformamos o campo "categorias" em "categoriasIds"
  const handleAddItem = async (newItem) => {
    try {
      const payload = { ...newItem, categoriasIds: newItem.categorias || [] };
      await addItem(payload);
      setNotification({ open: true, message: 'Item cadastrado com sucesso!', severity: 'success' });
      fetchItems();
    } catch (error) {
      console.error('Erro ao cadastrar item:', error);
      setNotification({ open: true, message: 'Erro ao cadastrar item', severity: 'error' });
    }
  };

  // Atualização de item
  const handleUpdateItem = async (updatedItem) => {
    try {
      const payload = { ...updatedItem, categoriasIds: updatedItem.categorias || [] };
      await updateItem(updatedItem.id, payload);
      setNotification({ open: true, message: 'Item atualizado com sucesso!', severity: 'success' });
      fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      setNotification({ open: true, message: 'Erro ao atualizar item', severity: 'error' });
    }
  };

  // Exclusão de item
  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setNotification({ open: true, message: 'Item removido com sucesso!', severity: 'success' });
      fetchItems();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      setNotification({ open: true, message: 'Erro ao remover item', severity: 'error' });
    }
  };

  // Atualiza o termo de busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtra os itens com base no termo de busca (nome e descrição)
  const filteredItems = items.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  return {
    items,
    categories,
    loadingItems,
    loadingCategories,
    notification,
    setNotification,
    searchTerm,
    handleSearchChange,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    filteredItems,
  };
};
