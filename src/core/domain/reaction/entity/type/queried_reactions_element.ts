interface Reactor{
  name: string;
  email: string;
}

export interface QueryReactionElement {
  reaction_type: string;
  reaction_count: string;
  reactors: Reactor[];
}
