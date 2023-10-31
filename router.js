/*class Router {

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
*/
 class Router {
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
    
  }
