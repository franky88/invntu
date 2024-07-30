interface Department {
    name: string;
}

interface Profile {
    employee_id: string;
    contact: string;
    department: Department;
}

interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    is_staff: boolean;
    first_name: string;
    last_name: string;
    profile: Profile;
    // Add other properties as needed
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
    results: T[];
    // Add other properties as needed
}