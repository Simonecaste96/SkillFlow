export interface ChatInterface {
    sender: number ;
    recipient?:number ;
    content: string;
    timestamp: string;
    room?:{ id: number },
}
