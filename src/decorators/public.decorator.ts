import { SetMetadata } from '@nestjs/common';

export const KEY_IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(KEY_IS_PUBLIC, true);