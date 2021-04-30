function newNote() {
    var xhr = new XMLHttpRequest();
    var url = "https://benwilliamson.org:5000/addNote";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            updateUI();
        }
    };
    var data = JSON.stringify({"title": "New Note", "content": "# This is a new Note", "description": "New note added using the UI."})
    xhr.send(data);         
}

function openNote(noteID) {
    $("body").addClass("editmode");
    for(var i in notes) {
        if(notes[i].noteID == noteID) {
            openNoteID = notes[i].noteID;
            simplemde.value(notes[i].content);
            document.getElementById("titleEdit").innerText = notes[i].title;
        }
    }
}

function deleteNote(noteID) {
    fetch("https://benwilliamson.org:5000/deleteNote/" + noteID);
    $("#" + noteID).addClass("fadeout");
    setTimeout(function () {
        $("#" + noteID).remove();
    }, 600);
    
}

function noteToHTML(n) {
    date = n.date.split(" ")[0].split("-");
    date = "Modified: " + date[2] + " " + ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(date[1]) - 1] + " " + date[0];

    note = $(`<div id="` + n.noteID + `" class="grid-item">
                <div class="preview">
                    <h1 id="title">` + n.title + `</h1>
                    <p id="description">` + n.content.substring(0, 100) + `...</p>
                    <p id="date" class="date">` + date + `</p>
                </div>
                
                <div class="options">
                    <img onclick="deleteNote(` + n.noteID + `)" src="icons/delete.png">
                    <img onclick="openNote(` + n.noteID + `)" class="open" src="icons/open.png">
                </div>
            </div>`);

    return note;
}

function updateNote(n) {
    if(!$('#' + n.noteID).length > 0) {
        $(".grid-container").prepend(noteToHTML(n));
    } else {
        $("#" + n.noteID).html(noteToHTML(n).html());
    }
}


function saveNote(note) {
    console.log(note);
}


notes = {};

function updateUI() {
    fetch("https://benwilliamson.org:5000/getNotes").then(response => response.json()).then(data => {
        notes = data;
        for(i in data) {
            updateNote(data[i]);
        }
        for(i in notes) {
            if(notes[i].noteID == openNoteID) {
                simplemde.value(notes[i].content);
                document.getElementById("titleEdit").innerText = notes[i].title;
            }
        }
    });
}