import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jService } from '@infrastructure/adapter/persistence/neo4j/service/neo4j.service';
import { Neo4jTokens } from '@infrastructure/adapter/persistence/neo4j/di/neo4j.tokens';
import Neo4jConfig from '@infrastructure/adapter/persistence/neo4j/types/neo4j_config.interface';
import { createDriver } from '../../infrastructure/adapter/persistence/neo4j/utils/create_driver';

@Module({
  providers: [Neo4jService]
})
export class Neo4jModule {
  public static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        {
          provide: Neo4jTokens.Neo4jOptions,
          useValue: config
        },
        {
          provide: Neo4jTokens.Neo4jDriver,
          inject: [Neo4jTokens.Neo4jDriver],
          useFactory: async (config: Neo4jConfig) => createDriver(config)
        },
        Neo4jService,
      ],
      exports: [
        Neo4jService
      ]
    };
  }

  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        {
          provide: Neo4jTokens.Neo4jOptions,
          ...configProvider
        } as Provider<any>,
        {
          provide: Neo4jTokens.Neo4jDriver,
          inject: [Neo4jTokens.Neo4jOptions],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [
        Neo4jService,
      ]
    };
  }
}
