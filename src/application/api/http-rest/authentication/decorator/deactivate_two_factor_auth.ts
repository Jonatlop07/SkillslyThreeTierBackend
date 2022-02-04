import { SetMetadata } from '@nestjs/common';

export const DEACTIVATE_TWO_FACTOR_AUTH = 'deactivate2FA';
export const DeactivateTwoFactorAuth = () => SetMetadata(DEACTIVATE_TWO_FACTOR_AUTH, true);
