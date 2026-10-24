IF DB_ID(N'WorkerManagement') IS NULL
BEGIN
    CREATE DATABASE WorkerManagement;
END;
GO

USE WorkerManagement;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_users PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        full_name NVARCHAR(120) NOT NULL,
        email NVARCHAR(254) NOT NULL,
        password_hash NVARCHAR(100) NOT NULL,
        role VARCHAR(10) NOT NULL CONSTRAINT DF_users_role DEFAULT 'user',
        created_at DATETIME2(3) NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_users_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_users_email UNIQUE (email),
        CONSTRAINT CK_users_role CHECK (role IN ('admin', 'user'))
    );
END;
GO

IF OBJECT_ID(N'dbo.companies', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.companies (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_companies PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        name NVARCHAR(160) NOT NULL,
        address NVARCHAR(240) NULL,
        district NVARCHAR(120) NOT NULL,
        contact_name NVARCHAR(120) NULL,
        contact_phone NVARCHAR(30) NULL,
        created_at DATETIME2(3) NOT NULL CONSTRAINT DF_companies_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_companies_updated_at DEFAULT SYSUTCDATETIME()
    );
END;
GO

IF OBJECT_ID(N'dbo.vacancies', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.vacancies (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_vacancies PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        company_id UNIQUEIDENTIFIER NOT NULL,
        department NVARCHAR(120) NOT NULL,
        title NVARCHAR(160) NOT NULL,
        quantity INT NOT NULL,
        status VARCHAR(10) NOT NULL CONSTRAINT DF_vacancies_status DEFAULT 'open',
        work_hours NVARCHAR(160) NOT NULL,
        overtime NVARCHAR(240) NULL,
        base_salary DECIMAL(12, 2) NOT NULL,
        overtime_salary DECIMAL(12, 2) NULL,
        allowances NVARCHAR(500) NULL,
        minimum_age TINYINT NULL,
        maximum_age TINYINT NULL,
        gender_requirement VARCHAR(10) NOT NULL CONSTRAINT DF_vacancies_gender DEFAULT 'any',
        created_at DATETIME2(3) NOT NULL CONSTRAINT DF_vacancies_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_vacancies_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_vacancies_companies FOREIGN KEY (company_id)
            REFERENCES dbo.companies (id),
        CONSTRAINT CK_vacancies_quantity CHECK (quantity > 0),
        CONSTRAINT CK_vacancies_salary CHECK (base_salary >= 0 AND (overtime_salary IS NULL OR overtime_salary >= 0)),
        CONSTRAINT CK_vacancies_age CHECK (
            (minimum_age IS NULL OR minimum_age >= 16)
            AND (maximum_age IS NULL OR maximum_age >= 16)
            AND (minimum_age IS NULL OR maximum_age IS NULL OR minimum_age <= maximum_age)
        ),
        CONSTRAINT CK_vacancies_status CHECK (status IN ('open', 'paused', 'closed')),
        CONSTRAINT CK_vacancies_gender CHECK (gender_requirement IN ('any', 'male', 'female'))
    );
END;
GO

IF OBJECT_ID(N'dbo.applications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.applications (
        id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_applications PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        vacancy_id UNIQUEIDENTIFIER NOT NULL,
        applicant_name NVARCHAR(120) NOT NULL,
        phone NVARCHAR(30) NOT NULL,
        year_of_birth SMALLINT NOT NULL,
        gender VARCHAR(10) NOT NULL,
        status VARCHAR(12) NOT NULL CONSTRAINT DF_applications_status DEFAULT 'submitted',
        created_at DATETIME2(3) NOT NULL CONSTRAINT DF_applications_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2(3) NOT NULL CONSTRAINT DF_applications_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_applications_vacancies FOREIGN KEY (vacancy_id)
            REFERENCES dbo.vacancies (id),
        CONSTRAINT UQ_applications_vacancy_phone UNIQUE (vacancy_id, phone),
        CONSTRAINT CK_applications_gender CHECK (gender IN ('male', 'female')),
        CONSTRAINT CK_applications_status CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected'))
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_vacancies_company_status' AND object_id = OBJECT_ID(N'dbo.vacancies'))
    CREATE INDEX IX_vacancies_company_status ON dbo.vacancies (company_id, status);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_vacancies_department' AND object_id = OBJECT_ID(N'dbo.vacancies'))
    CREATE INDEX IX_vacancies_department ON dbo.vacancies (department);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_applications_status_created' AND object_id = OBJECT_ID(N'dbo.applications'))
    CREATE INDEX IX_applications_status_created ON dbo.applications (status, created_at);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.companies WHERE name = N'Công ty KJ Tech')
BEGIN
    INSERT INTO dbo.companies (id, name, address, district, contact_name, contact_phone)
    VALUES
        ('11111111-1111-4111-8111-111111111111', N'Công ty KJ Tech', N'Biên Hòa, Đồng Nai', N'Biên Hòa', N'Nguyễn Minh An', N'0900000001'),
        ('22222222-2222-4222-8222-222222222222', N'Công ty Minh Phát', N'Khu công nghiệp Amata', N'Amata', N'Trần Thu Hà', N'0900000002');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.vacancies WHERE title = N'Công nhân lắp ráp' AND company_id = '11111111-1111-4111-8111-111111111111')
BEGIN
    INSERT INTO dbo.vacancies
        (id, company_id, department, title, quantity, status, work_hours, overtime,
         base_salary, overtime_salary, allowances, minimum_age, maximum_age, gender_requirement)
    VALUES
        ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111',
         N'Lắp ráp', N'Công nhân lắp ráp', 20, 'open', N'07:30–16:30', N'Tăng ca theo nhu cầu',
         8500000, 45000, N'Công ty hỗ trợ bữa trưa; có thời gian nghỉ giữa ca', 18, 45, 'any'),
        ('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222',
         N'Kiểm tra chất lượng', N'Nhân viên QC', 5, 'open', N'08:00–17:00', N'Tăng ca khi phát sinh',
         9500000, 50000, N'Hỗ trợ bữa ăn giữa ca', 20, 35, 'female');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.applications WHERE phone = N'0900000003' AND vacancy_id = '33333333-3333-4333-8333-333333333333')
BEGIN
    INSERT INTO dbo.applications (vacancy_id, applicant_name, phone, year_of_birth, gender)
    VALUES ('33333333-3333-4333-8333-333333333333', N'Nguyễn Văn Mẫu', N'0900000003', 1998, 'male');
END;
GO
