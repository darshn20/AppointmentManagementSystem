import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Appointment, CreateAppointmentRequest } from '../../models/appointment.model';

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './appointment-form.component.html',
    styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
    @Input() appointment: Appointment | null = null;
    @Output() formSubmit = new EventEmitter<CreateAppointmentRequest | Appointment>();
    @Output() formCancel = new EventEmitter<void>();

    appointmentForm: FormGroup;
    isEditMode = false;

    constructor(private fb: FormBuilder) {
        this.appointmentForm = this.createForm();
    }

    ngOnInit() {
        if (this.appointment) {
            this.isEditMode = true;
            this.populateForm();
        }
    }

    private createForm(): FormGroup {
        return this.fb.group({
            patientName: ['', [Validators.required, Validators.minLength(2)]],
            doctorName: ['', [Validators.required, Validators.minLength(2)]],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required]
        });
    }

    private populateForm() {
        if (this.appointment) {
            this.appointmentForm.patchValue({
                patientName: this.appointment.patientName,
                doctorName: this.appointment.doctorName,
                startTime: this.formatDateTimeForInput(this.appointment.startTime),
                endTime: this.formatDateTimeForInput(this.appointment.endTime)
            });
        }
    }

    private formatDateTimeForInput(dateTime: string): string {
        return new Date(dateTime).toISOString().slice(0, 16);
    }

    onSubmit() {
        if (this.appointmentForm.valid) {
            const formValue = this.appointmentForm.value;

            if (this.isEditMode && this.appointment) {
                const updatedAppointment: Appointment = {
                    ...this.appointment,
                    ...formValue,
                    startTime: new Date(formValue.startTime).toISOString(),
                    endTime: new Date(formValue.endTime).toISOString()
                };
                this.formSubmit.emit(updatedAppointment);
            } else {
                const newAppointment: CreateAppointmentRequest = {
                    ...formValue,
                    startTime: new Date(formValue.startTime).toISOString(),
                    endTime: new Date(formValue.endTime).toISOString()
                };
                this.formSubmit.emit(newAppointment);
            }
        }
    }

    onCancel() {
        this.formCancel.emit();
    }

    get patientName() { return this.appointmentForm.get('patientName'); }
    get doctorName() { return this.appointmentForm.get('doctorName'); }
    get startTime() { return this.appointmentForm.get('startTime'); }
    get endTime() { return this.appointmentForm.get('endTime'); }
}