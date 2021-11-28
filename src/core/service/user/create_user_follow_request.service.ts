import { tsImportEqualsDeclaration } from "@babel/types";
import { NonExistentUserException } from "@core/domain/post/use-case/exception/permanent_post.exception";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import CreateUserFollowRequestGateway from "@core/domain/user/use-case/gateway/create_user_follow_request.gateway";
import CreateUserFollowRequestInputModel from "@core/domain/user/use-case/input-model/create_user_follow_request.input_model";
import { CreateUserFollowRequestInteractor } from "@core/domain/user/use-case/interactor/create_user_follow_request.interactor";
import CreateUserFollowRequestOutputModel from "@core/domain/user/use-case/output-model/create_user_follow_request.output_model";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserFollowRequestAlreadyExistsException } from '@core/domain/user/use-case/exception/user_follow_request.exception';


@Injectable()
export class CreateUserFollowRequestService implements CreateUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(CreateUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: CreateUserFollowRequestGateway,
  ) { }

  async execute(
    input: CreateUserFollowRequestInputModel,
  ): Promise<CreateUserFollowRequestOutputModel> {
    const existsUser = await this.user_gateway.existsById(input.user_id);
    console.log(existsUser)
    if (!existsUser) {
      throw new NonExistentUserException();
    }
    const existsDestinyUser = await this.user_gateway.existsById(input.user_destiny_id);
    if (!existsDestinyUser){
      throw new NonExistentUserException();
    }
    const existsUserFollowRequest = await this.user_gateway.existsUserFollowRequest(input);
    console.log(existsUserFollowRequest)
    if(existsUserFollowRequest){
      throw new UserFollowRequestAlreadyExistsException();
    }
    const result = await this.user_gateway.createUserFollowRequest(input);
    console.log(result)
    return result; 
  }
}