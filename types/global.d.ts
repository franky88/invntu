interface User {
    id: number;
    name: string;
    email: string;
    get_full_name: string
    is_staff: boolean;
    // Add other properties as needed
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
    results: T[];
    // Add other properties as needed
}