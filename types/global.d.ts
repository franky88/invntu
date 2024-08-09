interface Department {
    id: number;
    name: string;
    profile_count: number;
}


interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    is_staff: boolean;
    first_name: string;
    last_name: string;
    employee_id: string;
    // Add other properties as needed
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
    results: T[];
    // Add other properties as needed
}