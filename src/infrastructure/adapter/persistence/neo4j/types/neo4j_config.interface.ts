import { Neo4jScheme } from './neo4j_scheme';

export default interface Neo4jConfig {
  scheme: Neo4jScheme;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database?: string;
}
