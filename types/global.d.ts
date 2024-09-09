interface Department {
    id: number;
    name: string;
    profile_count: number;
}

interface User {
    id: number;
    birth_date: Date;
    contact: number;
    department: any;
    username: string;
    email: string;
    full_name: string;
    position: string;
    is_staff: boolean;
    is_active: boolean;
    first_name: string;
    last_name: string;
    employee_id: string;
    is_archived: boolean;
    is_working: boolean;
    is_superuser: boolean;
    // Add other properties as needed
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
    results: T[];
    // Add other properties as needed
}

interface Category {
    id: number;
    name: string;
}

interface ItemStatus {
    id: number;
    name: string;
}

interface Snapshot {
    name: string;
    is_available: boolean;
}

interface History {
    id: number;
    change_reason: string;
    change_by: string;
    timestamp: Date;
    snapshot: Snapshot;
}

interface Kit {
    id: number;
    name: string;
    kit_code: string;
    is_available: boolean;
    history: History[]
}

interface Item {
    category: number;
    id: number;
    name: string;
    date_purchased: string;
    cost: number;
    serial: string;
    model: string;
    barcode: string;
    unit_kit: number;
    item_status: number;
    results: Array;
}

interface UnitStatus {
    id: number;
    name: string;
}