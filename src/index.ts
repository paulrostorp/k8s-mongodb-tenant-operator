import { logger } from "./logger";
import { TenantOperator } from "./operator";

const operator = new TenantOperator();

operator.start().then(() => {
  logger.debug("Operator started");
});
