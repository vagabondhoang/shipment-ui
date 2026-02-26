export type Assignment = {
    id: string;
    label: string;
    status: string;
    clients: string[];
    shipment_count: number;
}

export type AssignmentStatus = 'OPEN' | 'IN_TRANSIT' | 'DELIVERED';