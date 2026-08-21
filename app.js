// ============ TO-DO LIST ============

class TodoApp {
    constructor() {
        this.tasks = this.loadFromLocalStorage();
        this.currentFilter = 'todos';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCompleted());

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();

        if (!text) {
            alert('Por favor, digite uma tarefa!');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveToLocalStorage();
        input.value = '';
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'ativas':
                return this.tasks.filter(t => !t.completed);
            case 'concluidas':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const taskList = document.getElementById('taskList');
        const filtered = this.getFilteredTasks();

        taskList.innerHTML = '';

        if (filtered.length === 0) {
            taskList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">Nenhuma tarefa encontrada</li>';
        } else {
            filtered.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <button class="delete-btn">Deletar</button>
                `;

                li.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
                li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));

                taskList.appendChild(li);
            });
        }

        this.updateStats();
    }

    updateStats() {
        const pending = this.tasks.filter(t => !t.completed).length;
        document.getElementById('taskCount').textContent = 
            `${pending} ${pending === 1 ? 'tarefa' : 'tarefas'} pendente${pending !== 1 ? 's' : ''}`;
    }

    clearCompleted() {
        if (this.tasks.filter(t => t.completed).length === 0) {
            alert('Nenhuma tarefa concluída para deletar!');
            return;
        }
        if (confirm('Tem certeza que deseja deletar todas as tarefas concluídas?')) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============ WEATHER DASHBOARD ============

class WeatherApp {
    constructor() {
        this.apiKey = 'COLOQUE_SUA_API_KEY_AQUI';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.getLocationWeather();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('weatherSearchBtn');
        const searchInput = document.getElementById('citySearch');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchCity());
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchCity();
            });
        }
    }

    getLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherByCoords(latitude, longitude);
                },
                () => {
                    this.fetchWeatherByCity('São Paulo');
                }
            );
        } else {
            this.fetchWeatherByCity('São Paulo');
        }
    }

    searchCity() {
        const city = document.getElementById('citySearch').value.trim();
        if (city) {
            this.fetchWeatherByCity(city);
        }
    }

    fetchWeatherByCity(city) {
        if (!this.apiKey || this.apiKey === 'COLOQUE_SUA_API_KEY_AQUI') {
            this.showError('Por favor, configure sua API Key do OpenWeatherMap no arquivo app.js');
            return;
        }

        this.showLoading();

        const url = `${this.baseUrl}/weather?q=${city}&units=metric&lang=pt_br&appid=${this.apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Cidade não encontrada');
                return response.json();
            })
            .then(data => {
                this.fetchForecast(data.coord.lat, data.coord.lon);
                this.displayCurrentWeather(data);
            })
            .catch(error => this.showError('Erro: ' + error.message));
    }

    fetchWeatherByCoords(lat, lon) {
        if (!this.apiKey || this.apiKey === 'COLOQUE_SUA_API_KEY_AQUI') {
            this.showError('Por favor, configure sua API Key do OpenWeatherMap no arquivo app.js');
            return;
        }

        this.showLoading();

        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.fetchForecast(data.coord.lat, data.coord.lon);
                this.displayCurrentWeather(data);
            })
            .catch(error => this.showError('Erro: ' + error.message));
    }

    fetchForecast(lat, lon) {
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => this.displayForecast(data))
            .catch(error => console.error('Erro ao buscar previsão:', error));
    }

    displayCurrentWeather(data) {
        const container = document.getElementById('currentWeatherContainer');
        if (!container) return;

        const temp = Math.round(data.main.temp);
        const icon = this.getWeatherIcon(data.weather[0].main);

        container.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <div class="weather-icon">${icon}</div>
            <div class="temp-display">${temp}°C</div>
            <p style="font-size: 1.2em; text-transform: capitalize;">${data.weather[0].description}</p>
            
            <div class="weather-details">
                <div class="detail-item">
                    <p>Sensação Térmica</p>
                    <strong>${Math.round(data.main.feels_like)}°C</strong>
                </div>
                <div class="detail-item">
                    <p>Umidade</p>
                    <strong>${data.main.humidity}%</strong>
                </div>
                <div class="detail-item">
                    <p>Pressão</p>
                    <strong>${data.main.pressure} hPa</strong>
                </div>
                <div class="detail-item">
                    <p>Vento</p>
                    <strong>${Math.round(data.wind.speed * 3.6)} km/h</strong>
                </div>
                <div class="detail-item">
                    <p>Visibilidade</p>
                    <strong>${(data.visibility / 1000).toFixed(1)} km</strong>
                </div>
                <div class="detail-item">
                    <p>Cobertura de Nuvens</p>
                    <strong>${data.clouds.all}%</strong>
                </div>
            </div>
        `;
    }

    displayForecast(data) {
        const container = document.getElementById('forecastContainer');
        if (!container) return;

        const forecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

        let html = '<h3>Previsão dos Próximos Dias</h3><div class="forecast-grid">';

        forecasts.forEach(forecast => {
            const temp = Math.round(forecast.main.temp);
            const icon = this.getWeatherIcon(forecast.weather[0].main);
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('pt-BR', { weekday: 'short' });

            html += `
                <div class="forecast-card">
                    <h4>${day}</h4>
                    <div class="icon">${icon}</div>
                    <div class="temp">${temp}°C</div>
                    <div class="description">${forecast.weather[0].main}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    getWeatherIcon(description) {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '💨',
            'Haze': '🌫️',
            'Dust': '🌪️',
            'Fog': '🌫️',
            'Sand': '🌪️',
            'Ash': '💨',
            'Squall': '💨',
            'Tornado': '🌪️'
        };
        return iconMap[description] || '🌡️';
    }

    showLoading() {
        const container = document.getElementById('currentWeatherContainer');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <p>Carregando clima...</p>
                    <div class="spinner"></div>
                </div>
            `;
        }
    }

    showError(message) {
        const container = document.getElementById('currentWeatherContainer');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`;
        }
    }
}

// ============ INICIALIZAÇÃO ============

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
    new WeatherApp();
});