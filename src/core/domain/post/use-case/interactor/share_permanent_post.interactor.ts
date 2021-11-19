import { Interactor } from "@core/common/use-case/interactor";
import SharePermanentPostInputModel from "../input-model/share_permanent_post.input_model";
import SharePermanentPostOutputModel from "../output-model/share_permanent_post.output_model";

export interface SharePermanentPostInteractor 
  extends Interactor<SharePermanentPostInputModel, SharePermanentPostOutputModel> {}