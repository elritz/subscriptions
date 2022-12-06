// Original file: grpc/proto/services.proto

import type { PushNotificationProfile as _services_PushNotificationProfile, PushNotificationProfile__Output as _services_PushNotificationProfile__Output } from '../services/PushNotificationProfile';

export interface PushNotificationRequest {
  'profiles'?: (_services_PushNotificationProfile)[];
}

export interface PushNotificationRequest__Output {
  'profiles': (_services_PushNotificationProfile__Output)[];
}
