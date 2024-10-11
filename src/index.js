import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";
import createDirIfNotExists from "./utils/filters/createDirIfNotExists.js";

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
  createDirIfNotExists(TEMP_UPLOAD_DIR, UPLOAD_DIR);
};
bootstrap();
