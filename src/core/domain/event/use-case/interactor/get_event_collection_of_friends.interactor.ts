import { Interactor } from "@core/common/use-case/interactor";
import GetEventCollectionOfFriendsInputModel from "../input-model/get_my_event_collection.input_model";
import GetEventCollectionOfFriendsOutputModel from "../output-model/get_my_event_collection.output_model";

export interface GetEventCollectionOfFriendsInteractor
extends Interactor<GetEventCollectionOfFriendsInputModel, GetEventCollectionOfFriendsOutputModel> {}