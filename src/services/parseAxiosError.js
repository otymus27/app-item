/**
 * Interpreta e formata mensagens de erro do Axios.
 * @param {any} error 
 * @returns {string}
 */
export const parseAxiosError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Erro desconhecido no servidor.';
  } else if (error.request) {
    return 'Servidor não respondeu. Verifique sua conexão.';
  } else {
    return 'Erro ao configurar requisição.';
  }
};