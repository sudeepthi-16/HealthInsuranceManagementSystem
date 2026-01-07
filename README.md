# Smart Health Insurance Management System - Capstone Insurance

A comprehensive health insurance management solution featuring a modern Angular frontend and a robust .NET Web API backend. The system facilitates policy management, claims processing, and user administration for Admins, Hospital Managers, Insurance Agents, and Customers.

## 🚀 Features

- **User Roles & Authentication**: Secure JWT-based authentication with ASP.NET Core Identity for Admin, Hospital Manager, Agent, and Customer roles.
- **Dashboard & Analytics**: Interactive charts and KPI cards using Chart.js.
- **Policy Management**: Create, view, and manage insurance policies.
- **Claims Processing**: Streamlined claims submission and approval workflow.
- **Hospital Network**: Manage hospital information and networks.
- **Payments**: Integrated payment tracking and history.
- **Modern UI**: Responsive design built with Angular Material and Bootstrap.

## 🛠 Technology Stack

### Backend (`CapStoneAPI`)
- **Framework**: .NET 8.0 (ASP.NET Core Web API)
- **Database**: SQL Server (Entity Framework Core 8)
- **ORM**: Entity Framework Core Code-First
- **Authentication**: JWT Bearer + ASP.NET Core Identity
- **Documentation**: Swagger UI

### Frontend (`CapstoneUI`)
- **Framework**: Angular 20.3.8
- **UI Library**: Angular Material 20.2.14
- **Charts**: Chart.js 4.5.1
- **Http Client**: RxJS 7.8

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **.NET SDK 8.0**: [Download .NET 8](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js (v20+ recommended)**: [Download Node.js](https://nodejs.org/)
- **SQL Server**: LocalDB or Full Instance.
- **Angular CLI**: `npm install -g @angular/cli`

## ⚙️ Setup Instructions

### 1. Database Setup
Ensure your SQL Server is running. The application uses Entity Framework Core to automatically create and seed the database.

### 2. Backend API Setup (`CapStoneAPI`)

1.  Navigate to the API directory:
    ```bash
    cd CapStoneAPI
    ```

2.  **Configuration**: Open `appsettings.json` and verify the Connection String and JWT settings.
    ```json
    "ConnectionStrings": {
       "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CapStoneDb;Integrated Security=True;Connect Timeout=30;"
    },
    "Jwt": {
      "Key": "THIS_IS_A_SUPER_LONG_HIGHLY_SECURE_SECRET_KEY_123456789",
      "Issuer": "Capstone Insurance",
      "Audience": "Market Users"
    }
    ```

3.  **Restore & Build**:
    ```bash
    dotnet restore
    dotnet build
    ```

4.  **Database Migration**: Add intial Migration and apply migrations to create the database schema.
    ```bash
    dotnet ef migrations add InitialCreate
    dotnet ef database update
    ```
This will:
Create the database if it does not exist
Apply all pending migrations
Create Identity, domain, and supporting tables
Prepare the database for seeding.

After migrations:
Default roles and users are automatically seeded in Development mode only
Admin and demo customer accounts are created via the DataSeeder

5.  **Run the API**:
    ```bash
    dotnet run
    ```
    The API will start (default: `http://localhost:7250` or similar). Visit `http://localhost:7250/swagger` to view the API documentation.

### 3. Frontend UI Setup (`CapstoneUI`)

1.  Navigate to the UI directory:
    ```bash
    cd CapstoneUI
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    ng serve
    ```

4.  **Access Application**:
    Open your browser and navigate to `http://localhost:4200`.

## 🧪 Running Tests

### Backend Tests 
```bash
cd CapStoneAPI
dotnet test
```
This runs the unit testcases and give the output of no of passed, failed and skipped test cases.
## 🌱 Seeded Data

In the DataSeeder (Dev env only) an admin(Full Name: System Admin) is created by default with the below credentials:
```
Email : admin@t.com
Password : Admin@123
```
Admin can be uses to login and he can create the other users, customer can self register

A customer (Full Name: Rahul Dravid) by default is also created whos policy end date has passed (to show expired status) his credentials are:
```
Email : cust1@chk.com
Password: Pass@123
```
## 🏗 Project Structure

```
├── CapStoneAPI/                     # Backend (ASP.NET Core Web API)
│   ├── Controllers/                 # API Endpoints (Auth, Policies, Claims, Payments, etc.)
│   ├── Data/                        # DbContext, Migrations, Seeders
│   ├── Models/                      # Entity Models (User, Policy, Claim, Payment, Hospital)
│   ├── Repositories/                # Data Access Layer (Interfaces + Implementations)
│   │   ├── Interfaces/
│   │   └── UserRepository.cs
│   ├── Services/                    # Business Logic Layer
│   │   ├── Interfaces/
│   │   └── UserService.cs
│   ├── DTOs/                        # Request & Response DTOs
│   ├── Program.cs                   # App Configuration & Middleware
│   └── appsettings.json
│
└── CapstoneUI/                      # Frontend (Angular)
    ├── src/
    │   ├── app/
    │   │   ├── components/           # Feature & Reusable UI Components
    │   │   │   ├── admin/
    │   │   │   ├── agent/
    │   │   │   ├── customer/
    │   │   │   ├── hospital/
    │   │   │   └── shared/
    │   │   │
    │   │   ├── services/             # HTTP Services (API calls)
    │   │   │   ├── auth.service.ts
    │   │   │   ├── policy.service.ts
    │   │   │   ├── claim.service.ts
    │   │   │   └── payment.service.ts
    │   │   │
    │   │   ├── guards/               # Route Guards
    │   │   │   ├── auth.guard.ts
    │   │   │   └── role.guard.ts
    │   │   │
    │   │   ├── interceptors/         # HTTP Interceptors
    │   │   │   └── jwt.interceptor.ts
    │   │   │
    │   │   ├── models/               # Frontend Models / Interfaces
    │   │   │   ├── user.model.ts
    │   │   │   ├── policy.model.ts
    │   │   │   ├── claim.model.ts
    │   │   │   └── payment.model.ts
    │   │   │
    │   │   ├── app.routes.ts
    │   │   ├── app.config.ts
    │   │   └── app.component.ts
    │   │
    │   └── environments/             # environment.ts 
    │
    └── angular.json

```

