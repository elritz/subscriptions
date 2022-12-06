// Original file: grpc/proto/services.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Post as _services_Post, Post__Output as _services_Post__Output } from '../services/Post';
import type { PostRequest as _services_PostRequest, PostRequest__Output as _services_PostRequest__Output } from '../services/PostRequest';

export interface MessagingClient extends grpc.Client {
  CreateFriendRequestMessage(argument: _services_PostRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  CreateFriendRequestMessage(argument: _services_PostRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  CreateFriendRequestMessage(argument: _services_PostRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  CreateFriendRequestMessage(argument: _services_PostRequest, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  createFriendRequestMessage(argument: _services_PostRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  createFriendRequestMessage(argument: _services_PostRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  createFriendRequestMessage(argument: _services_PostRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  createFriendRequestMessage(argument: _services_PostRequest, callback: grpc.requestCallback<_services_Post__Output>): grpc.ClientUnaryCall;
  
}

export interface MessagingHandlers extends grpc.UntypedServiceImplementation {
  CreateFriendRequestMessage: grpc.handleUnaryCall<_services_PostRequest__Output, _services_Post>;
  
}

export interface MessagingDefinition extends grpc.ServiceDefinition {
  CreateFriendRequestMessage: MethodDefinition<_services_PostRequest, _services_Post, _services_PostRequest__Output, _services_Post__Output>
}
