const SUPABASE_URL = "https://snlqczlbeyjwhndbkmum.supabase.co"; // Replace with your URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubHFjemxiZXlqd2huZGJrbXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTMwNzYsImV4cCI6MjA3MDY2OTA3Nn0.Qr3zlxmfxxV835f3zPT302pUpX6CcL2wvibWqjzv1eY"; // Replace with your key

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("customer-form");
const customerList = document.getElementById("customer-list");
const searchInput = document.getElementById("search");

// Fetch customers
async function fetchCustomers(filter = "") {
  const { data, error } = await client
    .from("customers")
    .select("*")
    .ilike("name", `%${filter}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error.message);
    return;
  }

  renderCustomers(data);
}

// Render list
function renderCustomers(customers) {
  customerList.innerHTML = "";
  customers.forEach(({ id, name, contact, location }) => {
    const li = document.createElement("li");
    li.className = "customer-item";
    li.innerHTML = `
      <div>
        <strong>${name}</strong><br>
        <span>${contact}</span><br>
        <span>${location}</span>
      </div>
      <button class="delete-btn" data-id="${id}">Delete</button>
    `;
    customerList.appendChild(li);
  });

  // Bind delete buttons
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteCustomer(id);
    });
  });
}

// Delete a customer
async function deleteCustomer(id) {
  const { error } = await client.from("customers").delete().eq("id", id);
  if (error) {
    alert("Failed to delete customer.");
    console.error(error);
  } else {
    fetchCustomers(searchInput.value);
  }
}

// Form submission
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

// Search input
searchInput.addEventListener("input", (e) => {
  fetchCustomers(e.target.value);
});

// Load data on start
document.addEventListener("DOMContentLoaded", () => {
  fetchCustomers();
});
