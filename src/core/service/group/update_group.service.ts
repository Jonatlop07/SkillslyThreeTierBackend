import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { InvalidGroupInfoException, UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';
import { UpdateGroupInteractor } from '@core/domain/group/use-case/interactor/update_group.interactor';
import UpdateGroupInputModel from '@core/domain/group/use-case/input-model/update_group.input_model';
import UpdateGroupOutputModel from '@core/domain/group/use-case/output-model/update_group.output_model';
import UpdateGroupGateway from '@core/domain/group/use-case/gateway/update_group.gateway';
import { GroupDTO } from '@core/domain/group/use-case/persistence-dto/group.dto';

export class UpdateGroupService implements UpdateGroupInteractor{
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: UpdateGroupGateway
  ){}

  async execute(
    input: UpdateGroupInputModel,
  ): Promise<UpdateGroupOutputModel> {
    const group_to_update: GroupDTO = {
      id: input.id,
      owner_id: input.user_id,
      name: input.name,
      description: input.description,
      category: input.category,
      picture: input.picture
    };
    const user_is_owner = await this.gateway.userIsOwner({ group_id: input.id, user_id: input.user_id });
    if (!user_is_owner){
      throw new UnauthorizedGroupEditorException();
    }
    if (!input.name || !input.description || !input.category){
      throw new InvalidGroupInfoException();
    }
    const updated_group = await this.gateway.update(group_to_update);    
    return updated_group as UpdateGroupOutputModel;
  }
}
