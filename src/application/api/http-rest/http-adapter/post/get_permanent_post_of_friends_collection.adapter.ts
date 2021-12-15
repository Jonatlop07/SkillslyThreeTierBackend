import GetPermanentPostCollectionOfFriendsInputModel from "@core/domain/post/use-case/input-model/get_permanent_post_collection_of_friends.steps";
import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class GetPermanentPostOfFriendsCollectionAdapter implements GetPermanentPostCollectionOfFriendsInputModel{

  @Expose()
  @IsString()
  public user_id: string;

  @Expose()
  @IsNumber()
  public limit: number;

  @Expose()
  @IsNumber()
  public offset: number;

  public static new(
    payload: GetPermanentPostCollectionOfFriendsInputModel,
  ): GetPermanentPostOfFriendsCollectionAdapter {
    return plainToClass(GetPermanentPostOfFriendsCollectionAdapter, payload);
  }
}