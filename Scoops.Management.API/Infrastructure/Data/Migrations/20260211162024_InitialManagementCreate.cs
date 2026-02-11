using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scoops.Management.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialManagementCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tb_products",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tb_products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tb_suppliers",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cnpj = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tb_suppliers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tb_deliveries",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Moment = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SupplierId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tb_deliveries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tb_deliveries_tb_suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "tb_suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tb_delivery_items",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DeliveryId = table.Column<long>(type: "bigint", nullable: false),
                    ProductId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tb_delivery_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tb_delivery_items_tb_deliveries_DeliveryId",
                        column: x => x.DeliveryId,
                        principalTable: "tb_deliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tb_delivery_items_tb_products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "tb_products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tb_deliveries_SupplierId",
                table: "tb_deliveries",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_tb_delivery_items_DeliveryId",
                table: "tb_delivery_items",
                column: "DeliveryId");

            migrationBuilder.CreateIndex(
                name: "IX_tb_delivery_items_ProductId",
                table: "tb_delivery_items",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tb_delivery_items");

            migrationBuilder.DropTable(
                name: "tb_deliveries");

            migrationBuilder.DropTable(
                name: "tb_products");

            migrationBuilder.DropTable(
                name: "tb_suppliers");
        }
    }
}
