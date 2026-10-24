CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(160) NOT NULL,
    address VARCHAR(240),
    district VARCHAR(120) NOT NULL,
    contact_name VARCHAR(120),
    contact_phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies (id),
    department VARCHAR(120) NOT NULL,
    title VARCHAR(160) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(10) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paused', 'closed')),
    work_hours VARCHAR(160) NOT NULL,
    overtime VARCHAR(240),
    base_salary DECIMAL(12, 2) NOT NULL CHECK (base_salary >= 0),
    overtime_salary DECIMAL(12, 2) CHECK (overtime_salary IS NULL OR overtime_salary >= 0),
    allowances VARCHAR(500),
    minimum_age SMALLINT CHECK (minimum_age IS NULL OR minimum_age >= 16),
    maximum_age SMALLINT CHECK (maximum_age IS NULL OR maximum_age >= 16),
    gender_requirement VARCHAR(10) NOT NULL DEFAULT 'any'
        CHECK (gender_requirement IN ('any', 'male', 'female')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (minimum_age IS NULL OR maximum_age IS NULL OR minimum_age <= maximum_age)
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES public.vacancies (id),
    applicant_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    year_of_birth SMALLINT NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    status VARCHAR(12) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (vacancy_id, phone)
);

CREATE INDEX IF NOT EXISTS ix_vacancies_company_status ON public.vacancies (company_id, status);
CREATE INDEX IF NOT EXISTS ix_vacancies_department ON public.vacancies (department);
CREATE INDEX IF NOT EXISTS ix_applications_status_created ON public.applications (status, created_at);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

INSERT INTO public.companies
    (id, name, address, district, contact_name, contact_phone)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'Công ty KJ Tech', 'Biên Hòa, Đồng Nai', 'Biên Hòa', 'Nguyễn Minh An', '0900000001'),
    ('22222222-2222-4222-8222-222222222222', 'Công ty Minh Phát', 'Khu công nghiệp Amata', 'Amata', 'Trần Thu Hà', '0900000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.vacancies
    (id, company_id, department, title, quantity, status, work_hours, overtime,
     base_salary, overtime_salary, allowances, minimum_age, maximum_age, gender_requirement)
VALUES
    ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111',
     'Lắp ráp', 'Công nhân lắp ráp', 20, 'open', '07:30–16:30', 'Tăng ca theo nhu cầu',
     8500000, 45000, 'Công ty hỗ trợ bữa trưa; có thời gian nghỉ giữa ca', 18, 45, 'any'),
    ('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222',
     'Kiểm tra chất lượng', 'Nhân viên QC', 5, 'open', '08:00–17:00', 'Tăng ca khi phát sinh',
     9500000, 50000, 'Hỗ trợ bữa ăn giữa ca', 20, 35, 'female')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications
    (id, vacancy_id, applicant_name, phone, year_of_birth, gender)
VALUES
    ('55555555-5555-4555-8555-555555555555', '33333333-3333-4333-8333-333333333333',
     'Nguyễn Văn Mẫu', '0900000003', 1998, 'male')
ON CONFLICT (id) DO NOTHING;
