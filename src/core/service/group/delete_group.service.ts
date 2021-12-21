import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupDTO } from '@core/domain/group/use-case/persistence-dto/group.dto';
import { DeleteGroupInteractor } from '@core/domain/group/use-case/interactor/delete_group.interactor';
import DeleteGroupInputModel from '@core/domain/group/use-case/input-model/delete_group.input_model';
import DeleteGroupOutputModel from '@core/domain/group/use-case/output-model/delete_group.output_model';
import DeleteGroupGateway from '@core/domain/group/use-case/gateway/delete_group.gateway';
import { UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';

export class DeleteGroupService implements DeleteGroupInteractor{
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: DeleteGroupGateway
  ){}

  public async execute(input: DeleteGroupInputModel): Promise<DeleteGroupOutputModel> {
    const user_is_owner = await this.gateway.userIsOwner({ group_id: input.id, user_id: input.user_id });
    if (!user_is_owner)
      throw new UnauthorizedGroupEditorException();
    const deleted_group: GroupDTO = await this.gateway.deleteById(input.id);
    return {
      id: deleted_group.id,
      name: deleted_group.name
    };
  }
}
