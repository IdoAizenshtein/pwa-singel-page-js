class Store {
    constructor() {
        this.state = {
            leaderboard: [],
            market: [],
            isOffline: !navigator.onLine,
            lastUpdate: null
        };
        this.listeners = new Set();
        this.pollingIntervals = {};
        window.addEventListener('online', () => {
            this.setOfflineStatus(false);
            this.startPolling();
        });
        window.addEventListener('offline', () => {
            this.setOfflineStatus(true);
            this.stopPolling();
        });
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    clearListeners() {
        this.listeners.clear();
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setOfflineStatus(status) {
        this.state.isOffline = status;
        this.notify();
        document.getElementById('offline-banner').classList.toggle('hidden', !status);
    }

    startPolling() {
        // Poll leaderboard every 5 seconds
        this.pollingIntervals.leaderboard = setInterval(() => {
            this.fetchLeaderboard();
        }, 5000);

        // Poll market every 10 seconds
        this.pollingIntervals.market = setInterval(() => {
            this.fetchMarket();
        }, 10000);
    }

    stopPolling() {
        Object.values(this.pollingIntervals).forEach(interval => {
            clearInterval(interval);
        });
        this.pollingIntervals = {};
    }

    async initializeAndStartPolling() {
        await Promise.all([
            this.fetchLeaderboard(),
            this.fetchMarket()
        ]);
        if (navigator.onLine) {
            this.startPolling();
        }
    }

    async fetchLeaderboard() {
        try {
            const response = await fetch('https://api-game.bloque.app/game/leaderboard');
            const data = await response.json();
            this.state.leaderboard = data.players;
            this.state.lastUpdate = new Date().toLocaleTimeString();
            localStorage.setItem('leaderboard', JSON.stringify(data.players));
            this.notify();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            const cached = localStorage.getItem('leaderboard');
            if (cached) {
                this.state.leaderboard = JSON.parse(cached);
                this.notify();
            }
        }
    }

    async fetchMarket() {
        try {
            const response = await fetch('https://api-game.bloque.app/game/market');
            const data = await response.json();
            this.state.market = data.items;
            this.state.lastUpdate = new Date().toLocaleTimeString();
            localStorage.setItem('market', JSON.stringify(data.items));
            this.notify();
        } catch (error) {
            console.error('Error fetching market:', error);
            const cached = localStorage.getItem('market');
            if (cached) {
                this.state.market = JSON.parse(cached);
                this.notify();
            }
        }
    }
}

window.store = new Store();
window.store.initializeAndStartPolling();