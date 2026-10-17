import { EmployeeForm } from "../../../components/EmployeeForm";

export default function CreateEmployeePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="page-header">
        <div className="page-title">
          <h2>New Employee Onboarding</h2>
          <p>Register an employee into the Express backend with server-side validation.</p>
        </div>
      </div>
      <EmployeeForm />
    </div>
  );
}