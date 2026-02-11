# Estágio de Compilação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Scoops.Auth.API.csproj", "./"]
RUN dotnet restore "Scoops.Auth.API.csproj"
COPY . .
RUN dotnet publish "Scoops.Auth.API.csproj" -c Release -o /app/publish

# Estágio de Execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
RUN mkdir -p /app/wwwroot/images
ENTRYPOINT ["dotnet", "Scoops.Auth.API.dll"]