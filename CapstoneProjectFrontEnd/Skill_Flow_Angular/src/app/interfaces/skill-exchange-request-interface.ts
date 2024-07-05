import { Time } from "@angular/common";


export interface SkillExchangeRequestInterface {
    id?: number; 
  requester: number
  responder: number;
  details: string;
  status?: string;
  appointmentDate:string,
  appointmentTime:string
}
