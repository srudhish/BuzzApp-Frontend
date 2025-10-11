export enum UserRole {
    Owner = 1,
    Supplier = 2,
    Buyer = 3,
    Employee = 4,
    Supervisor = 5,
    Labor = 6,
}

export interface EmployeeProfileDto {
    EmployeeCode: string;
    Designation: string;
    Department: string;
    ReportingToId?: string;
}

export interface UserProfileUpdateDto {
    FullName: string;
    Email?: string;
    Aadhaar?: string;
    Role: UserRole;
    CompanyName?: string;
    CompanyAddress?: string;
    CompanyGST?: string;
    EmployeeProfile?: EmployeeProfileDto;
}

export interface CompanyDto {
    name?: string;
    address?: string;
    gstNumber?: string;
}

export interface UserProfileResponse {
    id: string;
    fullName?: string;
    email?: string;
    aadharNumber?: string;
    role?: UserRole;
    isProfileCompleted?: boolean;
    company?: CompanyDto;
    employeeProfile?: EmployeeProfileDto;
}
