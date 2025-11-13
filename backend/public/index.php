<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Middleware\CorsMiddleware;
use App\Controllers\AuthController;
use App\Controllers\TransactionController;
use App\Controllers\CategoryController;
use App\Utils\Response;

// Charger les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Debug: vérifier que CORS_ORIGIN est chargé (à supprimer après test)
error_log("CORS_ORIGIN from getenv: " . getenv('CORS_ORIGIN'));
error_log("CORS_ORIGIN from _ENV: " . ($_ENV['CORS_ORIGIN'] ?? 'non défini'));

// Gérer CORS
CorsMiddleware::handle();

// Récupérer la méthode HTTP et l'URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Retirer le préfixe du chemin complet (pour WAMP)
$uri = str_replace('/finance-flow/backend/public', '', $uri);
$uri = str_replace('/api', '', $uri); // Retirer le préfixe /api si présent

// Router simple
try {
    switch ($uri) {
        case '/auth/register':
            if ($method === 'POST') {
                $controller = new AuthController();
                $controller->register();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/auth/login':
            if ($method === 'POST') {
                $controller = new AuthController();
                $controller->login();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/auth/me':
            if ($method === 'GET') {
                $controller = new AuthController();
                $controller->me();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/auth/change-password':
            if ($method === 'PUT') {
                $controller = new AuthController();
                $controller->changePassword();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/transactions':
            $controller = new TransactionController();
            if ($method === 'GET') {
                $controller->getAll();
            } elseif ($method === 'POST') {
                $controller->create();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/transactions/balance':
            if ($method === 'GET') {
                $controller = new TransactionController();
                $controller->getBalance();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/categories':
            if ($method === 'GET') {
                $controller = new CategoryController();
                $controller->getAll();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        case '/subcategories':
            if ($method === 'GET') {
                $controller = new CategoryController();
                $controller->getSubcategories();
            } else {
                Response::error('Méthode non autorisée', 405);
            }
            break;

        default:
            // Gérer les routes avec ID
            if (preg_match('/^\/transactions\/(\d+)$/', $uri, $matches)) {
                $id = $matches[1];
                $controller = new TransactionController();

                if ($method === 'GET') {
                    $controller->getById($id);
                } elseif ($method === 'PUT') {
                    $controller->update($id);
                } elseif ($method === 'DELETE') {
                    $controller->delete($id);
                } else {
                    Response::error('Méthode non autorisée', 405);
                }
            } elseif (preg_match('/^\/categories\/(\d+)\/subcategories$/', $uri, $matches)) {
                $categoryId = $matches[1];
                if ($method === 'GET') {
                    $controller = new CategoryController();
                    $controller->getSubcategories($categoryId);
                } else {
                    Response::error('Méthode non autorisée', 405);
                }
            } else {
                Response::error('Route non trouvée', 404);
            }
            break;
    }
} catch (Exception $e) {
    Response::error('Erreur serveur: ' . $e->getMessage(), 500);
}