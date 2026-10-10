const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const statusP = document.getElementById("status");
const notesList = document.getElementById("notes-list");

// In-memory array to store current notes
let notesData = [];

/**
 * Reusable async request wrapper that checks response.ok and throws on errors.
 */
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
    }
    // Check if response has content to parse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    return null;
}

/**
 * Render notes array to the DOM using textContent only to prevent XSS.
 */
function renderNotes() {
    notesList.innerHTML = "";

    if (notesData.length === 0) {
        const li = document.createElement("li");
        li.className = "empty-state";
        li.textContent = "No notes available.";
        notesList.appendChild(li);
        return;
    }

    notesData.forEach((note) => {
        const li = document.createElement("li");
        li.className = "note-item";
        li.dataset.id = note.id;

        const titleEl = document.createElement("h3");
        titleEl.textContent = note.title;

        const bodyEl = document.createElement("p");
        bodyEl.textContent = note.body || "(No body provided)";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        
        // Event listener for deleting a note
        deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

        li.appendChild(titleEl);
        li.appendChild(bodyEl);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

/**
 * Task 1: Load 10 notes via GET request.
 */
async function loadNotes() {
    loadBtn.disabled = true;
    statusP.textContent = "Loading notes...";
    statusP.className = "status-loading";

    try {
        const data = await request(`${API_URL}?_limit=10`);
        notesData = data;
        renderNotes();
        statusP.textContent = `Loaded ${notesData.length} notes from the server.`;
        statusP.className = "status-success";
    } catch (error) {
        console.error("Load error:", error);
        statusP.textContent = "Failed to load notes. Please check your network connection.";
        statusP.className = "status-error";
    } finally {
        loadBtn.disabled = false;
    }
}

/**
 * Task 2: Create a note via POST request with validation.
 */
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation: Title is required and max 100 characters
    if (!title) {
        statusP.textContent = "Error: Note title is required.";
        statusP.className = "status-error";
        return;
    }
    if (title.length > 100) {
        statusP.textContent = "Error: Title cannot exceed 100 characters.";
        statusP.className = "status-error";
        return;
    }

    submitBtn.disabled = true;
    statusP.textContent = "Creating note...";
    statusP.className = "status-loading";

    try {
        const newNotePayload = {
            title,
            body,
            userId: 1
        };

        const createdNote = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(newNotePayload)
        });

        // Add returned note to the top of the list
        notesData.unshift(createdNote);
        renderNotes();

        // Clear form inputs
        noteForm.reset();

        statusP.textContent = `Note created (status 201, id ${createdNote.id}).`;
        statusP.className = "status-success";
    } catch (error) {
        console.error("Create error:", error);
        statusP.textContent = "Failed to create note. Please try again.";
        statusP.className = "status-error";
    } finally {
        submitBtn.disabled = false;
    }
}

/**
 * Task 3: Delete a note via DELETE request.
 * Note on JSONPlaceholder: JSONPlaceholder simulates DELETE requests successfully (returning 200 OK)
 * but does not persistently mutate server state. Therefore, we remove the note from our local 
 * client array (notesData) and DOM immediately to provide a seamless user experience.
 */
async function deleteNote(id, listItemElement) {
    const deleteButton = listItemElement.querySelector(".delete-btn");
    deleteButton.disabled = true;
    statusP.textContent = `Deleting note ${id}...`;
    statusP.className = "status-loading";

    try {
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        // Remove from local array and update UI
        notesData = notesData.filter(note => note.id !== id);
        renderNotes();

        statusP.textContent = `Note ${id} deleted successfully.`;
        statusP.className = "status-success";
    } catch (error) {
        console.error("Delete error:", error);
        statusP.textContent = `Failed to delete note ${id}.`;
        statusP.className = "status-error";
        deleteButton.disabled = false;
    }
}

// Event Listeners
loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);
