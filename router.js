
  "use strict";

class Router {
    /**
     * Konstruktor. Im Parameter routes muss eine Liste mit den vorhandenen
     * URL-Routen der App übergeben werden. Die Liste muss folgendes Format
     * haben:
     *      [
     *          {
     *              url: "^/$"              // Regulärer Ausdruck zur URL
     *              show: matches => {...}  // Funktion zur Anzeige des Inhalts
     *          }, {
     *              url: "^/Details/(.*)$"  // Regulärer Ausdruck zur URL
     *              show: matches => {...}  // Funktion zur Anzeige des Inhalts
     *          },
     *          ...
     *      ]
     *
     * @param {List} routes Definition der in der App verfügbaren Seiten
     */
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


 /*class Router {
    constructor() {
      this.routes = {};
      this.currentRoute = "";
    }
  
    addRoute(route, handler) {
      this.routes[route] = handler;
    }
  
    handleRouting() {
      const hash = window.location.hash.slice(1);
      const routeParams = this.parseRouteParams(hash);
  
      if (this.routes[hash]) {
        this.currentRoute = hash;
        this.routes[hash](routeParams);
      } else {
        // Fallback: Zeige die Startseite an
        this.currentRoute = "/";
        this.routes["/"](routeParams);
      }
    }
  
    parseRouteParams(route) {
      const params = {};
      const paramRegex = /:(\w+)/g;
      const matches = route.match(paramRegex);
  
      if (matches) {
        matches.forEach((match) => {
          const paramName = match.slice(1);
          params[paramName] = routeParams[paramName];
        });
      }
  
      return params;
    }
    
  }*/