import type { Assignment } from "../types/assignment";

const BASE_URL =  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";


export async function fetchAssignments(): Promise<Assignment[]> {
    const res = await fetch(`${BASE_URL}/assignments`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    return res.json();
}