<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Category
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll()
    {
        $query = "SELECT * FROM categories ORDER BY name ASC";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $query = "SELECT * FROM categories WHERE id = :id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getSubcategoriesByCategoryId($categoryId)
    {
        $query = "SELECT * FROM subcategories WHERE category_id = :category_id ORDER BY name ASC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllSubcategories()
    {
        $query = "SELECT sc.*, c.name as category_name
                  FROM subcategories sc
                  LEFT JOIN categories c ON sc.category_id = c.id
                  ORDER BY c.name ASC, sc.name ASC";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
