import Operator, { ResourceEvent, ResourceEventType } from "@dot-i/k8s-operator";
import { MongoClient } from "mongodb";
import { createUser, deleteUser } from "./manageUsers";
import { logger } from "./logger";
import { MongoDBUser, MONGO_DB_USER } from "./MongoDBUser";

export class TenantOperator extends Operator {
  mongoClient: MongoClient;
  constructor() {
    super(logger);
    const mongoUri = process.env.MONGO_CLUSTER_ADMIN_URI;
    if (!mongoUri || mongoUri == "") {
      logger.error("Missing `MONGO_CLUSTER_ADMIN_URI` environment variable");
      process.exit(9);
    }

    this.mongoClient = new MongoClient(mongoUri);
  }

  protected async init(): Promise<void> {
    await this.watchResource(MONGO_DB_USER.GROUP, MONGO_DB_USER.API_VERSION, MONGO_DB_USER.PLURAL, async e => {
      const object = e.object as MongoDBUser;
      const metadata = object.metadata;
      try {
        if (e.type === ResourceEventType.Added || e.type === ResourceEventType.Modified) {
          const isOpDelete = await this.handleResourceFinalizer(e, MONGO_DB_USER.GROUP, e => this.resourceDeleted(e));
          if (!isOpDelete) {
            await this.resourceModified(e);
          }
        }
      } catch (err) {
        logger.error(`Failed to process event for resource ${metadata?.name}: ` + (err instanceof Error ? err.message : "error unknown"));
      }
    });
  }

  private async resourceModified(e: ResourceEvent): Promise<void> {
    const object = e.object as MongoDBUser;
    const metadata = object.metadata;

    if (!object.status || object.status.observedGeneration !== metadata.generation) {
      // handle resource modification here

      await createUser({ mongoClient: this.mongoClient, k8sClient: this.k8sApi, object });

      await this.setResourceStatus(e.meta, { observedGeneration: metadata.generation });
    }
  }

  private async resourceDeleted(e: ResourceEvent): Promise<void> {
    const object = e.object as MongoDBUser;

    await deleteUser({ mongoClient: this.mongoClient, object });
  }
}
