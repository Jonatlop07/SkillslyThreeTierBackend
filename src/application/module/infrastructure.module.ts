import { Global, Module } from '@nestjs/common';
import { Neo4jModule } from '@application/module/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Neo4jConfig from '@infrastructure/adapter/persistence/neo4j/types/neo4j_config.interface';

@Global()
@Module({
  imports: [
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config_service: ConfigService): Neo4jConfig => ({
        scheme: config_service.get('DATABASE_SCHEME'),
        host: config_service.get('DATABASE_HOST'),
        port: config_service.get('DATABASE_PORT'),
        username: config_service.get('DATABASE_USERNAME'),
        password: config_service.get('DATABASE_PASSWORD'),
        database: config_service.get('DATABASE_DATABASE'),
      })
    }),
  ]
})
export class InfrastructureModule {}
