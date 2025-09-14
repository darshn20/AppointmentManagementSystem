import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentRequest } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAllAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}/Appointments`);
    }

    createAppointment(appointment: CreateAppointmentRequest): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.baseUrl}/Appointments`, appointment);
    }

    updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.baseUrl}/Appointments/${id}`, appointment);
    }

    deleteAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Appointments/${id}`);
    }
}