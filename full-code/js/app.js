if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
                let serviceWorker;
                if (registration.installing) {
                    serviceWorker = registration.installing;
                } else if (registration.waiting) {
                    serviceWorker = registration.waiting;
                } else if (registration.active) {
                    serviceWorker = registration.active;
                }
                if (serviceWorker) {
                    console.log(serviceWorker.state);
                    serviceWorker.addEventListener("statechange", (e) => {
                        console.log(e.target.state);
                    });
                }
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
} else {
    console.error("Service workers are not supported.");
}

document.addEventListener('DOMContentLoaded', () => {
    router.addRoute('home', homeView);
    router.addRoute('leaderboard', leaderboardView);
    router.addRoute('market', marketView);
    router.addRoute('404', {
        render: () => `
            <div class="error">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
            </div>
        `
    });
    router.handleRoute();
});


