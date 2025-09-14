using AppointmentManagementSystem.Models;
using AppointmentManagementSystem.Repositories;
using AppointmentManagementSystem.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AppointmentManagementSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _repository;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(IAppointmentRepository repository, ILogger<AppointmentsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        private static AppointmentDto ToDto(Appointment a) => new AppointmentDto
        {
            Id = a.Id,
            PatientName = a.PatientName,
            DoctorName = a.DoctorName,
            StartTime = a.StartTime,
            EndTime = a.EndTime
        };

        private static Appointment ToEntity(AppointmentDto dto) => new Appointment
        {
            Id = dto.Id,
            PatientName = dto.PatientName,
            DoctorName = dto.DoctorName,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };

        [HttpGet]
        public ActionResult<IEnumerable<AppointmentDto>> GetAll()
        {
            try
            {
                var dtos = _repository.GetAll().Select(ToDto);
                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all appointments.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public ActionResult<AppointmentDto> Create(AppointmentDto appointmentDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(appointmentDto.PatientName) ||
                    string.IsNullOrWhiteSpace(appointmentDto.DoctorName) ||
                    appointmentDto.StartTime == default ||
                    appointmentDto.EndTime == default ||
                    appointmentDto.EndTime <= appointmentDto.StartTime)
                {
                    _logger.LogWarning("Invalid appointment data received in Create.");
                    return BadRequest("All fields are required and EndTime must be after StartTime.");
                }

                var appointment = ToEntity(appointmentDto);
                if (_repository.HasOverlappingAppointment(appointment))
                {
                    _logger.LogWarning("Overlapping appointment detected for doctor {DoctorName}.", appointment.DoctorName);
                    return Conflict("Overlapping appointment for this doctor.");
                }

                var created = _repository.Add(appointment);
                return CreatedAtAction(nameof(GetAll), new { id = created.Id }, ToDto(created));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating an appointment.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPut("{id}")]
        public ActionResult Update(int id, AppointmentDto updatedDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(updatedDto.PatientName) ||
                    string.IsNullOrWhiteSpace(updatedDto.DoctorName) ||
                    updatedDto.StartTime == default ||
                    updatedDto.EndTime == default ||
                    updatedDto.EndTime <= updatedDto.StartTime)
                {
                    _logger.LogWarning("Invalid appointment data received in Update for id {Id}.", id);
                    return BadRequest("All fields are required and EndTime must be after StartTime.");
                }

                var updated = ToEntity(updatedDto);
                if (_repository.HasOverlappingAppointment(updated, id))
                {
                    _logger.LogWarning("Overlapping appointment detected for doctor {DoctorName} on update.", updated.DoctorName);
                    return Conflict("Overlapping appointment for this doctor.");
                }

                var success = _repository.Update(id, updated);
                if (!success)
                {
                    _logger.LogWarning("Appointment with id {Id} not found for update.", id);
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating appointment with id {Id}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                var success = _repository.Delete(id);
                if (!success)
                {
                    _logger.LogWarning("Appointment with id {Id} not found for deletion.", id);
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting appointment with id {Id}.", id);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
