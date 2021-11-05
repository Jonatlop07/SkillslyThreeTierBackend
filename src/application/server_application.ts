import { NestFactory } from '@nestjs/core';
import { RootModule } from '@application/module/.root.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { APIServerConfiguration } from '@infrastructure/config/api_server.config';
import * as chalk from 'chalk';

export class ServerApplication {
  private readonly host: string = APIServerConfiguration.HOST;
  private readonly port: number = APIServerConfiguration.PORT;
  private readonly enable_log: boolean = APIServerConfiguration.ENABLE_LOG;

  public async run(): Promise<void> {
    try {
      const options = { cors: false };
      if (!this.enable_log) {
        options['logger'] = false;
      }

      const app = await NestFactory.create<NestExpressApplication>(
        RootModule,
        options
      );
      app.setGlobalPrefix('api/v1');

      this.buildAPIDocumentation(app);

      await app.listen(this.port, this.host);

      Logger.log(
        `Environment: ${chalk
          .hex('#87e8de')
          .bold(`${process.env.NODE_ENV?.toUpperCase()}`)}`
      );

      process.env.NODE_ENV === 'production'
        ? Logger.log(
          `✅  Server ready at http://${this.host}:${chalk
            .hex('#87e8de')
            .bold(`${this.port}`)}`,
        )
        : Logger.log(
          `✅  Server is listening on port ${chalk
            .hex('#87e8de')
            .bold(`${this.port}`)}`,
        );
    } catch (error) {
      Logger.error(`❌  Error starting server, ${error}`);
      process.exit();
    }
  }

  private buildAPIDocumentation(app): void {
    const title = 'Skillsly';
    const description = 'Skillsly API Documentation';
    const version = '1.0.0';
    const tag = 'social network';

    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag)
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
