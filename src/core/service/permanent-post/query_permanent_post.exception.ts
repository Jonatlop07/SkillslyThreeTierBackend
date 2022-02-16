abstract class QueryPermanentPostException extends Error {}

class QueryPermanentPostUnexistingPostException extends QueryPermanentPostException {}
class QueryPermanentPostUnexistingUserException extends QueryPermanentPostException {}


export {
  QueryPermanentPostException,
  QueryPermanentPostUnexistingPostException,
  QueryPermanentPostUnexistingUserException
};