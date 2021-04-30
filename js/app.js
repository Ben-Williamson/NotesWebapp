var simplemde;
var openNoteID;
var notes = {};

function app() {
    updateUI();

    MathJax.Hub.Config({
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
    });

    var QUEUE = MathJax.Hub.queue;
    simplemde = new SimpleMDE({
        element: document.getElementById("md-editor"),
        spellChecker: false,
        previewRender: function(plainText) {
            var preview = document.getElementsByClassName("editor-preview-side")[0];
            preview.innerHTML = this.parent.markdown(plainText);
            preview.setAttribute('id','editor-preview')
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"editor-preview"]);
            return preview.innerHTML;
        },
    });

    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
                event.preventDefault();
                var xhr = new XMLHttpRequest();
                var url = "https://benwilliamson.org:5000/updateNote";
                xhr.open("PUT", url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        updateUI();
                    }
                };
                var data = JSON.stringify({"title": document.getElementById("titleEdit").textContent, "content": simplemde.value(), "noteID": openNoteID})
                xhr.send(data);
                break;
            }
        }
    });
}
