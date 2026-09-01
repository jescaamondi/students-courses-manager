const BASE = "/api";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const payload = await res.json();
  if (!res.ok) {
    const err = new Error(payload.error?.message || "Request failed");
    err.status = res.status;
    err.fields = payload.error?.fields || {};
    throw err;
  }
  return payload;
}



export const getStudents = (params = "") =>
  fetchJson(`${BASE}/students${params ? `?${params}` : ""}`).then(
    (r) => r.data,
  );

export const getStudent = (id) =>
  fetchJson(`${BASE}/students/${id}?include=courses`).then((r) => r.data);

export const createStudent = (data) =>
  fetchJson(`${BASE}/students`, { method: "POST", body: JSON.stringify(data) });

export const updateStudent = (id, data) =>
  fetchJson(`${BASE}/students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteStudent = (id) =>
  fetchJson(`${BASE}/students/${id}`, { method: "DELETE" });



export const getCourses = (params = "") =>
  fetchJson(`${BASE}/courses${params ? `?${params}` : ""}`).then((r) => r.data);

export const getCourse = (id) =>
  fetchJson(`${BASE}/courses/${id}`).then((r) => r.data);

export const createCourse = (data) =>
  fetchJson(`${BASE}/courses`, { method: "POST", body: JSON.stringify(data) });

export const updateCourse = (id, data) =>
  fetchJson(`${BASE}/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteCourse = (id) =>
  fetchJson(`${BASE}/courses/${id}`, { method: "DELETE" });
