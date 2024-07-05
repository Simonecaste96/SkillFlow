import { FriendRequest } from "./friend-request";
import { SkillInterface } from "./skill-interface";

export interface User {
    
        id: number,
        username: string,
        name: string,
        surname: string,
        dateOfBirth:Date,
        email: string,
        pictureProfile: string | null,
        interests: [],
        skills:SkillInterface [
        ],
        receivedFriendRequests:FriendRequest[],
        sentFriendRequests:FriendRequest[],
        friends:User[],
        online:boolean
    }
