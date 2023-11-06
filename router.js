
  "use strict";

class Router {

    constructor(routes) {
        this._routes = routes;
        this._started = false;

        window.addEventListener("hashchange", () => this._handleRouting());
    }

    /**
     * Routing starten und erste Route direkt aufrufen.
     */
    start() {
        this._started = true;
        this._handleRouting();
    }

    /**
     * Routing stoppen, so dass der Router nicht mehr aktiv wird, wenn Link
     * angeklickt wird oder sich die URL der Seite sonst irgendwie ändert.
     */
    stop() {
        this._started = false;
    }

    _handleRouting() {
        let url = location.hash.slice(1);

        if (url.length === 0) {
            url = "/";
        }

        let matches = null;
        let route = this._routes.find(p => matches = url.match(p.url));

        if (!route) {
            console.error(`Keine Route zur URL ${url} gefunden!`);
            return;
        }

        
        route.show(matches);
    }
}
 

