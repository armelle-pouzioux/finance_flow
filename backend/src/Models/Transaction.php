<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Transaction
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($userId, $type, $transactionDate, $categoryId, $subcategoryId, $amount, $description, $title = null, $location = null)
    {
        $query = "INSERT INTO transactions (user_id, type, transaction_date, category_id, subcategory_id, amount, description, title, location, created_at)
                  VALUES (:user_id, :type, :transaction_date, :category_id, :subcategory_id, :amount, :description, :title, :location, NOW())";

        $stmt = $this->db->prepare($query);

        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':transaction_date', $transactionDate);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->bindParam(':subcategory_id', $subcategoryId);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':location', $location);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function findByUserId($userId, $categoryId = null)
    {
        $query = "SELECT t.*, c.name as category_name, sc.name as subcategory_name
                  FROM transactions t
                  LEFT JOIN categories c ON t.category_id = c.id
                  LEFT JOIN subcategories sc ON t.subcategory_id = sc.id
                  WHERE t.user_id = :user_id";

        // Ajouter le filtre par catégorie si spécifié
        if ($categoryId !== null) {
            $query .= " AND t.category_id = :category_id";
        }

        $query .= " ORDER BY t.transaction_date DESC, t.created_at DESC";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);

        if ($categoryId !== null) {
            $stmt->bindParam(':category_id', $categoryId);
        }

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id, $userId)
    {
        $query = "SELECT * FROM transactions WHERE id = :id AND user_id = :user_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $userId, $type, $transactionDate, $categoryId, $subcategoryId, $amount, $description, $title = null, $location = null)
    {
        $query = "UPDATE transactions
                  SET type = :type, transaction_date = :transaction_date, category_id = :category_id,
                      subcategory_id = :subcategory_id, amount = :amount, description = :description,
                      title = :title, location = :location
                  WHERE id = :id AND user_id = :user_id";

        $stmt = $this->db->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':transaction_date', $transactionDate);
        $stmt->bindParam(':category_id', $categoryId);
        $stmt->bindParam(':subcategory_id', $subcategoryId);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':location', $location);

        return $stmt->execute();
    }

    public function delete($id, $userId)
    {
        $query = "DELETE FROM transactions WHERE id = :id AND user_id = :user_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $userId);

        return $stmt->execute();
    }

    public function getBalance($userId)
    {
        $query = "SELECT
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
                  FROM transactions
                  WHERE user_id = :user_id";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'total_income' => $result['total_income'] ?? 0,
            'total_expense' => $result['total_expense'] ?? 0,
            'balance' => ($result['total_income'] ?? 0) - ($result['total_expense'] ?? 0)
        ];
    }
}
