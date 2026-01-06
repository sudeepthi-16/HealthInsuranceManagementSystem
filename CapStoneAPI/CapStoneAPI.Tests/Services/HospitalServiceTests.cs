using CapStoneAPI.Dtos;
using CapStoneAPI.DTOs.Admin;
using CapStoneAPI.Models;
using CapStoneAPI.Repositories.Interfaces;
using CapStoneAPI.Services;
using Moq;
using Xunit;

namespace CapStoneAPI.Tests.Services
{
    public class HospitalServiceTests
    {
        private readonly Mock<IHospitalRepository> _mockRepo;
        private readonly HospitalService _service;

        public HospitalServiceTests()
        {
            _mockRepo = new Mock<IHospitalRepository>();
            _service = new HospitalService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetHospitalsAsync_Admin_ReturnsAllSorted()
        {
            // Arrange
            var hospitals = new List<Hospital>
            {
                new Hospital { HospitalName = "Beta", IsActive = true },
                new Hospital { HospitalName = "Alpha", IsActive = false }
            };
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(hospitals);

            // Act
            var result = (IEnumerable<dynamic>)await _service.GetHospitalsAsync(true);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("Alpha", result.First().HospitalName);
        }

        [Fact]
        public async Task GetHospitalsAsync_Public_ReturnsActiveOnly()
        {
            // Arrange
            var hospitals = new List<Hospital>
            {
                new Hospital { HospitalName = "Beta", IsActive = true },
                new Hospital { HospitalName = "Alpha", IsActive = false }
            };
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(hospitals);

            // Act
            var result = await _service.GetHospitalsAsync(false);

            // Assert
            Assert.Single(result);
        }

        [Fact]
        public async Task CreateHospitalAsync_Valid_CreatesHospital()
        {
            // Arrange
            var dto = new CreateHospitalDto { HospitalName = "Test", City = "City", IsNetworkHospital = true };

            // Act
            await _service.CreateHospitalAsync(dto);

            // Assert
            _mockRepo.Verify(r => r.AddAsync(It.Is<Hospital>(h =>
                h.HospitalName == dto.HospitalName &&
                h.IsActive == true
            )), Times.Once);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateHospitalAsync_Valid_UpdatesHospital()
        {
            // Arrange
            var hospital = new Hospital { HospitalId = 1, HospitalName = "Old" };
            var dto = new CreateHospitalDto { HospitalName = "New", City = "NewCity", IsNetworkHospital = false };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(hospital);

            // Act
            await _service.UpdateHospitalAsync(1, dto);

            // Assert
            Assert.Equal("New", hospital.HospitalName);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateHospitalStatusAsync_Valid_UpdatesStatus()
        {
            // Arrange
            var hospital = new Hospital { HospitalId = 1, IsActive = true };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(hospital);

            // Act
            await _service.UpdateHospitalStatusAsync(1, false);

            // Assert
            Assert.False(hospital.IsActive);
            _mockRepo.Verify(r => r.SaveAsync(), Times.Once);
        }
    }
}
