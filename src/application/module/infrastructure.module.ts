import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from '@application/module/neo4j.module';
import Neo4jConfig from '@infrastructure/adapter/persistence/neo4j/types/neo4j_config.interface';
import { Neo4jScheme } from '@infrastructure/adapter/persistence/neo4j/types/neo4j_scheme';

@Global()
@Module({
  imports: [
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config_service: ConfigService): Neo4jConfig => ({
        scheme: config_service.get<Neo4jScheme>('DATABASE_SCHEME'),
        host: config_service.get<string>('DATABASE_HOST'),
        port: config_service.get<number>('DATABASE_PORT'),
        username: config_service.get<string>('DATABASE_USERNAME'),
        password: config_service.get<string>('DATABASE_PASSWORD'),
        database: config_service.get<string>('DATABASE_DATABASE'),
      })
    }),
  ]
})
export class InfrastructureModule {}
