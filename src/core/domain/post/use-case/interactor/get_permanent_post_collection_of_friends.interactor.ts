import { Interactor } from '@core/common/use-case/interactor';
import GetPermanentPostCollectionOfFriendsInputModel from '@core/domain/post/use-case/input-model/get_permanent_post_collection_of_friends.steps';
import GetPermanentPostCollectionOfFriendsOutputModel from '@core/domain/post/use-case/output-model/get_permanent_post_collection_of_friends.steps';

export interface GetPermanentPostCollectionOfFriendsInteractor
extends Interactor<GetPermanentPostCollectionOfFriendsInputModel, GetPermanentPostCollectionOfFriendsOutputModel> {}