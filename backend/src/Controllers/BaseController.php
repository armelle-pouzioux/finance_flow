<?php

namespace App\Controllers;

use App\Utils\Response;
use App\Utils\JWT;

abstract class BaseController
{
    /**
     * Récupère l'ID de l'utilisateur depuis le token JWT
     *
     * @return int L'ID de l'utilisateur
     * @throws Response En cas d'erreur (token manquant ou invalide)
     */
    protected function getUserIdFromToken()
    {
        $token = JWT::getBearerToken();

        if (!$token) {
            Response::error('Token manquant', 401);
        }

        $decoded = JWT::decode($token);

        if (!$decoded) {
            Response::error('Token invalide ou expiré', 401);
        }

        return $decoded['user_id'];
    }

    /**
     * Récupère les données JSON depuis le corps de la requête
     *
     * @return array|null Les données décodées ou null en cas d'erreur
     */
    protected function getJsonInput()
    {
        return json_decode(file_get_contents("php://input"), true);
    }
}
