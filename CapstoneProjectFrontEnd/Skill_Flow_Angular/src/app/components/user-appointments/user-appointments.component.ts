import { Component } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/interfaces/appointment-interface';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrl: './user-appointments.component.scss'
})
export class UserAppointmentsComponent {
  appointments!:Appointment[];
  userId!:number | undefined;
  userIdParam!:string;


  constructor(private appointmentService: AppointmentService, private authService:AuthService, private route:ActivatedRoute) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.userIdParam = id!;
    });

    this.authService.user$.subscribe(user => {
      this.userId = user?.user.id
      console.log(this.userId);
    });
    this.appointmentService.getAppointments(this.userId!).subscribe(
      (data) => {
        this.appointments = data;
        console.log(this.appointments);
      },
      (error) => {
        console.error('Errore nel caricamento degli appuntamenti', error);
      }
    );
  }
}
