import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentService } from './service/appointment.service';
import { Appointment, CreateAppointmentRequest } from './models/appointment.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AppointmentFormComponent, AppointmentListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Appointment Management System';
  appointments: Appointment[] = [];
  loading = false;
  editingAppointment: Appointment | null = null;
  showForm = false;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
        alert('Failed to load appointments. Please check if the backend API is running.');
      }
    });
  }

  onShowForm() {
    this.showForm = true;
    this.editingAppointment = null;
  }

  onFormSubmit(appointmentData: CreateAppointmentRequest | Appointment) {
    if (this.editingAppointment) {
      // Update existing appointment
      const appointment = appointmentData as Appointment;
      this.appointmentService.updateAppointment(appointment.id!, appointment).subscribe({
        next: () => {
          this.loadAppointments();
          this.onFormCancel();
          alert('Appointment updated successfully!');
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          alert('Failed to update appointment. Please try again.');
        }
      });
    } else {
      // Create new appointment
      const newAppointment = appointmentData as CreateAppointmentRequest;
      this.appointmentService.createAppointment(newAppointment).subscribe({
        next: () => {
          this.loadAppointments();
          this.onFormCancel();
          alert('Appointment booked successfully!');
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          alert('Failed to book appointment. Please try again.');
        }
      });
    }
  }

  onFormCancel() {
    this.showForm = false;
    this.editingAppointment = null;
  }

  onEditAppointment(appointment: Appointment) {
    this.editingAppointment = appointment;
    this.showForm = true;
  }

  onDeleteAppointment(id: number) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.loadAppointments();
        alert('Appointment cancelled successfully!');
      },
      error: (error) => {
        console.error('Error deleting appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    });
  }
}
