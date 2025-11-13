<?php

namespace App\Middleware;

class CorsMiddleware
{
    public static function handle()
    {
        // Essayer plusieurs méthodes pour obtenir l'origine CORS
        $origin = getenv('CORS_ORIGIN') ?: ($_ENV['CORS_ORIGIN'] ?? 'http://localhost:5173');

        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        // Répondre aux requêtes OPTIONS (preflight)
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}