const API_URL = "http://localhost:8080/api/students";
const API_AUTH = "http://localhost:8080/api/auth"

/**
 * Creates a new student by sending the provided
 * student data to the backend API.
 *
 * @param {Object} studentData - The student information
 *                               to be submitted
 * @returns {Promise<void>} Resolves after the request
 *                          has been processed
 */
async function createStudent(studentData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
            credentials: "include"
        });

        if (response.ok) {
            alert("Student added successfully!");
            resetForm();
            getAllStudents();
        } else {
            alert("Error adding student.");
        }
    } catch (error) {
        console.error("Error creating student:", error);
    }
}

// Handles student form submission and determines whether
// to create a new student or update an existing record.
document.getElementById("studentForm").addEventListener("submit", function(e) {
    // Prevent the browser from submitting the form normally.
    e.preventDefault();

    // Stop form submission if the input validation fails.
    if(!validateStudentForm()) {
        return;
    }

    // Retrieve the student ID to determine the current operation.
    const id = document.getElementById("studentId").value;

    // Collect and prepare the student information from the form.
    const studentData =  {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    // Update the existing student if an ID is present;
    // otherwise, create a new student record.
    if(id) {
        updateStudent(id, studentData);
    } else {
        createStudent(studentData);
    }
});

/**
 * Resets the student form fields and restores
 * the submit button to its default state.
 *
 * @returns {void}
 */
function resetForm() {
    // Clear the stored student ID and reset all form fields.
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();

    // Restore the button label and styling for adding a student.
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Add Student";
    submitBtn.style.backgroundColor = "#28a745";
}

/**
 * Retrieves all student records from the backend API
 * and displays them in the student table.
 *
 * @returns {Promise<void>} Resolves after the student
 *                          records have been retrieved
 *                          and displayed
 */
async function getAllStudents() {
    try {
        // Retrieve all student records using the active session cookie.
        const response = await fetch(`${API_URL}`, {
            credentials: "include"
        });

        // Throw an error if the backend returns an unsuccessful response.
        if (!response.ok) throw new Error("Network response was not ok");

        // Convert the JSON response into a JavaScript object.
        const students = await response.json();

        // Clear the existing table contents before displaying updated records.
        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        // Generate a table row for each student retrieved from the API.
        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.email}</td>
                    <td>
                        <button
                            class="btn-edit"
                            onclick="initializeStudentFormById(${student.id})"
                        >
                            Edit
                        </button>
                        <button
                            class="btn-delete"
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            // Append the generated row to the student table.
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        alert(
            "Failed to fetch students. Is your Spring Boot backend running?");
    }
}

// Automatically retrieve and display student records
// once the HTML document has finished loading.
document.addEventListener("DOMContentLoaded", getAllStudents);

/**
 * Retrieves a student's details using their ID
 * and populates the form for editing.
 *
 * @param {number} id - The unique identifier of the student
 * @returns {Promise<void>} Resolves after the student
 *                          details have been loaded
 *                          into the form
 */
async function initializeStudentFormById(id) {
    try {
        // Retrieve the selected student's details from the backend API.
        const response = await fetch(`${API_URL}/${id}`, {
            credentials: "include"
        });

        // Throw an error if the requested student cannot be retrieved.
        if (!response.ok) throw new Error("Could not fetch student details");

        // Convert the JSON response into a JavaScript object.
        const student = await response.json();

        // Populate the form fields with the selected student's information.
        document.getElementById("studentId").value = student.id;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("email").value = student.email;

        // Change the button label and styling to indicate update mode.
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.textContent = "Update";
        submitBtn.style.backgroundColor = "#007bff";

        // Remove previous validation error highlights when loading the record.
        clearValidationStyles();
    } catch (error) {
        console.error("Error fetching student details:", error);
    }
}

/**
 * Updates an existing student record by sending
 * the modified student data to the backend API.
 *
 * @param {number} id - The unique identifier of the student
 * @param {Object} studentData - The updated student information
 * @returns {Promise<void>} Resolves after the update
 *                          request has been processed
 */
async function updateStudent(id, studentData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
            credentials: "include"
        });

        if (response.ok) {
            alert("Student updated successfully!");
            resetForm();
            getAllStudents();
        } else {
            alert("Error updating student.");
        } 
    } catch (error) {
        console.error("Error updating student:", error);
    }
}

/**
 * Deletes an existing student record after
 * obtaining confirmation from the user.
 *
 * @param {number} id - The unique identifier of the student
 * @returns {Promise<void>} Resolves after the deletion
 *                          request has been processed
 */
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                // Retrieve and display the deletion confirmation 
                // from the backend.
                const message = await response.text();
                alert(message);

                // Refresh the table to reflect the deleted record.
                getAllStudents();
            } else {
                alert("Error deleting student.");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}

/**
 * Authenticates a user by sending their login credentials
 * to the backend and establishes an HTTP session.
 *
 * @param {Object} loginDto - The object containing
 *                            the user's login credentials
 * @returns {Promise<void>} Resolves after the authentication
 *                          request has been processed
 */
async function loginUser(loginDto) {
    try {
        const response = await fetch(`${API_AUTH}/auth_login_session`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(loginDto),
            credentials: "include"
        });

        if (response.ok) {
            alert("Login successful!");

            // Redirect the authenticated user to the student management page.
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials.");
        }
    } catch (error) {
        console.error("Login error", error);
    }
}

/**
 * Logs out the currently authenticated user by
 * terminating the HTTP session and resetting the interface.
 *
 * @returns {Promise<void>} Resolves after the logout
 *                          process has been completed
 */
async function logoutUser() {
    try {
        // Send a logout request to invalidate the current HTTP session.
        await fetch(`${API_AUTH}/logout`, {
            method: "POST",
            credentials: "include",
        });

        // Clear the student table and restore the form to its default state.
        document.getElementById("studentTableBody").innerHTML = "";
        resetForm();
        alert("Logged out successfully!");

        try {
            // Send an intentionally invalid Basic Authentication request
            // to attempt to clear cached browser authentication credentials.
            await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + btoa(
                        "invalid_user:wrong_password")
                }
            });
        } catch (error) {
            console.log("Browser credential cache cleared.");
        }

        // Reload the page to refresh the application interface.
        window.location.reload();

    } catch (e) {
        console.error("Logout transmission crash:", e);
    }
}