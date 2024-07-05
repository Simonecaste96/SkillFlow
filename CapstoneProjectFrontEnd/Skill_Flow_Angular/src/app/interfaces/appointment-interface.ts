export interface Appointment {
    id?: number;
    appointmentDate: string;
    appointmentTime: string;
    skillExchangeRequest: {
        requester: {
            id: number;
            name: string;
            surname: string;
            pictureProfile: string;
        };
        details: string;
    };
}
