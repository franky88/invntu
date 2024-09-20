interface Department {
  id: number;
  name: string;
  profile_count: number;
}

interface User {
  id: number;
  birth_date: string;
  contact: string;
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
  image: string;
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
  unit_kit_code: string;
  is_available: boolean;
  history: History[];
}

interface Item {
  category: number;
  item: number;
  id: number;
  name: string;
  item_name: string;
  date_purchased: string;
  cost: number;
  serial: string;
  model: string;
  barcode: string;
  unit_kit: number;
  item_status: number;
  results: Array;
  unit_status_name: string;
  unit_kit_name: string;
  item_category_name: string;
}

interface UnitStatus {
  id: number;
  name: string;
}

interface KitAssignment {
  id: number;
  unit_kit: number;
  assign_to: number;
  date_assigned: string;
  date_returned: string;
  is_returned: boolean;
  unit_kit_code: string;
  remarks: string;
  unit_kit_name: string;
  history: History[] | null;
}

interface Unit {
  id: number;
  item: number;
  item_name: string;
  unit_kit: number;
  serial: string;
  item_category_name: string;
}
