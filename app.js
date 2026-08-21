// ============ SISTEMA DE CONTROLE DE ESTOQUE ============

class InventarioApp {
    constructor() {
        this.equipamentos = this.loadData('equipamentos', []);
        this.locacoes = this.loadData('locacoes', []);
        this.manutencoes = this.loadData('manutencoes', []);
        this.historico = this.loadData('historico', []);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderDashboard();
        this.renderEquipamentos();
        this.updateLocacoesSelects();
    }

    // ============ Event Listeners ============

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Equipamentos
        document.getElementById('novoEquipBtn')?.addEventListener('click', () => 
            this.toggleForm('formEquipamento')
        );
        document.getElementById('formEquipamento')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarEquipamento();
        });

        // Locações
        document.getElementById('novaLocacaoBtn')?.addEventListener('click', () => 
            this.toggleForm('formLocacao')
        );
        document.getElementById('formLocacao')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarLocacao();
        });

        // Manutenção
        document.getElementById('novaManutencaoBtn')?.addEventListener('click', () => 
            this.toggleForm('formManutencao')
        );
        document.getElementById('formManutencao')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarManutencao();
        });

        // Histórico
        document.getElementById('exportarBtn')?.addEventListener('click', () => this.exportarCSV());
        document.getElementById('filtroHistorico')?.addEventListener('input', () => this.renderHistorico());
        document.getElementById('filtroTipo')?.addEventListener('change', () => this.renderHistorico());
    }

    // ============ Tab Navigation ============

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabName)?.classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'historico') this.renderHistorico();
        if (tabName === 'manutencao') this.renderManutencoes();
    }

    toggleForm(formId) {
        document.getElementById(formId)?.classList.toggle('hidden');
    }

    // ============ Equipamentos ============

    salvarEquipamento() {
        const equip = {
            id: Date.now(),
            nome: document.getElementById('equipNome').value,
            modelo: document.getElementById('equipModelo').value,
            serie: document.getElementById('equipSerie').value,
            quantidade: parseInt(document.getElementById('equipQuantidade').value),
            valor: parseFloat(document.getElementById('equipValor').value) || 0,
            descricao: document.getElementById('equipDescricao').value,
            criadoEm: new Date().toISOString()
        };

        this.equipamentos.push(equip);
        this.saveData('equipamentos', this.equipamentos);
        this.registrarHistorico('entrada', `Novo equipamento: ${equip.nome}`, equip.quantidade);
        
        document.getElementById('formEquipamento').reset();
        this.toggleForm('formEquipamento');
        this.renderEquipamentos();
        this.renderDashboard();
        this.updateLocacoesSelects();
    }

    renderEquipamentos() {
        const container = document.getElementById('equipamentosList');
        if (!container) return;

        container.innerHTML = '';

        if (this.equipamentos.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>Nenhum equipamento cadastrado</p></div>';
            return;
        }

        this.equipamentos.forEach(equip => {
            const disponivel = this.contarDisponivel(equip.id);
            const alugado = this.contarAlugado(equip.id);
            const manutencao = this.contarManutencao(equip.id);

            const card = document.createElement('div');
            card.className = 'equipamento-card';
            card.innerHTML = `
                <h3>${equip.nome}</h3>
                <div class="info"><strong>Modelo:</strong> ${equip.modelo || '-'}</div>
                <div class="info"><strong>Série:</strong> ${equip.serie || '-'}</div>
                <div class="info"><strong>Total:</strong> ${equip.quantidade} un</div>
                <div class="info"><strong>Valor/dia:</strong> R$ ${equip.valor.toFixed(2)}</div>
                
                <div class="status ${disponivel > 0 ? 'disponivel' : 'alugado'}">
                    ✅ Disponíveis: ${disponivel}
                </div>
                <div class="status alugado">
                    🚚 Alugados: ${alugado}
                </div>
                ${manutencao > 0 ? `<div class="status manutencao">🔧 Em Manutenção: ${manutencao}</div>` : ''}
                
                <p style="color: #999; font-size: 0.85em; margin-top: 10px;">${equip.descricao}</p>
                
                <div class="buttons">
                    <button class="btn btn-primary btn-small" onclick="app.editarEquipamento(${equip.id})">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="app.deletarEquipamento(${equip.id})">Deletar</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    deletarEquipamento(id) {
        if (confirm('Tem certeza que deseja deletar este equipamento?')) {
            this.equipamentos = this.equipamentos.filter(e => e.id !== id);
            this.saveData('equipamentos', this.equipamentos);
            this.renderEquipamentos();
            this.renderDashboard();
        }
    }

    editarEquipamento(id) {
        const equip = this.equipamentos.find(e => e.id === id);
        if (equip) {
            document.getElementById('equipNome').value = equip.nome;
            document.getElementById('equipModelo').value = equip.modelo;
            document.getElementById('equipSerie').value = equip.serie;
            document.getElementById('equipQuantidade').value = equip.quantidade;
            document.getElementById('equipValor').value = equip.valor;
            document.getElementById('equipDescricao').value = equip.descricao;
            this.toggleForm('formEquipamento');
        }
    }

    // ============ Locações ============

    salvarLocacao() {
        const equipId = parseInt(document.getElementById('locEquipamento').value);
        const equip = this.equipamentos.find(e => e.id === equipId);
        const quantidade = parseInt(document.getElementById('locQuantidade').value);
        const disponivel = this.contarDisponivel(equipId);

        if (quantidade > disponivel) {
            alert(`Apenas ${disponivel} unidades disponíveis!`);
            return;
        }

        const locacao = {
            id: Date.now(),
            equipamentoId: equipId,
            equipamentoNome: equip.nome,
            cliente: document.getElementById('locCliente').value,
            dataSaida: document.getElementById('locDataSaida').value,
            dataDevolucao: document.getElementById('locDataDevolucao').value,
            quantidade: quantidade,
            contato: document.getElementById('locContato').value,
            observacoes: document.getElementById('locObservacoes').value,
            status: 'ativo',
            criadoEm: new Date().toISOString()
        };

        this.locacoes.push(locacao);
        this.saveData('locacoes', this.locacoes);
        this.registrarHistorico('saida', `${equip.nome} alugado para ${locacao.cliente}`, quantidade);
        
        document.getElementById('formLocacao').reset();
        this.toggleForm('formLocacao');
        this.renderLocacoes();
        this.renderDashboard();
    }

    renderLocacoes() {
        const container = document.getElementById('locacoesAtivasList');
        if (!container) return;

        const ativas = this.locacoes.filter(l => l.status === 'ativo');
        container.innerHTML = '';

        if (ativas.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>Nenhuma locação ativa</p></div>';
            return;
        }

        ativas.forEach(locacao => {
            const item = document.createElement('div');
            item.className = 'locacao-item';
            item.innerHTML = `
                <div class="locacao-info">
                    <h4>${locacao.equipamentoNome}</h4>
                    <p><strong>Cliente:</strong> ${locacao.cliente}</p>
                    <p><strong>Contato:</strong> ${locacao.contato || '-'}</p>
                    <p><strong>Saída:</strong> ${new Date(locacao.dataSaida).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Previsão de devolução:</strong> ${new Date(locacao.dataDevolucao).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Quantidade:</strong> ${locacao.quantidade} un</p>
                    <p style="color: #999; font-size: 0.9em; margin-top: 8px;">${locacao.observacoes || '-'}</p>
                </div>
                <div class="locacao-status">
                    <button class="btn btn-success btn-small" onclick="app.devolverLocacao(${locacao.id})">✓ Devolver</button>
                    <button class="btn btn-primary btn-small" onclick="app.editarLocacao(${locacao.id})">Editar</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    devolverLocacao(id) {
        const locacao = this.locacoes.find(l => l.id === id);
        if (locacao) {
            locacao.status = 'devolvido';
            locacao.dataDevolvida = new Date().toISOString();
            this.saveData('locacoes', this.locacoes);
            this.registrarHistorico('devolucao', `${locacao.equipamentoNome} devolvido por ${locacao.cliente}`, locacao.quantidade);
            this.renderLocacoes();
            this.renderDashboard();
        }
    }

    editarLocacao(id) {
        const locacao = this.locacoes.find(l => l.id === id);
        if (locacao) {
            document.getElementById('locEquipamento').value = locacao.equipamentoId;
            document.getElementById('locCliente').value = locacao.cliente;
            document.getElementById('locDataSaida').value = locacao.dataSaida;
            document.getElementById('locDataDevolucao').value = locacao.dataDevolucao;
            document.getElementById('locQuantidade').value = locacao.quantidade;
            document.getElementById('locContato').value = locacao.contato;
            document.getElementById('locObservacoes').value = locacao.observacoes;
            this.toggleForm('formLocacao');
        }
    }

    // ============ Manutenção ============

    salvarManutencao() {
        const manutencao = {
            id: Date.now(),
            equipamentoId: parseInt(document.getElementById('manuEquipamento').value),
            equipamentoNome: this.equipamentos.find(e => e.id === parseInt(document.getElementById('manuEquipamento').value))?.nome,
            status: document.getElementById('manuStatus').value,
            data: document.getElementById('manuData').value,
            descricao: document.getElementById('manuDescricao').value,
            previsaoFim: document.getElementById('manuDataFim').value,
            criadoEm: new Date().toISOString()
        };

        this.manutencoes.push(manutencao);
        this.saveData('manutencoes', this.manutencoes);
        this.registrarHistorico('manutencao', `${manutencao.equipamentoNome} em ${manutencao.status}`, 1);
        
        document.getElementById('formManutencao').reset();
        this.toggleForm('formManutencao');
        this.renderManutencoes();
        this.renderDashboard();
    }

    renderManutencoes() {
        const container = document.getElementById('manutencaoList');
        if (!container) return;

        const ativas = this.manutencoes.filter(m => !m.concluida);
        container.innerHTML = '';

        if (ativas.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><p>Nenhuma manutenção pendente</p></div>';
            return;
        }

        ativas.forEach(manut => {
            const card = document.createElement('div');
            card.className = 'manutencao-card';
            card.innerHTML = `
                <h4>${manut.equipamentoNome}</h4>
                <p><strong>Status:</strong> <span class="manutencao-status ${manut.status}">${this.traduzirStatus(manut.status)}</span></p>
                <p><strong>Data:</strong> ${new Date(manut.data).toLocaleDateString('pt-BR')}</p>
                <p><strong>Descrição:</strong> ${manut.descricao}</p>
                ${manut.previsaoFim ? `<p><strong>Previsão:</strong> ${new Date(manut.previsaoFim).toLocaleDateString('pt-BR')}</p>` : ''}
                <button class="btn btn-success btn-small" style="margin-top: 10px;" onclick="app.concluirManutencao(${manut.id})">Concluir Manutenção</button>
            `;
            container.appendChild(card);
        });
    }

    concluirManutencao(id) {
        const manut = this.manutencoes.find(m => m.id === id);
        if (manut) {
            manut.concluida = true;
            manut.dataConclusao = new Date().toISOString();
            this.saveData('manutencoes', this.manutencoes);
            this.renderManutencoes();
            this.renderDashboard();
        }
    }

    traduzirStatus(status) {
        const map = {
            'manutencao': 'Em Manutenção',
            'danificado': 'Danificado',
            'reparo': 'Aguardando Reparo'
        };
        return map[status] || status;
    }

    // ============ Histórico ============

    registrarHistorico(tipo, descricao, quantidade) {
        const registro = {
            id: Date.now(),
            tipo,
            descricao,
            quantidade,
            data: new Date().toISOString()
        };
        this.historico.push(registro);
        this.saveData('historico', this.historico);
    }

    renderHistorico() {
        const container = document.getElementById('historicoList');
        if (!container) return;

        const filtro = document.getElementById('filtroHistorico')?.value.toLowerCase() || '';
        const tipo = document.getElementById('filtroTipo')?.value || '';

        let registros = this.historico.filter(h => {
            const matchTipo = !tipo || h.tipo === tipo;
            const matchFiltro = !filtro || h.descricao.toLowerCase().includes(filtro);
            return matchTipo && matchFiltro;
        });

        container.innerHTML = '<table class="historico-table"><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Quantidade</th></tr></thead><tbody>';

        registros.reverse().forEach(h => {
            container.innerHTML += `
                <tr>
                    <td>${new Date(h.data).toLocaleDateString('pt-BR')} ${new Date(h.data).toLocaleTimeString('pt-BR')}</td>
                    <td>${h.tipo}</td>
                    <td>${h.descricao}</td>
                    <td>${h.quantidade}</td>
                </tr>
            `;
        });

        container.innerHTML += '</tbody></table>';
    }

    exportarCSV() {
        let csv = 'Data,Tipo,Descrição,Quantidade\n';
        this.historico.forEach(h => {
            csv += `"${new Date(h.data).toLocaleDateString('pt-BR')}","${h.tipo}","${h.descricao}",${h.quantidade}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    // ============ Dashboard ============

    renderDashboard() {
        const total = this.equipamentos.reduce((sum, e) => sum + e.quantidade, 0);
        const disponivel = this.equipamentos.reduce((sum, e) => sum + this.contarDisponivel(e.id), 0);
        const alugado = this.locacoes.filter(l => l.status === 'ativo').reduce((sum, l) => sum + l.quantidade, 0);
        const manutencao = this.manutencoes.filter(m => !m.concluida).length;

        document.getElementById('totalEstoque').textContent = total;
        document.getElementById('disponivel').textContent = disponivel;
        document.getElementById('alugados').textContent = alugado;
        document.getElementById('manutencao-count').textContent = manutencao;

        this.renderUltimasLocacoes();
        this.renderAlertas();
    }

    renderUltimasLocacoes() {
        const container = document.getElementById('ultimasLocacoes');
        if (!container) return;

        const ativas = this.locacoes.filter(l => l.status === 'ativo').slice(-3);
        container.innerHTML = '';

        if (ativas.length === 0) {
            container.innerHTML = '<p style="color: #999;">Nenhuma locação ativa</p>';
            return;
        }

        ativas.forEach(l => {
            container.innerHTML += `
                <div class="locacao-item">
                    <div class="locacao-info">
                        <h4>${l.equipamentoNome}</h4>
                        <p><strong>Cliente:</strong> ${l.cliente}</p>
                        <p><strong>Devolução em:</strong> ${new Date(l.dataDevolucao).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            `;
        });
    }

    renderAlertas() {
        const container = document.getElementById('alertasDevorcao');
        if (!container) return;

        const hoje = new Date().setHours(0, 0, 0, 0);
        const alertas = this.locacoes.filter(l => {
            const devolucao = new Date(l.dataDevolucao).setHours(0, 0, 0, 0);
            return l.status === 'ativo' && devolucao <= hoje + 3 * 24 * 60 * 60 * 1000; // próximos 3 dias
        });

        container.innerHTML = '';

        if (alertas.length === 0) {
            container.innerHTML = '<p style="color: #999;">Nenhum alerta de devolução</p>';
            return;
        }

        alertas.forEach(a => {
            const devolucao = new Date(a.dataDevolucao);
            const vencido = devolucao < new Date();
            container.innerHTML += `
                <div class="alerta-devorcao ${vencido ? 'vencido' : ''}">
                    <strong>${vencido ? '⛔ VENCIDO' : '⚠️ PRÓXIMO DE VENCER'}</strong>
                    <p>${a.equipamentoNome} - Cliente: ${a.cliente}</p>
                    <p>Devolução: ${devolucao.toLocaleDateString('pt-BR')}</p>
                </div>
            `;
        });
    }

    // ============ Utilitários ============

    contarDisponivel(equipId) {
        const equip = this.equipamentos.find(e => e.id === equipId);
        if (!equip) return 0;
        const alugado = this.locacoes.filter(l => l.equipamentoId === equipId && l.status === 'ativo').reduce((sum, l) => sum + l.quantidade, 0);
        const manutencao = this.manutencoes.filter(m => m.equipamentoId === equipId && !m.concluida).length;
        return equip.quantidade - alugado - manutencao;
    }

    contarAlugado(equipId) {
        return this.locacoes.filter(l => l.equipamentoId === equipId && l.status === 'ativo').reduce((sum, l) => sum + l.quantidade, 0);
    }

    contarManutencao(equipId) {
        return this.manutencoes.filter(m => m.equipamentoId === equipId && !m.concluida).length;
    }

    updateLocacoesSelects() {
        const select = document.getElementById('locEquipamento');
        const selectManu = document.getElementById('manuEquipamento');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um equipamento...</option>';
        selectManu.innerHTML = '<option value="">Selecione um equipamento...</option>';

        this.equipamentos.forEach(e => {
            select.innerHTML += `<option value="${e.id}">${e.nome} (${this.contarDisponivel(e.id)} disponíveis)</option>`;
            selectManu.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
        });
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key, defaultValue) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }
}

// Inicialização
const app = new InventarioApp();
document.addEventListener('DOMContentLoaded', () => {
    app.renderDashboard();
});
