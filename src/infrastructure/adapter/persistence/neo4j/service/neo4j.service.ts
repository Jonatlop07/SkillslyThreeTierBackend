import { Inject, Injectable } from '@nestjs/common';
import { Driver, QueryResult, Result, session, Session } from 'neo4j-driver';
import { Neo4jTokens } from '@infrastructure/adapter/persistence/neo4j/di/neo4j.tokens';
import Neo4jConfig from '@infrastructure/adapter/persistence/neo4j/types/neo4j_config.interface';

@Injectable()
export class Neo4jService {
  constructor(
    @Inject(Neo4jTokens.Neo4jOptions)
    private readonly config: Neo4jConfig,
    @Inject(Neo4jTokens.Neo4jDriver)
    private readonly driver: Driver,
  ) {}

  public getSingleResultProperties = (result: QueryResult, key: string) => {
    if (result.records && result.records[0] && result.records[0].get(key)) {
      return result.records[0]?.get(key).properties;
    }
    return;

  };

  public getSingleResultProperty = (result: QueryResult, key: string) => {
    if (result.records && result.records[0]) {
      return result.records[0].get(key);
    }
    return;

  };

  public getMultipleResultByKey = (result: QueryResult, key: string) => {
    if (result.records && result.records[0]) {
      return result.records.map((record) => record.get(key) ? record.get(key).properties : null);
    }
    return [];
  };


  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  getReadSession(database?: string): Session {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: session.READ,
    });
  }

  getWriteSession(database?: string): Session {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: session.WRITE,
    });
  }

  read(cypher: string, params: Record<string, any>, database?: string): Result {
    const session = this.getReadSession(database);
    return session.run(cypher, params);
  }

  write(
    cypher: string,
    params: Record<string, any>,
    database?: string,
  ): Result {
    const session = this.getWriteSession(database);
    return session.run(cypher, params);
  }
}
