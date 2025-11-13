<?php

namespace App\Controllers;

use App\Models\User;
use App\Utils\Response;
use App\Utils\JWT;

class AuthController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function register()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validation
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            Response::error('Tous les champs sont requis', 400);
        }

        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $password = $data['password'];
        $username = htmlspecialchars(strip_tags($data['username']));

        // Validation email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email invalide', 400);
        }

        // Validation mot de passe
        if (strlen($password) < 8) {
            Response::error('Le mot de passe doit contenir au moins 8 caractères', 400);
        }

        // Vérifier si l'email existe déjà
        if ($this->userModel->emailExists($email)) {
            Response::error('Cet email est déjà utilisé', 409);
        }

        // Créer l'utilisateur
        $userId = $this->userModel->create($email, $password, $username);

        if ($userId) {
            // Générer le token JWT
            $token = JWT::encode([
                'user_id' => $userId,
                'email' => $email
            ]);

            Response::success('Inscription réussie', [
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'username' => $username
                ]
            ], 201);
        } else {
            Response::error('Erreur lors de l\'inscription', 500);
        }
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validation
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error('Email et mot de passe requis', 400);
        }

        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $password = $data['password'];

        // Trouver l'utilisateur
        $user = $this->userModel->findByEmail($email);

        if (!$user) {
            Response::error('Email ou mot de passe incorrect', 401);
        }

        // Vérifier le mot de passe
        if (!$this->userModel->verifyPassword($password, $user['password'])) {
            Response::error('Email ou mot de passe incorrect', 401);
        }

        // Générer le token JWT
        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email']
        ]);

        Response::success('Connexion réussie', [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'username' => $user['username']
            ]
        ]);
    }

    public function me()
    {
        $token = JWT::getBearerToken();

        if (!$token) {
            Response::error('Token manquant', 401);
        }

        $decoded = JWT::decode($token);

        if (!$decoded) {
            Response::error('Token invalide ou expiré', 401);
        }

        $user = $this->userModel->findById($decoded['user_id']);

        if (!$user) {
            Response::error('Utilisateur non trouvé', 404);
        }

        Response::success('Utilisateur trouvé', [
            'user' => $user
        ]);
    }

    public function changePassword()
    {
        $token = JWT::getBearerToken();

        if (!$token) {
            Response::error('Token manquant', 401);
        }

        $decoded = JWT::decode($token);

        if (!$decoded) {
            Response::error('Token invalide ou expiré', 401);
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validation
        if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            Response::error('Mot de passe actuel et nouveau mot de passe requis', 400);
        }

        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];

        // Validation du nouveau mot de passe
        if (strlen($newPassword) < 8) {
            Response::error('Le nouveau mot de passe doit contenir au moins 8 caractères', 400);
        }

        // Récupérer le hash du mot de passe actuel
        $currentHash = $this->userModel->getPasswordHash($decoded['user_id']);

        if (!$currentHash) {
            Response::error('Utilisateur non trouvé', 404);
        }

        // Vérifier le mot de passe actuel
        if (!$this->userModel->verifyPassword($currentPassword, $currentHash)) {
            Response::error('Mot de passe actuel incorrect', 401);
        }

        // Mettre à jour le mot de passe
        if ($this->userModel->updatePassword($decoded['user_id'], $newPassword)) {
            Response::success('Mot de passe modifié avec succès');
        } else {
            Response::error('Erreur lors de la modification du mot de passe', 500);
        }
    }
}