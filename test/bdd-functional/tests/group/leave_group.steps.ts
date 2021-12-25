import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { GroupException, OnlyOwnerLeavingGroupException } from '@core/domain/group/use-case/exception/group.exception';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { LeaveGroupInteractor } from '@core/domain/group/use-case/interactor/leave_group.interactor';
import LeaveGroupOutputModel from '@core/domain/group/use-case/output-model/leave_group.output_model';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import { UpdateGroupUserInteractor } from '@core/domain/group/use-case/interactor/join-request/update_group_user.interactor';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/group/leave_group.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let group_id: string;
  let owner_id: string;
  let group_request_user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let create_join_group_request_interactor: CreateJoinGroupRequestInteractor;
  let accept_deny_remove_user_interactor: UpdateGroupUserInteractor;
  let leave_group_interactor: LeaveGroupInteractor;

  let output: LeaveGroupOutputModel;
  let exception: GroupException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given('a user exists', async () => {
      await createUserAccount(user_1_mock);
    });
  }

  function andAGroupIdentifiedByIdExists(and) {
    and(/^there exists a group identified by "([^"]*)", owned by user with id "([^"]*)", with info being:$/,
      async (existing_group_id, group_owner_id, group_info) => {
        try {
          owner_id = group_owner_id;
          await create_group_interactor.execute({
            owner_id: group_owner_id,
            name: group_info[0].name,
            description: group_info[0].description,
            category: group_info[0].category,
            picture: group_info[0].picture
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andUserIsPartOfGroup(and) {
    and(/^a user identified by "([^"]*)" is part of the group with id "([^"]*)"$/,
      async (group_user_id, group_id) => {
        try {
          group_request_user_id = group_user_id;
          group_id = group_id;
          await create_join_group_request_interactor.execute({
            user_id: group_request_user_id,
            group_id: group_id
          });
          await accept_deny_remove_user_interactor.execute({
            owner_id: owner_id,
            user_id: group_request_user_id,
            group_id: group_id,
            action: 'accept'
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAGroupIdIsProvided(and) {
    and(/^the user provides the group identified by "([^"]*)"$/,
      (provided_group_id) => {
        group_id = provided_group_id;
      }
    );
  }

  function whenUserTriesToLeaveTheGroup(when) {
    when('the user tries to leave the group', async () => {
      try {
        output = await leave_group_interactor.execute({
          user_id: user_id,
          group_id: group_id
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_group_interactor = module.get<CreateGroupInteractor>(GroupDITokens.CreateGroupInteractor);
    create_join_group_request_interactor = module.get<CreateJoinGroupRequestInteractor>(GroupDITokens.CreateJoinGroupRequestInteractor);
    accept_deny_remove_user_interactor = module.get<UpdateGroupUserInteractor>(GroupDITokens.UpdateGroupUserInteractor);
    leave_group_interactor = module.get<LeaveGroupInteractor>(GroupDITokens.LeaveGroupInteractor);
    exception = undefined;
  });

  test('A user leaves a group',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andUserIsPartOfGroup(and);
      andAGroupIdIsProvided(and);
      whenUserTriesToLeaveTheGroup(when);

      then(
        'the user is not part of the group anymore',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );

  test('A user tries to leave a group but its the only owner of the group',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andAGroupIdIsProvided(and);
      whenUserTriesToLeaveTheGroup(when);

      then(
        'an error occurs: there must be more than one owner so the current owner can leave the group',
        () => {
          expect(exception).toBeInstanceOf(OnlyOwnerLeavingGroupException);
        }
      );
    }
  );
});
