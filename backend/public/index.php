<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Middleware\CorsMiddleware;
use App\Controllers\AuthController;
use App\Controllers\TransactionController;
use App\Controllers\CategoryController;
use App\Utils\Router;

// Charger les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Gérer CORS
CorsMiddleware::handle();

// Créer le router
$router = new Router();

try {
    // Routes d'authentification
    $router->post('/auth/register', function() {
        $controller = new AuthController();
        $controller->register();
    });

    $router->post('/auth/login', function() {
        $controller = new AuthController();
        $controller->login();
    });

    $router->get('/auth/me', function() {
        $controller = new AuthController();
        $controller->me();
    });

    $router->put('/auth/change-password', function() {
        $controller = new AuthController();
        $controller->changePassword();
    });

    // Routes des transactions
    $router->get('/transactions', function() {
        $controller = new TransactionController();
        $controller->getAll();
    });

    $router->post('/transactions', function() {
        $controller = new TransactionController();
        $controller->create();
    });

    $router->get('/transactions/balance', function() {
        $controller = new TransactionController();
        $controller->getBalance();
    });

    $router->get('/transactions/{id}', function($id) {
        $controller = new TransactionController();
        $controller->getById($id);
    });

    $router->put('/transactions/{id}', function($id) {
        $controller = new TransactionController();
        $controller->update($id);
    });

    $router->delete('/transactions/{id}', function($id) {
        $controller = new TransactionController();
        $controller->delete($id);
    });

    // Routes des catégories
    $router->get('/categories', function() {
        $controller = new CategoryController();
        $controller->getAll();
    });

    $router->get('/subcategories', function() {
        $controller = new CategoryController();
        $controller->getSubcategories();
    });

    $router->get('/categories/{id}/subcategories', function($categoryId) {
        $controller = new CategoryController();
        $controller->getSubcategories($categoryId);
    });

    // Exécuter le router
    $router->run();

} catch (Exception $e) {
    \App\Utils\Response::error('Erreur serveur: ' . $e->getMessage(), 500);
}