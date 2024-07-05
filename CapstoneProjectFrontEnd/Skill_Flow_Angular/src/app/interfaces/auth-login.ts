import { User } from "./user"
import { SkillInterface } from "./skill-interface"
import { FriendRequest } from "./friend-request"
export interface AuthLogin {
    token : string,
    user: {
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
        friends:User[]
        online:boolean
}
}
