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

interface History {
    change_reason: string;
    change_by: string;
    timestamp: Date;
    snapshot: Object;
}

interface Kit {
    id: number;
    name: string;
    kit_code: string;
    is_available: boolean;
    history: History[]
}

interface Item {
    category: Category;
    id: number;
    name: string;
    date_purchased: string;
    cost: number;
    serial: string;
    model: string;
    barcode: string;
    unit_kit: Kit;
    item_status: ItemStatus;
}

interface UnitStatus {
    id: number;
    name: string;
}