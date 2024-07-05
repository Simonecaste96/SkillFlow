  import { User } from "./user";

export interface SkillExchangeResponse {
  
  id: number,
  requester:  User,
  responder:  User,
  details: string,


}
