import { UserDITokens } from "@core/domain/user/di/user_di_tokens";
import { UserAccountNotFoundException } from "@core/domain/user/use-case/exception/user_account.exception";
import { UserFollowRelationshipNotFoundException, UserFollowRequestInvalidDataFormatException, UserFollowRequestNotFoundException } from "@core/domain/user/use-case/exception/user_follow_request.exception";
import DeleteUserFollowRequestGateway from "@core/domain/user/use-case/gateway/delete_user_follow_request.gateway";
import DeleteUserFollowRequestInputModel from "@core/domain/user/use-case/input-model/delete_user_follow_request.input_model";
import { DeleteUserFollowRequestInteractor } from "@core/domain/user/use-case/interactor/delete_user_follow_request.interactor";
import DeleteUserFollowRequestOutputModel from "@core/domain/user/use-case/output-model/delete_user_follow_request.output_model";
import { Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class DeleteUserFollowRequestService implements DeleteUserFollowRequestInteractor {
  private readonly logger: Logger = new Logger(DeleteUserFollowRequestService.name);

  constructor(
    @Inject(UserDITokens.UserRepository)
    private user_gateway: DeleteUserFollowRequestGateway,
  ) { }

  async execute(
    input: DeleteUserFollowRequestInputModel,
  ): Promise<DeleteUserFollowRequestOutputModel> {
    const existsUser = await this.user_gateway.existsById(input.user_id);
    if (!existsUser) {
      throw new UserAccountNotFoundException();
    }
    const existsDestinyUser = await this.user_gateway.existsById(input.user_destiny_id);
    if (!existsDestinyUser){
      throw new UserAccountNotFoundException();
    }
    const existsUserFollowRequest = await this.user_gateway.existsUserFollowRequest(input);
    if (!existsUserFollowRequest && input.action=='request') {
      throw new UserFollowRequestNotFoundException();
    }
    const existsUserFollowRelationShip = await this.user_gateway.existsUserFollowRelationship(input);
    if (!existsUserFollowRelationShip && input.action=='relationship') {
      throw new UserFollowRelationshipNotFoundException();
    }
    const actionIsValid = input.action == 'request' || input.action == 'relationship'; 
    if (!actionIsValid) {
      throw new UserFollowRequestInvalidDataFormatException(); 
    }
    const result = await this.user_gateway.deleteUserFollowRequest(input);
    return result; 
  }
}