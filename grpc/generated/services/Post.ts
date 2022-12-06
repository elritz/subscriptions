// Original file: grpc/proto/services.proto


export interface Post {
  'id'?: (number);
  'createdAt'?: (string);
  'updatedAt'?: (string);
  'title'?: (string);
  'content'?: (string);
  'published'?: (boolean);
}

export interface Post__Output {
  'id': (number);
  'createdAt': (string);
  'updatedAt': (string);
  'title': (string);
  'content': (string);
  'published': (boolean);
}
