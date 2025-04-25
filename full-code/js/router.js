class Router {
    constructor() {
        this.routes = {};
        window.addEventListener('popstate', () => this.handleRoute());

        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.dataset.route;
                this.navigateTo(route);
            }
        });
    }

    addRoute(path, view) {
        this.routes[path] = view;
    }

    navigateTo(route) {
        const url = route === 'home' ? '/' : `/${route}`;
        window.history.pushState({}, '', url);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const route = path === '/' ? 'home' : path.slice(1);
        const view = this.routes[route] || this.routes['404'];

        window.store.clearListeners();
        document.getElementById('app').innerHTML = view.render();
        if (view.afterRender) view.afterRender();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
