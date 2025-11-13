<?php

namespace App\Controllers;

use App\Models\Transaction;
use App\Utils\Response;
use App\Utils\JWT;

class TransactionController
{
    private $transactionModel;

    public function __construct()
    {
        $this->transactionModel = new Transaction();
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

    public function create()
    {
        $userId = $this->getUserIdFromToken();
        $data = json_decode(file_get_contents("php://input"), true);

        // Validation
        if (!isset($data['type']) || !isset($data['transaction_date']) || !isset($data['category_id']) || !isset($data['amount'])) {
            Response::error('Tous les champs requis doivent être renseignés', 400);
        }

        $type = htmlspecialchars(strip_tags($data['type']));
        $transactionDate = htmlspecialchars(strip_tags($data['transaction_date']));
        $categoryId = intval($data['category_id']);
        $subcategoryId = (isset($data['subcategory_id']) && $data['subcategory_id'] !== '' && $data['subcategory_id'] !== null) ? intval($data['subcategory_id']) : null;
        $amount = floatval($data['amount']);
        $description = isset($data['description']) ? htmlspecialchars(strip_tags($data['description'])) : '';
        $title = (isset($data['title']) && $data['title'] !== '') ? htmlspecialchars(strip_tags($data['title'])) : null;
        $location = (isset($data['location']) && $data['location'] !== '') ? htmlspecialchars(strip_tags($data['location'])) : null;

        // Validation du type
        if (!in_array($type, ['income', 'expense'])) {
            Response::error('Type invalide (income ou expense)', 400);
        }

        // Validation du montant
        if ($amount <= 0) {
            Response::error('Le montant doit être supérieur à 0', 400);
        }

        $transactionId = $this->transactionModel->create(
            $userId,
            $type,
            $transactionDate,
            $categoryId,
            $subcategoryId,
            $amount,
            $description,
            $title,
            $location
        );

        if ($transactionId) {
            Response::success('Transaction créée avec succès', [
                'transaction_id' => $transactionId
            ], 201);
        } else {
            Response::error('Erreur lors de la création de la transaction', 500);
        }
    }

    public function getAll()
    {
        $userId = $this->getUserIdFromToken();

        $transactions = $this->transactionModel->findByUserId($userId);

        Response::success('Transactions récupérées', [
            'transactions' => $transactions
        ]);
    }

    public function getById($id)
    {
        $userId = $this->getUserIdFromToken();

        $transaction = $this->transactionModel->findById($id, $userId);

        if (!$transaction) {
            Response::error('Transaction non trouvée', 404);
        }

        Response::success('Transaction trouvée', [
            'transaction' => $transaction
        ]);
    }

    public function update($id)
    {
        $userId = $this->getUserIdFromToken();
        $data = json_decode(file_get_contents("php://input"), true);

        // Vérifier que la transaction existe
        $transaction = $this->transactionModel->findById($id, $userId);
        if (!$transaction) {
            Response::error('Transaction non trouvée', 404);
        }

        // Validation
        if (!isset($data['type']) || !isset($data['transaction_date']) || !isset($data['category_id']) || !isset($data['amount'])) {
            Response::error('Tous les champs requis doivent être renseignés', 400);
        }

        $type = htmlspecialchars(strip_tags($data['type']));
        $transactionDate = htmlspecialchars(strip_tags($data['transaction_date']));
        $categoryId = intval($data['category_id']);
        $subcategoryId = (isset($data['subcategory_id']) && $data['subcategory_id'] !== '' && $data['subcategory_id'] !== null) ? intval($data['subcategory_id']) : null;
        $amount = floatval($data['amount']);
        $description = isset($data['description']) ? htmlspecialchars(strip_tags($data['description'])) : '';
        $title = (isset($data['title']) && $data['title'] !== '') ? htmlspecialchars(strip_tags($data['title'])) : null;
        $location = (isset($data['location']) && $data['location'] !== '') ? htmlspecialchars(strip_tags($data['location'])) : null;

        // Validation du type
        if (!in_array($type, ['income', 'expense'])) {
            Response::error('Type invalide (income ou expense)', 400);
        }

        // Validation du montant
        if ($amount <= 0) {
            Response::error('Le montant doit être supérieur à 0', 400);
        }

        $success = $this->transactionModel->update(
            $id,
            $userId,
            $type,
            $transactionDate,
            $categoryId,
            $subcategoryId,
            $amount,
            $description,
            $title,
            $location
        );

        if ($success) {
            Response::success('Transaction mise à jour avec succès');
        } else {
            Response::error('Erreur lors de la mise à jour de la transaction', 500);
        }
    }

    public function delete($id)
    {
        $userId = $this->getUserIdFromToken();

        // Vérifier que la transaction existe
        $transaction = $this->transactionModel->findById($id, $userId);
        if (!$transaction) {
            Response::error('Transaction non trouvée', 404);
        }

        $success = $this->transactionModel->delete($id, $userId);

        if ($success) {
            Response::success('Transaction supprimée avec succès');
        } else {
            Response::error('Erreur lors de la suppression de la transaction', 500);
        }
    }

    public function getBalance()
    {
        $userId = $this->getUserIdFromToken();

        $balance = $this->transactionModel->getBalance($userId);

        Response::success('Solde récupéré', $balance);
    }
}
