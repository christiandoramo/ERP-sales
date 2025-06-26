// shared/pipe-config/src/lib/location-header.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const LOCATION_HEADER = 'location_header';

export const LocationHeader = () => SetMetadata(LOCATION_HEADER, true);
