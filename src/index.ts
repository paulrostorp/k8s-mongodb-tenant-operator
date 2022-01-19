import { logger } from "./logger";
import { TenantOperator } from "./operator";

const operator = new TenantOperator();

operator.start().then(() => {
  logger.debug("Operator started");
});

const exit = (reason: string): void => {
  logger.debug("Shutting down, " + reason);
  operator.stop();
  process.exit(0);
};

process.on("SIGTERM", () => exit("SIGTERM")).on("SIGINT", () => exit("SIGINT"));
