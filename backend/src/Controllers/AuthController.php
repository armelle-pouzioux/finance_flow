<?php

namespace App\Controllers;

use App\Models\User;
use App\Utils\Response;
use App\Utils\JWT;
use App\Utils\Validator;

class AuthController extends BaseController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function register()
    {
        $data = $this->getJsonInput();

        // Validation
        $validator = new Validator($data);
        $validator->required(['email', 'password', 'username'])
                  ->email('email')
                  ->minLength('password', 8);

        if ($validator->fails()) {
            Response::error($validator->firstError(), 400);
        }

        $email = $validator->sanitizeEmail('email');
        $password = $validator->get('password');
        $username = $validator->sanitize('username');

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
        $data = $this->getJsonInput();

        // Validation
        $validator = new Validator($data);
        $validator->required(['email', 'password']);

        if ($validator->fails()) {
            Response::error($validator->firstError(), 400);
        }

        $email = $validator->sanitizeEmail('email');
        $password = $validator->get('password');

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
        $userId = $this->getUserIdFromToken();

        $user = $this->userModel->findById($userId);

        if (!$user) {
            Response::error('Utilisateur non trouvé', 404);
        }

        Response::success('Utilisateur trouvé', [
            'user' => $user
        ]);
    }

    public function changePassword()
    {
        $userId = $this->getUserIdFromToken();

        $data = $this->getJsonInput();

        // Validation
        $validator = new Validator($data);
        $validator->required(['currentPassword', 'newPassword'])
                  ->minLength('newPassword', 8);

        if ($validator->fails()) {
            Response::error($validator->firstError(), 400);
        }

        $currentPassword = $validator->get('currentPassword');
        $newPassword = $validator->get('newPassword');

        // Récupérer le hash du mot de passe actuel
        $currentHash = $this->userModel->getPasswordHash($userId);

        if (!$currentHash) {
            Response::error('Utilisateur non trouvé', 404);
        }

        // Vérifier le mot de passe actuel
        if (!$this->userModel->verifyPassword($currentPassword, $currentHash)) {
            Response::error('Mot de passe actuel incorrect', 401);
        }

        // Mettre à jour le mot de passe
        if ($this->userModel->updatePassword($userId, $newPassword)) {
            Response::success('Mot de passe modifié avec succès');
        } else {
            Response::error('Erreur lors de la modification du mot de passe', 500);
        }
    }
}