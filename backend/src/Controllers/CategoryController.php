<?php

namespace App\Controllers;

use App\Models\Category;
use App\Utils\Response;

class CategoryController extends BaseController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
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
