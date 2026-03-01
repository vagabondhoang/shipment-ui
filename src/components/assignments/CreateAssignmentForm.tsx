import toast from "react-hot-toast";
import { createAssignment } from "@/api/assignments.api";
import "./CreateAssignmentForm.css";
import type { Assignment } from "@/types/assignment";

export function CreateAssignmentForm({
  onSuccess,
}: {
  onSuccess: (assignment?: Assignment) => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const createdAssignment = await createAssignment({
        label: formData.get("label") as string,
        status: "OPEN",
        clients: [],
        shipment_count: 0,
      });
      toast.success("Assignment created successfully!");

      onSuccess(createdAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment. Please try again.");
    }
  }

  return (
    <form id="create-shipment-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="label">Label</label>
          <input id="label" name="label" type="text" required />
        </div>
      </div>
    </form>
  );
}
