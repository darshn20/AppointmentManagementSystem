using AppointmentManagementSystem.Models;

namespace AppointmentManagementSystem.Repositories
{
    public class InMemoryAppointmentRepository : IAppointmentRepository
    {
        private readonly List<Appointment> _appointments = new();
        private int _nextId = 1;

        public InMemoryAppointmentRepository()
        {
            _appointments.AddRange(new[]
            {
                new Appointment
                {
                    Id = _nextId++,
                    PatientName = "Darshan",
                    DoctorName = "Dr. Lakhani",
                    StartTime = new DateTime(2024, 6, 1, 9, 0, 0),
                    EndTime = new DateTime(2024, 6, 1, 9, 30, 0)
                },
                new Appointment
                {
                    Id = _nextId++,
                    PatientName = "Suresh Gupta",
                    DoctorName = "Dr. Agarwal",
                    StartTime = new DateTime(2024, 6, 1, 10, 0, 0),
                    EndTime = new DateTime(2024, 6, 1, 10, 30, 0)
                },
                new Appointment
                {
                    Id = _nextId++,
                    PatientName = "Ramesh Mehta",
                    DoctorName = "Dr. Agarwal",
                    StartTime = new DateTime(2024, 6, 2, 11, 0, 0),
                    EndTime = new DateTime(2024, 6, 2, 11, 45, 0)
                }
            });
        }

        public IEnumerable<Appointment> GetAll() => _appointments;

        public Appointment? GetById(int id) => _appointments.FirstOrDefault(a => a.Id == id);

        public Appointment Add(Appointment appointment)
        {
            appointment.Id = _nextId++;
            _appointments.Add(appointment);
            return appointment;
        }

        public bool Update(int id, Appointment appointment)
        {
            var existing = GetById(id);
            if (existing == null) return false;
            existing.PatientName = appointment.PatientName;
            existing.DoctorName = appointment.DoctorName;
            existing.StartTime = appointment.StartTime;
            existing.EndTime = appointment.EndTime;
            return true;
        }

        public bool Delete(int id)
        {
            var appointment = GetById(id);
            if (appointment == null) return false;
            _appointments.Remove(appointment);
            return true;
        }

        public bool HasOverlappingAppointment(Appointment appointment, int? ignoreId = null)
        {
            return _appointments.Any(a => a.DoctorName == appointment.DoctorName &&
                (!ignoreId.HasValue || a.Id != ignoreId.Value) &&
                ((appointment.StartTime < a.EndTime) && (appointment.EndTime > a.StartTime)));
        }
    }
}
