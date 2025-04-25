const marketView = {
    render: () => `
        <div class="market">
            <h1>Market</h1>
            <div class="last-update">Last updated: <span id="market-update-time">Never</span></div>
            <div id="market-content" class="market-content"></div>
        </div>
    `,
    updateContent: () => {
        const content = document.getElementById('market-content');
        const updateTime = document.getElementById('market-update-time');
        updateTime.textContent = new Date().toLocaleTimeString();
        const items = window.store.state.market;
        content.innerHTML = items.map(item => `
            <div class="item-card">
                <h3>${item.name}</h3>
                <p class="type">${item.type}</p>
                <p class="description">${item.description}</p>
                <p class="cost">${item.cost} gold</p>
            </div>
        `).join('');
    },
    afterRender: async () => {
        await window.store.fetchMarket();
        marketView.updateContent();
        window.store.subscribe(() => {
            marketView.updateContent();
        });
    }
};
