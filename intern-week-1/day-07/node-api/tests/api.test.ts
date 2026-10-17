import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { config } from "../src/config/environment.js";

describe("Day 07: Express REST API Automated Test Suite", () => {
  let createdEmployeeId: string;
  const testEmail = `automation.tester.${Date.now()}@example.com`;

  // 1. Health check
  it("GET /api/health - should return 200 and healthy status", async () => {
    const res = await request(app).get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, "ok");
    assert.equal(typeof res.body.data.uptimeSeconds, "number");
  });

  // 2. Fetch statistics
  it("GET /api/employees/stats - should return dashboard metrics", async () => {
    const res = await request(app).get("/api/employees/stats");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.totalEmployees, "number");
    assert.equal(typeof res.body.data.averageSalary, "number");
    assert.ok(res.body.data.totalEmployees >= 0);
  });

  // 3. List employees
  it("GET /api/employees - should return employee list with query filtering", async () => {
    const res = await request(app).get("/api/employees?department=Engineering");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    for (const emp of res.body.data) {
      assert.equal(emp.department, "Engineering");
    }
  });

  // 4. Retrieve single employee
  it("GET /api/employees/EMP-001 - should return employee details", async () => {
    const res = await request(app).get("/api/employees/EMP-001");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, "EMP-001");
  });

  // 5. Not found check
  it("GET /api/employees/NON_EXISTENT_999 - should return 404", async () => {
    const res = await request(app).get("/api/employees/NON_EXISTENT_999");
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "NOT_FOUND");
  });

  // 6. Validation failure on POST
  it("POST /api/employees - should return 400 for invalid body", async () => {
    const res = await request(app).post("/api/employees").send({
      firstName: "", // empty
      salary: -500 // negative
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
  });

  // 7. Successful creation
  it("POST /api/employees - should create a valid employee", async () => {
    const payload = {
      firstName: "Kavya",
      lastName: "Sen",
      email: testEmail,
      phone: "+91-98230-55443",
      department: "Engineering",
      designation: "Full Stack Next.js Engineer",
      status: "Active",
      joiningDate: "2024-03-01",
      salary: 95000
    };

    const res = await request(app).post("/api/employees").send(payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.email, testEmail);
    assert.ok(res.body.data.id);
    createdEmployeeId = res.body.data.id;
  });

  // 8. Duplicate email prevention
  it("POST /api/employees - should reject duplicate email", async () => {
    const res = await request(app).post("/api/employees").send({
      firstName: "Duplicate",
      lastName: "Tester",
      email: testEmail, // same email
      phone: "+91-98230-55443",
      department: "Engineering",
      designation: "QA Engineer",
      status: "Active",
      joiningDate: "2024-03-01",
      salary: 80000
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "DUPLICATE_EMAIL");
  });

  // 9. Update existing employee
  it("PUT /api/employees/:id - should update employee details", async () => {
    const res = await request(app)
      .put(`/api/employees/${createdEmployeeId}`)
      .send({ designation: "Senior Next.js Architect", salary: 110000 });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.designation, "Senior Next.js Architect");
    assert.equal(res.body.data.salary, 110000);
  });

  // 10. Authentication check on DELETE (unauthorized)
  it("DELETE /api/employees/:id - without auth token should return 401 Unauthorized", async () => {
    const res = await request(app).delete(`/api/employees/${createdEmployeeId}`);
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "UNAUTHORIZED");
  });

  // 11. Authentication check on DELETE (authorized)
  it("DELETE /api/employees/:id - with valid Bearer token should delete employee", async () => {
    const res = await request(app)
      .delete(`/api/employees/${createdEmployeeId}`)
      .set("Authorization", `Bearer ${config.demoApiKey}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    // Verify record is gone
    const verifyRes = await request(app).get(`/api/employees/${createdEmployeeId}`);
    assert.equal(verifyRes.status, 404);
  });
});