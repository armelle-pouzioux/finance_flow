<?php

namespace App\Controllers;

use App\Models\Category;
use App\Utils\Response;
use App\Utils\JWT;

class CategoryController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    private function getUserIdFromToken()
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

    public function getAll()
    {
        $this->getUserIdFromToken(); // Vérifier que l'utilisateur est authentifié

        $categories = $this->categoryModel->getAll();

        Response::success('Catégories récupérées', [
            'categories' => $categories
        ]);
    }

    public function getSubcategories($categoryId = null)
    {
        $this->getUserIdFromToken(); // Vérifier que l'utilisateur est authentifié

        if ($categoryId) {
            $subcategories = $this->categoryModel->getSubcategoriesByCategoryId($categoryId);
        } else {
            $subcategories = $this->categoryModel->getAllSubcategories();
        }

        Response::success('Sous-catégories récupérées', [
            'subcategories' => $subcategories
        ]);
    }
}
