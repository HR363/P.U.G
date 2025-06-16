// Simple Project Management System

// Mock data storage
const users = [
  { id: 1, email: "admin@test.com", password: "admin123", role: "admin" },
  { id: 2, email: "user@test.com", password: "user123", role: "user" },
]

let projects = [
  { id: 1, name: "Sample Project", description: "This is a sample project", endDate: "2024-12-31", status: "pending" },
]

let assignments = []
let currentUser = null

// DOM Elements
const loginSection = document.getElementById("login-section")
const adminDashboard = document.getElementById("admin-dashboard")
const userDashboard = document.getElementById("user-dashboard")
const authForm = document.getElementById("auth-form")
const authMessage = document.getElementById("auth-message")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check if user had a saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light"

  if (savedTheme === "dark") {
    document.body.classList.add("dark")
    document.getElementById("dark-mode").checked = true
  } else {
    document.body.classList.remove("dark")
    document.getElementById("light-mode").checked = true
  }

  // Save theme preference when changed
  document.querySelectorAll('input[name="theme"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "dark") {
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    })
  })

  setupEventListeners()
  updateUserList()
  updateProjectSelects()
})

function setupEventListeners() {
  // Auth form
  authForm.addEventListener("submit", handleLogin)
  document.getElementById("register-btn").addEventListener("click", handleRegister)

  // Logout buttons
  document.getElementById("logout-btn").addEventListener("click", logout)
  document.getElementById("logout-btn-user").addEventListener("click", logout)

  // Admin forms
  document.getElementById("project-form").addEventListener("submit", handleAddProject)
  document.getElementById("assign-form").addEventListener("submit", handleAssignProject)
  document.getElementById("delete-btn").addEventListener("click", handleDeleteProject)

  // User actions
  const completeBtn = document.getElementById("complete-project")
  if (completeBtn) {
    completeBtn.addEventListener("click", handleCompleteProject)
  }

  // Dark mode toggle
  // document.getElementById("toggle-dark-mode").addEventListener("click", function () {
  //   document.body.classList.toggle("dark")
  //   const icon = this.querySelector("i")
  //   if (document.body.classList.contains("dark")) {
  //     icon.className = "fas fa-sun"
  //     this.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
  //   } else {
  //     icon.className = "fas fa-moon"
  //     this.innerHTML = '<i class="fas fa-moon"></i> Dark Mode'
  //   }
  // })
}

function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    showMessage("Login successful!", "success")

    if (user.role === "admin") {
      showAdminDashboard()
    } else {
      showUserDashboard()
    }
  } else {
    showMessage("Invalid credentials!", "error")
  }
}

function handleRegister() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    showMessage("Please fill in all fields!", "error")
    return
  }

  if (users.find((u) => u.email === email)) {
    showMessage("User already exists!", "error")
    return
  }

  const newUser = {
    id: users.length + 1,
    email: email,
    password: password,
    role: "user",
  }

  users.push(newUser)
  showMessage("Registration successful! You can now login.", "success")
  updateUserList()

  // Clear form
  document.getElementById("email").value = ""
  document.getElementById("password").value = ""
}

function handleAddProject(e) {
  e.preventDefault()
  const name = document.getElementById("project-name").value
  const description = document.getElementById("project-desc").value
  const endDate = document.getElementById("project-end").value

  const newProject = {
    id: projects.length + 1,
    name: name,
    description: description,
    endDate: endDate,
    status: "pending",
  }

  projects.push(newProject)
  showMessage("Project added successfully!", "success")
  updateProjectSelects()

  // Clear form
  e.target.reset()
}

function handleAssignProject(e) {
  e.preventDefault()
  const userId = document.getElementById("user-select").value
  const projectId = document.getElementById("project-select").value

  if (!userId || !projectId || userId === "Select User" || projectId === "Select Project") {
    showMessage("Please select both user and project!", "error")
    return
  }

  const assignment = {
    userId: Number.parseInt(userId),
    projectId: Number.parseInt(projectId),
    status: "assigned",
  }

  assignments.push(assignment)
  showMessage("Project assigned successfully!", "success")
}

function handleDeleteProject() {
  const projectId = document.getElementById("delete-project-select").value

  if (!projectId || projectId === "Select Project to Delete") {
    showMessage("Please select a project to delete!", "error")
    return
  }

  projects = projects.filter((p) => p.id !== Number.parseInt(projectId))
  assignments = assignments.filter((a) => a.projectId !== Number.parseInt(projectId))

  showMessage("Project deleted successfully!", "success")
  updateProjectSelects()
}

function handleCompleteProject() {
  const assignment = assignments.find((a) => a.userId === currentUser.id)
  if (assignment) {
    assignment.status = "completed"
    showMessage("Project marked as completed!", "success")
    showUserDashboard()
  }
}

function showAdminDashboard() {
  loginSection.style.display = "none"
  adminDashboard.style.display = "block"
  userDashboard.style.display = "none"
  updateUserList()
  updateProjectSelects()
}

function showUserDashboard() {
  loginSection.style.display = "none"
  adminDashboard.style.display = "none"
  userDashboard.style.display = "block"
  updateAssignedProject()
}

function logout() {
  currentUser = null
  loginSection.style.display = "block"
  adminDashboard.style.display = "none"
  userDashboard.style.display = "none"

  // Clear form
  document.getElementById("email").value = ""
  document.getElementById("password").value = ""
  authMessage.textContent = ""
}

function updateUserList() {
  const userList = document.getElementById("user-list")
  userList.innerHTML = ""

  users
    .filter((u) => u.role === "user")
    .forEach((user) => {
      const li = document.createElement("li")
      li.innerHTML = `<i class="fas fa-user"></i> ${user.email}`
      userList.appendChild(li)
    })
}

function updateProjectSelects() {
  const userSelect = document.getElementById("user-select")
  const projectSelect = document.getElementById("project-select")
  const deleteSelect = document.getElementById("delete-project-select")

  // Update user select
  userSelect.innerHTML = "<option>Select User</option>"
  users
    .filter((u) => u.role === "user")
    .forEach((user) => {
      const option = document.createElement("option")
      option.value = user.id
      option.textContent = user.email
      userSelect.appendChild(option)
    })

  // Update project selects
  const projectOptions =
    "<option>Select Project</option>" + projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")

  projectSelect.innerHTML = projectOptions

  deleteSelect.innerHTML =
    "<option>Select Project to Delete</option>" +
    projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")
}

function updateAssignedProject() {
  const assignedProjectDiv = document.getElementById("assigned-project")
  const updateSection = document.getElementById("update-section")

  const assignment = assignments.find((a) => a.userId === currentUser.id)

  if (assignment) {
    const project = projects.find((p) => p.id === assignment.projectId)
    if (project) {
      assignedProjectDiv.innerHTML = `
        <h4><i class="fas fa-project-diagram"></i> ${project.name}</h4>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Due Date:</strong> ${project.endDate}</p>
        <p><strong>Status:</strong> <span class="status-${assignment.status}">${assignment.status}</span></p>
      `

      if (assignment.status === "assigned") {
        updateSection.style.display = "block"
      } else {
        updateSection.style.display = "none"
      }
    }
  } else {
    assignedProjectDiv.innerHTML = '<p><i class="fas fa-info-circle"></i> No project assigned yet.</p>'
    updateSection.style.display = "none"
  }
}

function showMessage(message, type) {
  authMessage.textContent = message
  authMessage.className = `message ${type}`
  authMessage.style.display = "block"

  setTimeout(() => {
    authMessage.style.display = "none"
  }, 3000)
}
