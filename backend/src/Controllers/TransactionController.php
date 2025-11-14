<?php

namespace App\Controllers;

use App\Models\Transaction;
use App\Utils\Response;
use App\Utils\Validator;

class TransactionController extends BaseController
{
    private $transactionModel;

    public function __construct()
    {
        $this->transactionModel = new Transaction();
    }

    public function create()
    {
        $userId = $this->getUserIdFromToken();
        $data = $this->getJsonInput();

        // Validation
        $validator = new Validator($data);
        $validator->required(['type', 'transaction_date', 'category_id', 'amount'])
                  ->in('type', ['income', 'expense'])
                  ->numeric('amount')
                  ->min('amount', 0)
                  ->integer('category_id');

        if ($validator->fails()) {
            Response::error($validator->firstError(), 400);
        }

        $type = $validator->sanitize('type');
        $transactionDate = $validator->sanitize('transaction_date');
        $categoryId = $validator->getInt('category_id');
        $subcategoryId = $validator->getInt('subcategory_id');
        $amount = $validator->getFloat('amount');
        $description = $validator->sanitize('description') ?? '';
        $title = $validator->sanitize('title');
        $location = $validator->sanitize('location');

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

        // Récupérer les paramètres de filtre depuis l'URL
        $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;

        $transactions = $this->transactionModel->findByUserId($userId, $categoryId);

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
        $data = $this->getJsonInput();

        // Vérifier que la transaction existe
        $transaction = $this->transactionModel->findById($id, $userId);
        if (!$transaction) {
            Response::error('Transaction non trouvée', 404);
        }

        // Validation
        $validator = new Validator($data);
        $validator->required(['type', 'transaction_date', 'category_id', 'amount'])
                  ->in('type', ['income', 'expense'])
                  ->numeric('amount')
                  ->min('amount', 0)
                  ->integer('category_id');

        if ($validator->fails()) {
            Response::error($validator->firstError(), 400);
        }

        $type = $validator->sanitize('type');
        $transactionDate = $validator->sanitize('transaction_date');
        $categoryId = $validator->getInt('category_id');
        $subcategoryId = $validator->getInt('subcategory_id');
        $amount = $validator->getFloat('amount');
        $description = $validator->sanitize('description') ?? '';
        $title = $validator->sanitize('title');
        $location = $validator->sanitize('location');

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
