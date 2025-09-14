export interface Appointment {
    id?: number;
    patientName: string;
    doctorName: string;
    startTime: string;
    endTime: string;
}

export interface CreateAppointmentRequest {
    patientName: string;
    doctorName: string;
    startTime: string;
    endTime: string;
}