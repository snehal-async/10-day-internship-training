import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "../../../../lib/api";
import { EmployeeForm } from "../../../../components/EmployeeForm";
import { Employee } from "../../../../types/employee";

interface PageProps {
  params: { id: string };
}

export default async function EditEmployeePage({ params }: PageProps) {
  let employee: Employee;

  try {
    employee = await api.getEmployeeById(params.id);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/employees/${employee.id}`} style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-600)" }}>
          ← Back to Employee Profile
        </Link>
      </div>

      <EmployeeForm initialData={employee} isEditing={true} />
    </div>
  );
}