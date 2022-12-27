import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ManagingClient as _services_ManagingClient, ManagingDefinition as _services_ManagingDefinition } from './services/Managing';
import type { MessagingClient as _services_MessagingClient, MessagingDefinition as _services_MessagingDefinition } from './services/Messaging';
import type { ProfilingClient as _services_ProfilingClient, ProfilingDefinition as _services_ProfilingDefinition } from './services/Profiling';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  services: {
    Managing: SubtypeConstructor<typeof grpc.Client, _services_ManagingClient> & { service: _services_ManagingDefinition }
    Messaging: SubtypeConstructor<typeof grpc.Client, _services_MessagingClient> & { service: _services_MessagingDefinition }
    Post: MessageTypeDefinition
    PostRequest: MessageTypeDefinition
    Profiling: SubtypeConstructor<typeof grpc.Client, _services_ProfilingClient> & { service: _services_ProfilingDefinition }
    PushNotificationProfile: MessageTypeDefinition
    PushNotificationRequest: MessageTypeDefinition
    PushNotificationRequests: MessageTypeDefinition
    PushNotificationResponse: MessageTypeDefinition
  }
}

