const { z } = require('zod');

// Schema for Login
const loginSchema = z.object({
    email: z.string().email('Format email invalide'),
    password: z.string().min(1, 'Mot de passe requis')
});

// Schema for Participant Registration (No Companions)
const registrationSchema = z.object({
    nom: z.string().min(2, 'Nom trop court').max(50),
    prenom: z.string().min(2, 'Prénom trop court').max(50),
    email: z.string().email('Format email invalide'),
    telephone: z.string().min(10, 'Numéro de téléphone invalide').max(20),
    entreprise: z.string().optional().nullable(),
    categorie_badge: z.string().min(1, 'Catégorie requise')
}).passthrough();

// Schema for Staff/Admin creation
const userCreateSchema = z.object({
    name: z.string().min(2, 'Nom trop court'),
    email: z.string().email('Format email invalide'),
    password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères')
});

// Schema for Password Change
const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Ancien mot de passe requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit faire au moins 6 caractères'),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// Schema for Admin Resetting User Password
const passwordResetSchema = z.object({
    userId: z.number(),
    role: z.enum(['admin', 'staff']),
    newPassword: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères')
});

module.exports = {
    loginSchema,
    registrationSchema,
    userCreateSchema,
    changePasswordSchema,
    passwordResetSchema
};
