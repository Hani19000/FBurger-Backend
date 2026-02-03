import multer from 'multer';

/**
 * CONFIGURATION MULTER
 * Utilisation du MemoryStorage car les fichiers sont envoyés directement 
 * vers Cloudinary. Cela évite l'écriture inutile sur le disque serveur.
 */
const storage = multer.memoryStorage();

/**
 * FILTRE DE SÉCURITÉ
 * Vérifie l'extension et le type MIME pour n'accepter que des images.
 */
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format invalide : Seules les images (jpg, png, gif, webp) sont autorisées.'), false);
    }
};

/**
 * INSTANCE D'UPLOAD
 * Limite de taille fixée à 5MB pour préserver la bande passante.
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});