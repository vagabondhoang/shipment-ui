import type { Assignment } from "../types/assignment";

const BASE_URL =  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";


export async function fetchAssignments(): Promise<Assignment[]> {
    const res = await fetch(`${BASE_URL}/assignments`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    return res.json();
}

export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    const res = await fetch(`${BASE_URL}/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update assignment");
    return res.json();
}