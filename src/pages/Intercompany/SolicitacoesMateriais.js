import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';


const SolicitacoesMateriais = ({ cartItems = [] }) => {
    const [tickets, setTickets] = useState([]);
    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [isAtividadesOpen, setIsAtividadesOpen] = useState(false);

    useEffect(() => {
        let newTickets = cartItems.length > 0 ? cartItems : [{
            abertura: new Date().toLocaleString(),
            nome: 'Produto Exemplo',
            email: 'example@example.com',
            fase: 'Em Aberto',
            responsavel: 'João Silva',
            hub: 'HUB Central',
            unidade: 'Unidade A',
        }];

        setTickets(newTickets);
    }, [cartItems]);

    const renderTickets = () => {
        return tickets.map((ticket, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{ticket.abertura}</td>
                <td>{ticket.nome}</td>
                <td>{ticket.email}</td>
                <td>{ticket.fase}</td>
                <td>{ticket.responsavel}</td>
                <td>{ticket.hub}</td>
                <td>{ticket.unidade}</td>
            </tr>
        ));
    };

    const toggleHistorico = () => setIsHistoricoOpen(!isHistoricoOpen);
    const toggleAtividades = () => setIsAtividadesOpen(!isAtividadesOpen);

    return (
        <div className="container-solicitacoes">
            <table className="tabela-tickets">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Abertura</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Fase</th>
                        <th>Responsável</th>
                        <th>HUB</th>
                        <th>Unidade</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length > 0 ? renderTickets() : (
                        <tr>
                            <td colSpan="8">Nenhum registro encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="accordion" id="accordion-historico">
                <h4 onClick={toggleHistorico} className={isHistoricoOpen ? 'active' : ''}>
                    Histórico de Aprovações dos Materiais
                    {isHistoricoOpen ? <FaChevronUp /> : <FaChevronDown />}
                </h4>
                {isHistoricoOpen && (
                    <div className="accordion-content active">
                        <table className="tabela-historico">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Item</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Executor</th>
                                    <th>Motivo da Recusa</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>000000000010008796</td>
                                    <td>AGULHA DESC. 25 X 12 REF. CF019-001</td>
                                    <td>10</td>
                                    <td>90.00</td>
                                    <td>900.00</td>
                                    <td>Pendente</td>
                                    <td>Solicitante</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="accordion" id="accordion-atividades">
                <h4 onClick={toggleAtividades} className={isAtividadesOpen ? 'active' : ''}>
                    Atividades
                    {isAtividadesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </h4>
                {isAtividadesOpen && (
                    <div className="accordion-content active">
                        <p>Aqui vai o histórico de atividades realizadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitacoesMateriais;
