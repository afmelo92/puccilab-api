import { Application, json, urlencoded } from 'express';
import helmet from 'helmet';
import corsHandler from './middlewares/CORSHandler';
import errorHandler from './middlewares/ErrorHandler';
import router from './routes';
import logger from './utils/logger';

type ServerProps = {
  app: Application;
  port: number;
};

class Server {
  private app: Application;
  private port: number;

  constructor({ app, port = 3333 }: ServerProps) {
    this.app = app;
    this.port = port;
  }

  public async init(): Promise<void> {
    this.routesSetup();
    this.listen(() => {
      logger.log({
        level: 'info',
        message: `Listening at ${this.port}`,
      });
    });
  }

  private listen(cb: () => void): void {
    this.app.listen(this.port, cb);
  }

  private routesSetup(): void {
    this.app.use(helmet());
    this.app.use(corsHandler);
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(router);
    this.app.use(errorHandler);
  }
}

export default Server;
