import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appointment.model';

@Component({
    selector: 'app-appointment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
    @Input() appointments: Appointment[] = [];
    @Input() loading = false;
    @Output() editAppointment = new EventEmitter<Appointment>();
    @Output() deleteAppointment = new EventEmitter<number>();

    onEdit(appointment: Appointment) {
        this.editAppointment.emit(appointment);
    }

    onDelete(id: number) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            this.deleteAppointment.emit(id);
        }
    }

    formatDateTime(dateTime: string): string {
        return new Date(dateTime).toLocaleString();
    }

    formatDate(dateTime: string): string {
        const date = new Date(dateTime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    formatTime(dateTime: string): string {
        return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}