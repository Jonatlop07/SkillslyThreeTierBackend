import { Inject } from '@nestjs/common';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import CreateGroupGateway from '@core/domain/group/use-case/gateway/create_group.gateway';
import CreateGroupInputModel from '@core/domain/group/use-case/input-model/create_group.input_model';
import CreateGroupOutputModel from '@core/domain/group/use-case/output-model/create_group.output_model';
import { Group } from '@core/domain/group/entity/group';
import { GroupMapper } from '@core/domain/group/use-case/mapper/group.mapper';
import { GroupDTO } from '@core/domain/group/use-case/persistence-dto/group.dto';
import { InvalidGroupInfoException } from '@core/domain/group/use-case/exception/group.exception';

export class CreateGroupService implements CreateGroupInteractor{
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: CreateGroupGateway
  ){}

  async execute(
    input: CreateGroupInputModel,
  ): Promise<CreateGroupOutputModel> {
    const {
      owner_id,
      name,
      description,
      category,
      picture,
    } = input;
    const group: Group = GroupMapper.toGroup(
      input as GroupDTO
    );
    if (group.hasEmptyInfo()){
      throw new InvalidGroupInfoException();
    }
    const created_group: GroupDTO = await this.gateway.create({
      owner_id,
      name,
      description,
      category,
      picture,
    });
    return created_group as CreateGroupOutputModel;
  }
}
