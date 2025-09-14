namespace AppointmentManagementSystem.Dtos
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string DoctorName { get; set; } = string.Empty;
    }
}