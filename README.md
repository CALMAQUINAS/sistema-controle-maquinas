# 🏭 Sistema de Controle de Estoque - Locação de Máquinas e Equipamentos

Um sistema web completo e moderno para gerenciar o inventário, locações, manutenção e histórico de máquinas e equipamentos para aluguel.

## 🎯 Funcionalidades Principais

### 📊 Dashboard
- **Estatísticas em tempo real:**
  - Total de equipamentos em estoque
  - Quantidade disponível para aluguel
  - Equipamentos atualmente alugados
  - Equipamentos em manutenção

- **Últimas locações ativas**
- **Alertas de devolução** (próximos 3 dias ou vencidos)

### 🔧 Gerenciar Equipamentos
- ✅ Cadastrar novo equipamento com:
  - Nome, modelo e série/código
  - Quantidade em estoque
  - Valor da diária
  - Descrição detalhada
  
- 📊 Visualizar status de cada equipamento:
  - Total em estoque
  - Quantidade disponível
  - Quantidade alugada
  - Quantidade em manutenção

- ✏️ Editar e deletar equipamentos

### 📦 Registrar Locações
- 📋 Criar nova locação com:
  - Equipamento selecionado
  - Nome do cliente
  - Data de saída
  - Previsão de devolução
  - Quantidade alugada
  - Telefone/contato do cliente
  - Observações

- 📍 Visualizar todas as locações ativas
- ✓ Registrar devoluções
- ✏️ Editar locações

### 📜 Histórico de Movimentações
- 📅 Registro completo de todas as operações:
  - Entradas de equipamentos
  - Saídas (locações)
  - Devoluções
  - Manutenções

- 🔍 Filtrar por:
  - Palavra-chave (equipamento, cliente)
  - Tipo de operação

- 📥 Exportar em CSV para análise

### 🔨 Controle de Manutenção
- 📌 Registrar equipamentos em:
  - Manutenção
  - Danificados
  - Aguardando reparo

- 📅 Data de entrada em manutenção
- 📅 Previsão de disponibilidade
- 📝 Descrição do problema
- ✓ Marcar como concluído

## 🚀 Como Usar

### 1. Abrir a Aplicação
Simplesmente abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Safari, Edge).

```bash
# Opção 1: Abrir diretamente
open index.html

# Opção 2: Com live server (recomendado para desenvolvimento)
npx live-server
```

### 2. Cadastrar Equipamentos
1. Clique em **🔧 Equipamentos**
2. Clique em **+ Novo Equipamento**
3. Preencha os dados:
   - Nome (obrigatório)
   - Modelo
   - Série/Código
   - Quantidade total (obrigatório)
   - Valor da diária
   - Descrição
4. Clique em **Salvar**

### 3. Registrar Locação
1. Clique em **📦 Locações**
2. Clique em **+ Nova Locação**
3. Selecione o equipamento
4. Preencha os dados:
   - Cliente (obrigatório)
   - Data de saída (obrigatório)
   - Previsão de devolução (obrigatório)
   - Quantidade (obrigatório)
   - Telefone/contato
   - Observações
5. Clique em **Registrar Locação**

### 4. Registrar Devoluções
1. Clique em **📦 Locações**
2. Encontre a locação ativa
3. Clique em **✓ Devolver**
4. A locação será movida para histórico

### 5. Gerenciar Manutenção
1. Clique em **🔨 Manutenção**
2. Clique em **+ Registrar Manutenção**
3. Selecione o equipamento
4. Escolha o status (Em Manutenção, Danificado, Aguardando Reparo)
5. Digite a descrição do problema
6. Defina a previsão de disponibilidade
7. Clique em **Registrar**

### 6. Consultar Histórico
1. Clique em **📜 Histórico**
2. Use os filtros para encontrar registros específicos
3. Clique em **📥 Exportar CSV** para baixar os dados

## 📁 Estrutura do Projeto

```
sistema-controle-maquinas/
├── index.html      # Estrutura HTML completa
├── styles.css      # Estilos responsivos e modernos
├── app.js          # Lógica da aplicação (classe InventarioApp)
├── README.md       # Este arquivo
└── .gitignore      # Arquivos ignorados pelo Git
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Gradientes, Flexbox, Grid, animações
- **JavaScript (ES6+)** - Programação orientada a objetos
- **LocalStorage API** - Persistência de dados no navegador
- **Responsive Design** - Funciona em todos os dispositivos

## 💾 Armazenamento de Dados

Todos os dados são salvos automaticamente no **LocalStorage** do navegador:

### Dados Armazenados
```javascript
// Equipamentos cadastrados
equipamentos: [
  {
    id: timestamp,
    nome: "string",
    modelo: "string",
    serie: "string",
    quantidade: number,
    valor: number,
    descricao: "string",
    criadoEm: "ISO date"
  }
]

// Locações ativas e concluídas
locacoes: [
  {
    id: timestamp,
    equipamentoId: number,
    equipamentoNome: "string",
    cliente: "string",
    dataSaida: "YYYY-MM-DD",
    dataDevolucao: "YYYY-MM-DD",
    quantidade: number,
    contato: "string",
    observacoes: "string",
    status: "ativo|devolvido",
    criadoEm: "ISO date"
  }
]

// Manutenções
manutencoes: [
  {
    id: timestamp,
    equipamentoId: number,
    equipamentoNome: "string",
    status: "manutencao|danificado|reparo",
    data: "YYYY-MM-DD",
    descricao: "string",
    previsaoFim: "YYYY-MM-DD",
    concluida: boolean,
    criadoEm: "ISO date"
  }
]

