import Share from "@core/common/persistence/share";
import { PermanentPostDTO } from "../persistence-dto/permanent_post.dto";
import PermanentPostQueryModel from "../query-model/permanent_post.query_model";

export interface SharePermanentPostGateway extends Share<PermanentPostQueryModel> {}