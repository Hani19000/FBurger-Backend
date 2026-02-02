import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { AdminService } from '../services/admin.service.js'; // Le pivot central
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getStats = asyncHandler(async (_req, res) => {
    // Le controller demande au service les stats
    const stats = await AdminService.getDashboardStats();

    // On renvoie la réponse formatée
    sendSuccess(res, HTTP_STATUS.OK, stats);
});