// Histórico de movimentações
historico: [
  {
    id: timestamp,
    tipo: "entrada|saida|devolucao|manutencao",
    descricao: "string",
    quantidade: number,
    data: "ISO date"
  }
]
```

## 🔐 Segurança

- ✅ Dados salvos localmente (não são enviados para servidores)
- ✅ Sem necessidade de login ou senha
- ✅ Validação de quantidade disponível antes de locação
- ✅ Proteção contra exclusão acidental com confirmação

## 📱 Responsividade

A aplicação funciona perfeitamente em:
- 💻 Desktops (1200px+)
- 🖥️ Tablets (768px - 1199px)
- 📱 Smartphones (até 767px)

## 🎨 Design e UX

- **Interface limpa e intuitiva**
- **Cores significativas:**
  - Verde: Disponível
  - Laranja: Alugado
  - Vermelho: Manutenção/Problema
  - Azul: Primário (ações)

- **Animações suaves** para melhor experiência
- **Feedback visual** em todas as ações

## 🚀 Recursos Avançados

### Validações Inteligentes
- Impede aluguel de mais equipamentos do que disponível
- Alerta quando data de devolução é próxima
- Marca equipamentos vencidos em vermelho

### Relatórios
- Exportar histórico em CSV
- Filtros por equipamento, cliente e tipo de operação
- Dashboard com resumo executivo

### Gerenciamento Eficiente
- Edição de locações ativas
- Histórico completo de cada equipamento
- Rastreabilidade total de movimentações

## 🐛 Troubleshooting

### Dados desapareceram
- Verifique se limpou o cache/storage do navegador
- Abra DevTools (F12) → Application → Local Storage
- Procure por `equipamentos`, `locacoes`, `manutencoes`, `historico`

### Equipamento não aparece na seleção
- Certifique-se de que o equipamento foi salvo com sucesso
- Recarregue a página (F5)

### Não consigo devolver uma locação
- Verifique se a locação está com status "ativo"
- Pode ser que já tenha sido devolvida

### Dados não salvam
- Verifique se o LocalStorage está habilitado no navegador
- Tente usar outro navegador
- Verifique o espaço disponível no disco

## 📊 Casos de Uso

### Locadora de Equipamentos
- Gerenciar frota de máquinas
- Rastrear locações por cliente
- Controlar manutenções preventivas

### Construção Civil
- Acompanhar ferramentas e máquinas
- Identificar equipamentos em uso
- Registrar danos e manutenções

### Eventos e Audiovisual
- Controlar equipamentos de som/luz
- Rastrear empréstimos para eventos
- Gerenciar devoluções pontuais

### Oficinas e Serviços
- Organizar estoque de ferramentas
- Rastrear empréstimos internos
- Controlar manutenção de equipamentos

## 🔄 Fluxo de Operação

```
1. CADASTRO DE EQUIPAMENTO
   ↓
2. EQUIPAMENTO DISPONÍVEL PARA ALUGUEL
   ↓
3. CLIENTE ALUGA O EQUIPAMENTO
   ↓
4. EQUIPAMENTO SALDO REDUZIDO (ALUGADO)
   ↓
5. CLIENTE DEVOLVE O EQUIPAMENTO
   ↓
6. EQUIPAMENTO VOLTA AO ESTOQUE
   ↓
7. REGISTRO SALVO NO HISTÓRICO
```

## 📝 Exemplo de Workflow

**Cenário: Locadora de Escavadeiras**

1. **Cadastrar Escavadeira**
   - Nome: Escavadeira Cat 320
   - Modelo: 320D
   - Série: ABC123456
   - Quantidade: 3 unidades
   - Valor/dia: R$ 1.200,00

2. **Cliente solicita aluguel**
   - Equipamento: Escavadeira Cat 320
   - Cliente: Empresa Construtora XYZ
   - Saída: 25/08/2026
   - Devolução: 31/08/2026
   - Quantidade: 1 unidade
   - Valor total: R$ 7.200,00 (6 dias × R$ 1.200)

3. **Dashboard atualiza**
   - Total: 3 escavadeiras
   - Disponível: 2 escavadeiras
   - Alugado: 1 escavadeira

4. **Cliente devolve**
   - Clica em "Devolver"
   - Sistema registra devolução no histórico
   - Escavadeira volta como disponível

## 💡 Dicas de Uso

- Use a coluna **Série/Código** para rastrear equipamentos específicos
- Mantenha o campo **Observações** nas locações para notas importantes
- Verifique **Alertas de Devolução** diariamente
- Exporte o histórico mensalmente para auditoria
- Use **Status** em manutenção para equipamentos fora de operação

## 🔮 Futuras Melhorias

- 📱 Aplicativo mobile nativo
- 🔐 Sistema de login e multi-usuário
- 💳 Integração com sistema de pagamento
- 📊 Relatórios mais avançados com gráficos
- 🌐 Sincronização em nuvem
- 📧 Notificações por email
- 📞 Sistema de lembretes de devolução

## 📄 Licença

Este projeto é de código aberto e gratuito para uso pessoal e comercial.

## 🤝 Contribuições

Sinta-se livre para fazer fork, melhorar e enviar pull requests!

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o Troubleshooting acima
2. Abra uma issue no GitHub
3. Entre em contato com o desenvolvedor

---

**Desenvolvido com ❤️ usando JavaScript Puro**

**Última atualização: Agosto 2026**
