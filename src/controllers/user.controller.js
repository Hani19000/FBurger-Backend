import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getAllUsers = asyncHandler(async (_req, res) => {
    const users = await userService.getAllUsers();
    sendSuccess(res, HTTP_STATUS.OK, users);
});

export const deleteUser = asyncHandler(async (req, res) => {
    if (req.params.userId === req.user.id) {
        throw new AppError("Vous ne pouvez pas supprimer votre propre compte admin", HTTP_STATUS.BAD_REQUEST);
    }
    await userService.deleteUser(req.params.userId);
    sendSuccess(res, HTTP_STATUS.OK, { message: 'user deleted successfully' });
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(
        req.params.userId,
        req.body.roleName
    );
    sendSuccess(res, HTTP_STATUS.OK, user);
});
