import { get } from 'env-var';

export class Neo4jConfiguration {

  public static readonly NEO4J_SCHEME: string = get('NEO4J_SCHEME').required().asString();

  public static readonly NEO4J_HOST: string = get('NEO4J_HOST').required().asString();

  public static readonly NEO4J_PORT: number = get('NEO4J_PORT').required().asPortNumber();

  public static readonly NEO4J_USERNAME: string = get('NEO4J_USERNAME').required().asString();

  public static readonly NEO4J_PASSWORD: string = get('NEO4J_PASSWORD').required().asString();

  public static readonly NEO4J_DATABASE: string = get('NEO4J_DATABASE').asString();
}
