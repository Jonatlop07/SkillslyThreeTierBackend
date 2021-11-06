import { Global, Module } from '@nestjs/common';
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist';
import { Neo4jConfiguration } from '@infrastructure/config/neo4j.config';

@Global()
@Module({
  imports: [
    Neo4jModule.forRootAsync({
      scheme: Neo4jConfiguration.NEO4J_SCHEME as Neo4jScheme,
      host: Neo4jConfiguration.NEO4J_HOST,
      port: Neo4jConfiguration.NEO4J_PORT,
      username: Neo4jConfiguration.NEO4J_USERNAME,
      password: Neo4jConfiguration.NEO4J_PASSWORD,
      database: Neo4jConfiguration.NEO4J_DATABASE
    })
  ]
})
export class InfrastructureModule {
}
