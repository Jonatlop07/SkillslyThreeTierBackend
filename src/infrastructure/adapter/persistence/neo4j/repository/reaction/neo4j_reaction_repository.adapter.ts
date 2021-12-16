import { QueryReactionElement } from '@core/domain/reaction/entity/type/queried_reactions_element';
import { ReactionDTO } from '@core/domain/reaction/use_case/persistence-dto/reaction.dto';
import ReactionQueryModel from '@core/domain/reaction/use_case/query-model/reaction.query_model';
import { ReactionRepository } from '@core/domain/reaction/use_case/repository/reaction.repository';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { QueryResult } from 'neo4j-driver-core';
import { Relationships } from '../../constants/relationships';
import { Neo4jService } from '../../service/neo4j.service';

@Injectable()
export class ReactionNeo4jRepositoryAdapter implements ReactionRepository{

  reaction_key = 'reaction';
  post_key = 'post';
  constructor(private neo4jService: Neo4jService){}

  async delete(params: ReactionQueryModel): Promise<ReactionDTO> {
    const {reactor_id, post_id} = params;
    const remove_reaction_statement = `
      MATCH (u: User { user_id: $reactor_id})-[r:${Relationships.REACTION_TYPES_RELATIONSHIP}]->(p: PermanentPost{post_id: $post_id}) 
      DELETE r
      RETURN u.user_id AS reactor_id, p.post_id AS post_id, TYPE(r) AS reaction_type
      `;
    const remove_result: QueryResult = await this.neo4jService.write(remove_reaction_statement, {
      reactor_id,
      post_id
    });
    return {
      post_id: this.neo4jService.getSingleResultProperty(remove_result, 'post_id'),
      reactor_id: this.neo4jService.getSingleResultProperty(remove_result, 'reactor_id'),
      reaction_type: this.neo4jService.getSingleResultProperty(remove_result, 'reaction_type'),
    };
  }

  async create(reaction: ReactionDTO): Promise<ReactionDTO> {
    const reaction_type = reaction.reaction_type.toUpperCase();
    const {reactor_id, post_id} = reaction;
    const created_at = moment().local().format('YYYY/MM/DD HH:mm:ss');
    const add_reaction_statement = `
      MATCH (u: User),(p: PermanentPost) 
      WHERE u.user_id = $reactor_id AND p.post_id = $post_id
      CREATE (u)-[r:${reaction_type} {created_at: $created_at}]->(p)
      RETURN u.user_id AS reactor, p.post_id AS post, TYPE(r) as type, r.created_at AS reaction_date
    `;
    const add_result: QueryResult = await this.neo4jService.write(add_reaction_statement, {
      reactor_id,
      post_id,
      created_at
    });
    return {
      post_id: this.neo4jService.getSingleResultProperty(add_result, 'post'),
      reactor_id: this.neo4jService.getSingleResultProperty(add_result, 'reactor'),
      reaction_type: this.neo4jService.getSingleResultProperty(add_result, 'type'),
      created_at: this.neo4jService.getSingleResultProperty(add_result, 'reaction_date')
    };
  }

  async findOne(params: ReactionQueryModel): Promise<ReactionDTO> {
    const {post_id, reactor_id} = params;
    const exists_reaction_statement = `
      MATCH (u: User { user_id:$reactor_id})-[r:${Relationships.REACTION_TYPES_RELATIONSHIP}]->(p: PermanentPost{post_id:$post_id}) 
      RETURN u.user_id AS reactor_id, p.post_id AS post_id, TYPE(r) AS reaction_type
    `;
    const reaction_result: QueryResult = await this.neo4jService.read(exists_reaction_statement, {
      reactor_id,
      post_id
    });
    return {
      reactor_id: this.neo4jService.getSingleResultProperty(reaction_result, 'reactor_id'),
      post_id: this.neo4jService.getSingleResultProperty(reaction_result, 'post_id'),
      reaction_type: this.neo4jService.getSingleResultProperty(reaction_result, 'reaction_type')
    };
  }
  public findAllWithRelation() {
    return null;
  }


  async queryById(id: string): Promise<QueryReactionElement[]> {
    const query_reactions_statement = `
      MATCH (u:User)-[r:${Relationships.REACTION_TYPES_RELATIONSHIP}]->(p:PermanentPost {post_id:$id}) 
      RETURN type(r) as reaction_type, count(*) as reaction_count, collect({name:u.name, email:u.email}) as reactors
    `;
    const query_reactions_result = await this.neo4jService.read(query_reactions_statement, {
      id 
    }).then(
      (result: QueryResult) => result.records.map((record:any) =>
        record._fields
      ));
    const reactions = [];
    for (const reaction of query_reactions_result){
      const result: QueryReactionElement = {
        reaction_type: reaction[0],
        reaction_count: reaction[1]['low'],
        reactors: reaction[2]
      };
      reactions.push(result);
    }
    return reactions as QueryReactionElement[];
  }

  findOneByParam(param: string, value: any): Promise<ReactionDTO> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: string): Promise<ReactionDTO> {
    throw new Error('Method not implemented.');
  }

  findAll(params: ReactionQueryModel): Promise<ReactionDTO[]> {
    throw new Error('Method not implemented.');
  }
  
}