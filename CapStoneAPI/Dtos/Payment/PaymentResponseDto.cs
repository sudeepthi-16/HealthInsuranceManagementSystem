namespace CapStoneAPI.Dtos.Payment
{
    public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public string? HospitalName { get; set; }
        public int? ClaimId { get; set; }

        public string CustomerCode { get;set; }
        public string UserFullName { get; set; }
        public decimal Amount { get; set; }
        public string PaymentType { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
