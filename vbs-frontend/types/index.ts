export interface Guardian {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  relationship_to_child?: string;
  address?: string;
  home_church?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Child {
  id: number;
  guardian: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  date_of_birth: string;
  gender: "male" | "female";
  school_name?: string;
  allergies?: string;
  medical_notes?: string;
  special_needs?: string;
  is_first_time_attendee: boolean;
  notes?: string;
}

export interface VBSProgram {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  venue: string;
  description?: string;
  status: "draft" | "active" | "closed";
}

export interface Registration {
  id: number;
  child: number;
  program: number;
  group?: number | null;
  status: "pending" | "approved" | "cancelled";
  pickup_notes?: string;
}
