export type AssignmentStatus = 'OPEN' | 'IN_TRANSIT' | 'DELIVERED';

export type Assignment = {
    id: string;
    label: string;
    status: AssignmentStatus;
    clients: string[];
    shipment_count: number;
}
