import { upload } from '../config/multer.config.js';
import multer from 'multer';


export const uploadSingleImage = (req, res, next) => {
    const uploadStep = upload.single('image');

    uploadStep(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erreurs spécifiques à Multer (ex: fichier trop lourd)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: "Le fichier est trop lourd (max 5MB)"
                });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Erreurs personnalisées (ex: mauvais format de fichier)
            return res.status(400).json({ message: err.message });
        }

        // Si tout est ok, on passe au contrôleur suivant
        next();
    });
};