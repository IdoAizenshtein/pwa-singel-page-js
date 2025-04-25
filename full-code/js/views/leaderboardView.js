// js/views/leaderboardView.js
const leaderboardView = {
    render: () => `
        <div class="leaderboard">
            <h1>Leaderboard</h1>
            <div class="last-update">Last updated: <span id="leaderboard-update-time">Never</span></div>
            <div id="leaderboard-content" class="leaderboard-content"></div>
        </div>
    `,

    updateContent: () => {
        const content = document.getElementById('leaderboard-content');
        const updateTime = document.getElementById('leaderboard-update-time');
        updateTime.textContent = new Date().toLocaleTimeString();
        const players = window.store.state.leaderboard;
        content.innerHTML = players.map(player => `
            <div class="player-row">
                <div class="rank">#${player.rank}</div>
                <div class="username">${player.username}</div>
                <div class="level">Level ${player.level}</div>
                <div class="xp">XP: ${player.xp}</div>
                <div class="gold">Gold: ${player.gold}</div>
            </div>
        `).join('');
    },

    afterRender: async () => {
        await window.store.fetchLeaderboard();
        leaderboardView.updateContent();

        // Subscribe to store updates
        window.store.subscribe(() => {
            leaderboardView.updateContent();
        });

    }
};