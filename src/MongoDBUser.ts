import { KubernetesObject, V1ObjectMeta } from "@kubernetes/client-node";

export const MONGO_DB_USER = {
  GROUP: "mongotenantoperator.com",
  API_VERSION: "v1alpha1",
  PLURAL: "mongodbusers",
};

export interface MongoDBUser extends KubernetesObject {
  spec: MongoDBUserSpec;
  metadata: MongoDBUserMeta;
  status: MongoDBUserStatus;
}

export interface MongoDBUserMeta extends V1ObjectMeta {
  name: string;
  namespace: string;
}

export interface MongoDBUserSpec {
  dbName: string;
  roles: string[];
}

export interface MongoDBUserStatus {
  observedGeneration?: number;
}
