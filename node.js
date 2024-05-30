document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("listForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const directory = this.directory.value;
        fetch(`/list?directory=${encodeURIComponent(directory)}`)
            .then(response => response.json())
            .then(data => {
                const fileList = document.getElementById("fileList");
                fileList.innerHTML = "";
                data.files.forEach(file => {
                    const li = document.createElement("li");
                    li.textContent = file;
                    fileList.appendChild(li);
                });
            });
    });

    document.getElementById("createForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const directory = this.directory.value;
        fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ directory })
        }).then(response => response.text())
          .then(message => alert(message));
    });

    document.getElementById("uploadForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
          .then(message => alert(message));
    });

    document.getElementById("moveForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const src = this.src.value;
        const dest = this.dest.value;
        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ src, dest })
        }).then(response => response.text())
          .then(message => alert(message));
    });

    document.getElementById("deleteForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const file = this.file.value;
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file })
        }).then(response => response.text())
          .then(message => alert(message));
    });
});
