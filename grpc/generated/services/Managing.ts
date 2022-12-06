// Original file: grpc/proto/services.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { PushNotificationRequest as _services_PushNotificationRequest, PushNotificationRequest__Output as _services_PushNotificationRequest__Output } from '../services/PushNotificationRequest';
import type { PushNotificationResponse as _services_PushNotificationResponse, PushNotificationResponse__Output as _services_PushNotificationResponse__Output } from '../services/PushNotificationResponse';

export interface ManagingClient extends grpc.Client {
  ManagerSendPushNotification(argument: _services_PushNotificationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  ManagerSendPushNotification(argument: _services_PushNotificationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  ManagerSendPushNotification(argument: _services_PushNotificationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  ManagerSendPushNotification(argument: _services_PushNotificationRequest, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  managerSendPushNotification(argument: _services_PushNotificationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  managerSendPushNotification(argument: _services_PushNotificationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  managerSendPushNotification(argument: _services_PushNotificationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  managerSendPushNotification(argument: _services_PushNotificationRequest, callback: grpc.requestCallback<_services_PushNotificationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ManagingHandlers extends grpc.UntypedServiceImplementation {
  ManagerSendPushNotification: grpc.handleUnaryCall<_services_PushNotificationRequest__Output, _services_PushNotificationResponse>;
  
}

export interface ManagingDefinition extends grpc.ServiceDefinition {
  ManagerSendPushNotification: MethodDefinition<_services_PushNotificationRequest, _services_PushNotificationResponse, _services_PushNotificationRequest__Output, _services_PushNotificationResponse__Output>
}
