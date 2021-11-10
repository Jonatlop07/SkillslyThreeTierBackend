import { Optional } from '@core/common/type/common_types';

export interface PermanentPostContentElement {
  description: Optional<string>;
  reference: Optional<string>;
  reference_type: Optional<string>;
}
