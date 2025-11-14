<?php

namespace App\Utils;

class Router
{
    private $routes = [];
    private $method;
    private $uri;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = $this->parseUri();
    }

    /**
     * Parse l'URI en retirant les préfixes spécifiques à WAMP
     *
     * @return string L'URI nettoyée
     */
    private function parseUri()
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Retirer le préfixe du chemin complet (pour WAMP)
        $uri = str_replace('/finance-flow/backend/public', '', $uri);
        $uri = str_replace('/api', '', $uri);

        return $uri;
    }

    /**
     * Enregistre une route GET
     *
     * @param string $path Le chemin de la route
     * @param callable $callback La fonction à exécuter
     */
    public function get($path, $callback)
    {
        $this->addRoute('GET', $path, $callback);
    }

    /**
     * Enregistre une route POST
     *
     * @param string $path Le chemin de la route
     * @param callable $callback La fonction à exécuter
     */
    public function post($path, $callback)
    {
        $this->addRoute('POST', $path, $callback);
    }

    /**
     * Enregistre une route PUT
     *
     * @param string $path Le chemin de la route
     * @param callable $callback La fonction à exécuter
     */
    public function put($path, $callback)
    {
        $this->addRoute('PUT', $path, $callback);
    }

    /**
     * Enregistre une route DELETE
     *
     * @param string $path Le chemin de la route
     * @param callable $callback La fonction à exécuter
     */
    public function delete($path, $callback)
    {
        $this->addRoute('DELETE', $path, $callback);
    }

    /**
     * Ajoute une route au tableau des routes
     *
     * @param string $method La méthode HTTP
     * @param string $path Le chemin de la route
     * @param callable $callback La fonction à exécuter
     */
    private function addRoute($method, $path, $callback)
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'callback' => $callback
        ];
    }

    /**
     * Exécute le router en cherchant une route correspondante
     */
    public function run()
    {
        foreach ($this->routes as $route) {
            // Vérifier si la méthode HTTP correspond
            if ($route['method'] !== $this->method) {
                continue;
            }

            // Vérifier si le chemin correspond (exact match)
            if ($route['path'] === $this->uri) {
                return call_user_func($route['callback']);
            }

            // Vérifier si le chemin correspond avec des paramètres (ex: /transactions/{id})
            $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '(\d+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $this->uri, $matches)) {
                // Retirer le premier élément (le match complet)
                array_shift($matches);

                // Appeler le callback avec les paramètres
                return call_user_func_array($route['callback'], $matches);
            }
        }

        // Aucune route trouvée
        Response::error('Route non trouvée', 404);
    }
}
