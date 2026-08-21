# Dashboard com Clima e Lista de Tarefas 🌤️✓

Uma aplicação web moderna e responsiva que combina um **Dashboard de Clima** com **Local Storage** e uma **Lista de Tarefas** interativa.

## 🎯 Recursos

### 📋 Lista de Tarefas
- ✅ Adicionar, editar e deletar tarefas
- 🔄 Marcar tarefas como concluídas
- 🎯 Filtrar por status (Todas, Ativas, Concluídas)
- 💾 **Persistência com Local Storage** - seus dados são salvos automaticamente no navegador
- 📊 Contador de tarefas pendentes
- 🧹 Limpar todas as tarefas concluídas

### 🌡️ Dashboard de Clima
- 📍 Detecção automática de localização (com permissão)
- 🔍 Busca de clima por cidade
- 📊 Informações detalhadas:
  - Temperatura atual
  - Sensação térmica
  - Umidade
  - Pressão
  - Velocidade do vento
  - Visibilidade
  - Cobertura de nuvens
- 📅 Previsão de 5 dias
- 🌈 Interface amigável e responsiva

## 🚀 Como Usar

### 1. **Configurar API de Clima** (Opcional)

Para ativar o Dashboard de Clima, você precisa obter uma chave API gratuita:

1. Acesse [OpenWeatherMap](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Copie sua API Key
4. No arquivo `app.js`, substitua a linha:
   ```javascript
   this.apiKey = 'COLOQUE_SUA_API_KEY_AQUI';
   ```
   pela sua chave real:
   ```javascript
   this.apiKey = 'sua_chave_api_aqui';
   ```

### 2. **Executar a Aplicação**

Simplesmente abra o arquivo `index.html` em um navegador moderno!

```bash
# Opção 1: Abrir diretamente
open index.html

# Opção 2: Com live server (recomendado)
npx live-server
```

## 📁 Estrutura do Projeto

```
projeto/
├── index.html      # Estrutura HTML da aplicação
├── styles.css      # Estilos CSS (responsivo)
├── app.js          # Lógica JavaScript (To-Do + Clima)
└── README.md       # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Gradientes, Flexbox, Grid
- **JavaScript (ES6+)** - Lógica e interatividade
- **LocalStorage API** - Persistência de dados
- **Fetch API** - Requisições para API de clima
- **OpenWeatherMap API** - Dados de clima em tempo real

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📞 Mobile

## 🎨 Recursos de Design

- Gradientes modernos
- Animações suaves
- Ícones emoji intuitivos
- Dark mode friendly
- Acessibilidade melhorada

## 💾 Local Storage

Todos os seus dados de tarefas são salvos automaticamente no navegador usando a API de Local Storage. Isso significa que:
- ✅ Suas tarefas persistem mesmo após fechar o navegador
- 🔒 Os dados são armazenados localmente no seu dispositivo
- 🚫 Os dados não são enviados para nenhum servidor
- 🧹 Você pode limpar os dados limpando o cache do navegador

## 🔧 Personalizações

### Alterar cores do tema
No arquivo `styles.css`, procure por:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Mudar cidade padrão
No arquivo `app.js`, encontre:
```javascript
this.fetchWeatherByCity('São Paulo');
```

### Adicionar mais funcionalidades
- Exportar/importar tarefas como CSV
- Integração com banco de dados
- Notificações de tarefas
- Sincronização em nuvem

## 🐛 Troubleshooting

### "Erro: Por favor, configure sua API Key"
- Você ainda não configurou a API Key do OpenWeatherMap
- O Dashboard de Clima não funcionará até isso ser feito
- As tarefas continuarão funcionando normalmente

### Tarefas desapareceram
- Verificar se o Local Storage foi limpo
- Abrir DevTools (F12) e verificar em Application > Local Storage

### Clima não carrega
- Verificar se a API Key é válida
- Verificar conexão com internet
- Verificar se OpenWeatherMap está acessível

## 📝 Licença

Este projeto é de código aberto e gratuito para uso pessoal e comercial.

## 🤝 Contribuições

Sinta-se livre para fazer fork, melhorar e enviar pull requests!

---

**Desenvolvido com ❤️ usando JavaScript puro**