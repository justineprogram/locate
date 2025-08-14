const SUPABASE_URL = "https://snlqczlbeyjwhndbkmum.supabase.co";  // replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubHFjemxiZXlqd2huZGJrbXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTMwNzYsImV4cCI6MjA3MDY2OTA3Nn0.Qr3zlxmfxxV835f3zPT302pUpX6CcL2wvibWqjzv1eY";  // replace

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("customer-form");
const customerList = document.getElementById("customer-list");
const searchInput = document.getElementById("search");

async function fetchCustomers(filter = "") {
  let { data, error } = await client
    .from("customers")
    .select("*")
    .ilike("name", `%${filter}%`);

  if (error) {
    alert("Failed to load customers");
    return;
  }

  renderCustomers(data);
}

function renderCustomers(customers) {
  customerList.innerHTML = "";
  customers.forEach(({ name, contact, location }) => {
    const li = document.createElement("li");
    li.className = "bg-gray-200 p-3 rounded";
    li.innerHTML = `<strong>${name}</strong><br><span>${contact}</span><br><span>${location}</span>`;
    customerList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!name || !contact || !location) return;

  const { error } = await client.from("customers").insert([{ name, contact, location }]);
  if (error) {
    alert("Error saving customer");
  } else {
    form.reset();
    fetchCustomers();
  }
});

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value;
  fetchCustomers(searchValue);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchCustomers();
});
