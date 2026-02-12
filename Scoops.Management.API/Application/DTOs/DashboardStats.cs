namespace Scoops.Management.API.Application.DTOs
{
    public record DashboardStats(
        decimal TotalRevenue,       // Faturamento Total (Pedidos Pagos)
        int TotalOrders,            // Total de Pedidos
        int LowStockCount,          // Produtos com estoque baixo (< 5)
        int PendingOrders,          // Pedidos esperando pagamento
        List<TopProductDto> TopProducts // Os queridinhos da loja
    );

    public record TopProductDto(string Name, int QuantitySold);
}