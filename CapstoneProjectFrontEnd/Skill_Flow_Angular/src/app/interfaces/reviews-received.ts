export interface ReviewsReceived {
    id?: number;
    reviewed: number
    reviewer:{id:number, name:string, surname:string, pictureProfile:string};
    reviewText: string;
    rating:number
}
