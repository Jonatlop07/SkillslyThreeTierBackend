import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as chalk from 'chalk';
import { APIServerConfiguration } from '@infrastructure/config/api_server.config';
import { RootModule } from '@application/module/.root.module';

export class ServerApplication {
  private readonly host: string = APIServerConfiguration.HOST;
  private readonly port: number = APIServerConfiguration.PORT;
  private readonly enable_log: boolean = APIServerConfiguration.ENABLE_LOG;
  private readonly origin: string = APIServerConfiguration.ORIGIN;

  public async run(): Promise<void> {
    try {
      const options = {};
      if (!this.enable_log) {
        options['logger'] = false;
      }
      const app = await NestFactory.create(
        RootModule,
        options
      );
      app.enableCors({
        origin: this.origin
      });
      app.setGlobalPrefix('api/v1');

      this.buildAPIDocumentation(app);

      await app.listen(this.port);

      Logger.log(
        `Environment: ${chalk
          .hex('#87e8de')
          .bold(`${process.env.NODE_ENV?.toUpperCase()}`)}`
      );

      process.env.NODE_ENV === 'production'
        ? Logger.log(
          `✅  Server ready at http://${this.host}:${chalk
            .hex('#87e8de')
            .bold(`${this.port}`)}`
        )
        : Logger.log(
          `✅  Server is listening on port ${chalk
            .hex('#87e8de')
            .bold(`${this.port}`)}`
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
    SwaggerModule.setup('api', app, document);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
