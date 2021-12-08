import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserAccountNotFoundException } from '@core/domain/user/use-case/exception/user_account.exception';
import { UserFollowRelationshipNotFoundException, UserFollowRequestInvalidDataFormatException, UserFollowRequestNotFoundException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import DeleteUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/delete_user_follow_request.gateway';
import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import { DeleteUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/delete_user_follow_request.interactor';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/delete_user_follow_request.output_model';
import { FollowRequestDTO } from '@core/domain/user/use-case/persistence-dto/follow_request.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';

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
    if (!existsUserFollowRequest && input.isRequest) {
      throw new UserFollowRequestNotFoundException();
    }
    const existsUserFollowRelationShip = await this.user_gateway.existsUserFollowRelationship(input);
    if (!existsUserFollowRelationShip && !input.isRequest) {
      throw new UserFollowRelationshipNotFoundException();
    }
    const actionIsValid = input.isRequest == true || input.isRequest == false; 
    if (!actionIsValid) {
      throw new UserFollowRequestInvalidDataFormatException(); 
    }
    if(input.isRequest){
      const result = await this.user_gateway.deleteUserFollowRequest(input);
      return result; 
    } else {
      const result = await this.user_gateway.deleteUserFollowRelationship(input);
      return result; 
    }
  }
}