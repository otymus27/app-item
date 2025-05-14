// src/pages/EmprestimoPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

import { getItems } from '../../services/ItemService.js';
import { createEmprestimo } from '../../services/EmprestimoService.js';
import { getCustomers } from '../../services/ClienteService.js';

const EmprestimoPage = () => {
    const navigate = useNavigate();

    const [clienteId, setClienteId] = useState('');
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [clientes, setClientes] = useState([]);

    const [todosItens, setTodosItens] = useState([]);
    const [itensDisponiveis, setItensDisponiveis] = useState([]);
    const [carregandoItens, setCarregandoItens] = useState(false);

    const [itensSelecionados, setItensSelecionados] = useState([]);
    const [emprestimoLoading, setEmprestimoLoading] = useState(false);
    const [notificacao, setNotificacao] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const buscarItens = async () => {
            setCarregandoItens(true);
            try {
                const data = await getItems();
                setTodosItens(data);
                const disponiveis = data.filter((item) => item.disponivel === true);
                setItensDisponiveis(disponiveis);
            } catch (error) {
                console.error('Erro ao carregar itens:', error);
                setNotificacao({
                    open: true,
                    message: 'Erro ao carregar itens.',
                    severity: 'error',
                });
            } finally {
                setCarregandoItens(false);
            }
        };

        const buscarClientes = async () => {
            try {
                const data = await getCustomers();
                setClientes(data);
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
                setNotificacao({
                    open: true,
                    message: 'Erro ao carregar clientes.',
                    severity: 'error',
                });
            }
        };

        buscarItens();
        buscarClientes();
    }, []);

    const handleCriarEmprestimo = async () => {
        if (!clienteSelecionado) {
            setNotificacao({
                open: true,
                message: 'Selecione um cliente.',
                severity: 'error',
            });
            return;
        }
        if (itensSelecionados.length === 0) {
            setNotificacao({
                open: true,
                message: 'Selecione pelo menos um item disponível.',
                severity: 'error',
            });
            return;
        }

        const dataEmprestimo = new Date();
        const status = 'Emprestado';

        const payload = {
            clienteId: clienteSelecionado.id,
            itemIds: itensSelecionados.map((item) => item.id),
            dataEmprestimo,
            status,
        };

        setEmprestimoLoading(true);
        try {
            const response = await createEmprestimo(payload);
            if (response) {
                setNotificacao({
                    open: true,
                    message: 'Empréstimo realizado com sucesso!',
                    severity: 'success',
                });
                setClienteSelecionado(null);
                setClienteId('');
                setItensSelecionados([]);
            } else {
                setNotificacao({
                    open: true,
                    message: 'Erro ao realizar empréstimo: Resposta Vazia',
                    severity: 'error',
                });
            }
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            let mensagemErro = 'Erro ao realizar empréstimo.';
            if (error.response?.data?.message) {
                mensagemErro += ` Detalhes: ${error.response.data.message}`;
            }
            setNotificacao({
                open: true,
                message: mensagemErro,
                severity: 'error',
            });
        } finally {
            setEmprestimoLoading(false);
        }
    };

    const handleFecharNotificacao = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotificacao((prev) => ({ ...prev, open: false }));
    };

    const handleIrParaHome = () => navigate('/home');

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <CustomHeader />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Button variant="outlined" startIcon={<Home />} onClick={handleIrParaHome}>
                        Início
                    </Button>
                    <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                        Empréstimo de Itens
                    </Typography>

                    {/* Autocomplete para seleção de cliente */}
                    <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => `${option.id} - ${option.nome}`}
                        value={clienteSelecionado}
                        onChange={(event, newValue) => {
                            setClienteSelecionado(newValue);
                            setClienteId(newValue?.id?.toString() || '');
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cliente"
                                placeholder="Selecione um cliente"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    {/* Autocomplete para seleção de itens disponíveis */}
                    {carregandoItens ? (
                        <CircularProgress sx={{ my: 2 }} />
                    ) : (
                        <Autocomplete
                            multiple
                            options={itensDisponiveis}
                            getOptionLabel={(option) => option.nome}
                            value={itensSelecionados}
                            onChange={(event, newValue) => setItensSelecionados(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Itens Disponíveis"
                                    placeholder="Selecione os itens"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        />
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCriarEmprestimo}
                        sx={{ mt: 2 }}
                        disabled={emprestimoLoading}
                    >
                        {emprestimoLoading ? <CircularProgress size={24} /> : 'Emprestar Itens'}
                    </Button>
                </Box>
                <Footer />
            </Box>

            <Snackbar
                open={notificacao.open}
                autoHideDuration={6000}
                onClose={handleFecharNotificacao}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleFecharNotificacao} severity={notificacao.severity} sx={{ width: '100%' }}>
                    {notificacao.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmprestimoPage;
