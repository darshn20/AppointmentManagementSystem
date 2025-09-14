using System.Collections.Generic;
using AppointmentManagementSystem.Models;

namespace AppointmentManagementSystem.Repositories
{
    public interface IAppointmentRepository
    {
        IEnumerable<Appointment> GetAll();
        Appointment? GetById(int id);
        Appointment Add(Appointment appointment);
        bool Update(int id, Appointment appointment);
        bool Delete(int id);
        bool HasOverlappingAppointment(Appointment appointment, int? ignoreId = null);
    }
}
