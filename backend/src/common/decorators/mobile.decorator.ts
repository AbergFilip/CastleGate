import { SetMetadata } from '@nestjs/common';

export const IS_MOBILE_KEY = 'isMobile';
export const Mobile = () => SetMetadata(IS_MOBILE_KEY, true);

