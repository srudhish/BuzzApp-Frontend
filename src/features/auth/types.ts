// User role enum (matches backend)
export enum UserRole { Owner = 1, Supplier = 2, Buyer = 3, Employee = 4, Supervisor = 5, Labor = 6 };

// EmployeeProfile DTO
export interface EmployeeProfileDto {
  EmployeeCode: string;
  Designation: string;
  Department: string;
  ReportingToId?: string;
}

// UserProfileUpdate DTO
export interface UserProfileUpdateDto {
  FullName: string;
  Email?: string;
  Aadhaar?: string;
  Role: UserRole;

  // Optional company fields (for Owner/Supplier/Buyer)
  CompanyName?: string;
  CompanyAddress?: string;
  CompanyGST?: string;

  // Optional employee profile (for Employee/Supervisor/Labor)
  EmployeeProfile?: EmployeeProfileDto;
}