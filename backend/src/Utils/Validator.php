<?php

namespace App\Utils;

class Validator
{
    private $data;
    private $errors = [];

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Vérifie que tous les champs requis sont présents
     *
     * @param array $fields Les champs requis
     * @return self
     */
    public function required(array $fields)
    {
        foreach ($fields as $field) {
            if (!isset($this->data[$field]) || $this->data[$field] === '' || $this->data[$field] === null) {
                $this->errors[$field] = "Le champ '$field' est requis";
            }
        }

        return $this;
    }

    /**
     * Valide un champ email
     *
     * @param string $field Le nom du champ
     * @return self
     */
    public function email($field)
    {
        if (isset($this->data[$field])) {
            $email = filter_var($this->data[$field], FILTER_SANITIZE_EMAIL);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field] = "L'email n'est pas valide";
            }
        }

        return $this;
    }

    /**
     * Valide la longueur minimale d'un champ
     *
     * @param string $field Le nom du champ
     * @param int $length La longueur minimale
     * @return self
     */
    public function minLength($field, $length)
    {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $length) {
            $this->errors[$field] = "Le champ '$field' doit contenir au moins $length caractères";
        }

        return $this;
    }

    /**
     * Valide qu'un champ est un entier
     *
     * @param string $field Le nom du champ
     * @return self
     */
    public function integer($field)
    {
        if (isset($this->data[$field]) && !is_numeric($this->data[$field])) {
            $this->errors[$field] = "Le champ '$field' doit être un nombre entier";
        }

        return $this;
    }

    /**
     * Valide qu'un champ est un nombre décimal
     *
     * @param string $field Le nom du champ
     * @return self
     */
    public function numeric($field)
    {
        if (isset($this->data[$field]) && !is_numeric($this->data[$field])) {
            $this->errors[$field] = "Le champ '$field' doit être un nombre";
        }

        return $this;
    }

    /**
     * Valide qu'un champ est supérieur à une valeur
     *
     * @param string $field Le nom du champ
     * @param float $min La valeur minimale
     * @return self
     */
    public function min($field, $min)
    {
        if (isset($this->data[$field]) && floatval($this->data[$field]) <= $min) {
            $this->errors[$field] = "Le champ '$field' doit être supérieur à $min";
        }

        return $this;
    }

    /**
     * Valide qu'un champ fait partie d'une liste de valeurs
     *
     * @param string $field Le nom du champ
     * @param array $values Les valeurs acceptées
     * @return self
     */
    public function in($field, array $values)
    {
        if (isset($this->data[$field]) && !in_array($this->data[$field], $values)) {
            $valuesStr = implode(', ', $values);
            $this->errors[$field] = "Le champ '$field' doit être l'une des valeurs suivantes: $valuesStr";
        }

        return $this;
    }

    /**
     * Vérifie s'il y a des erreurs
     *
     * @return bool
     */
    public function fails()
    {
        return !empty($this->errors);
    }

    /**
     * Retourne les erreurs
     *
     * @return array
     */
    public function errors()
    {
        return $this->errors;
    }

    /**
     * Retourne la première erreur
     *
     * @return string|null
     */
    public function firstError()
    {
        return !empty($this->errors) ? reset($this->errors) : null;
    }

    /**
     * Sanitize (nettoie) un champ string
     *
     * @param string $field Le nom du champ
     * @return string|null
     */
    public function sanitize($field)
    {
        if (!isset($this->data[$field])) {
            return null;
        }

        return htmlspecialchars(strip_tags($this->data[$field]));
    }

    /**
     * Sanitize un email
     *
     * @param string $field Le nom du champ
     * @return string|null
     */
    public function sanitizeEmail($field)
    {
        if (!isset($this->data[$field])) {
            return null;
        }

        return filter_var($this->data[$field], FILTER_SANITIZE_EMAIL);
    }

    /**
     * Récupère une valeur sanitized en tant qu'entier
     *
     * @param string $field Le nom du champ
     * @return int|null
     */
    public function getInt($field)
    {
        if (!isset($this->data[$field]) || $this->data[$field] === '' || $this->data[$field] === null) {
            return null;
        }

        return intval($this->data[$field]);
    }

    /**
     * Récupère une valeur sanitized en tant que float
     *
     * @param string $field Le nom du champ
     * @return float|null
     */
    public function getFloat($field)
    {
        if (!isset($this->data[$field])) {
            return null;
        }

        return floatval($this->data[$field]);
    }

    /**
     * Récupère une valeur brute
     *
     * @param string $field Le nom du champ
     * @return mixed
     */
    public function get($field)
    {
        return $this->data[$field] ?? null;
    }
}
