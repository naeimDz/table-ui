document.addEventListener("DOMContentLoaded", () => {
    const tableData = [
        { id: 3, serial: "192371-8910/54", label: "Accessoire informatique", vendor: "ZyonTech", owner: "Harold Jackson", expiry: "18 juin 2023", status: "En cours d'utilisation", button: "Équipement retourné" },
        { id: 5, serial: "32x11PIP", label: "Accessoire informatique", vendor: "Pineapple", owner: "Sohrab Amin", expiry: "19 juin 2023", status: "Retourné", button: "Équipement retourné" },
        { id: 4, serial: "76x87PCY", label: "Ordinateur portable", vendor: "Pineapple", owner: "Matt Piccolella", expiry: "22 juin 2023", status: "En cours d'utilisation", button: "Équipement retourné" },
        { id: 6, serial: "36x10PIQ", label: "Accessoire informatique", vendor: "Pineapple", owner: "Esteban Balderas", expiry: "22 juin 2023", status: "À retourner", button: "Équipement retourné" },
        { id: 1, serial: "65XYQ/GB", label: "License", vendor: "Pixell", owner: "Ben Lang", expiry: "30 juin 2023", status: "Expiré", button: "Équipement retourné" },
        { id: 2, serial: "9MP11/GB", label: "License", vendor: "Pixell", owner: "Yojiro Kondo", expiry: "23 juillet 2024", status: "En cours d'utilisation", button: "Équipement retourné" },
        { id: 7, serial: "9A8SDAKH/WQ", label: "License", vendor: "Lime", owner: "Ben Lang", expiry: "15 août 2024", status: "En cours d'utilisation", button: "Équipement retourné" },
        { id: 8, serial: "192371-8910-1283", label: "License", vendor: "ZyonTech", owner: "Zoe Ludwig", expiry: "16 décembre 2027", status: "En cours d'utilisation", button: "Équipement retourné" },
        { id: 9, serial: "192371-9910-0017", label: "License", vendor: "ZyonTech", owner: "Matt Piccolella", expiry: "28 juin 2029", status: "En cours d'utilisation", button: "Équipement retourné" },
    ];

    const tableBody = document.querySelector("#inventoryTable tbody");

    tableData.forEach(data => {
        const row = document.createElement("tr");

        Object.keys(data).forEach(key => {
            const cell = document.createElement("td");
            if (key === "status") {
                cell.innerHTML = `<span class="status ${data[key].replace(/ /g, '-').toLowerCase()}">${data[key]}</span>`;
            } else if (key === "button") {
                cell.innerHTML = `<button>${data[key]}</button>`;
            } else {
                cell.textContent = data[key];
            }
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    // Sorting functionality
    document.querySelectorAll("#inventoryTable th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");

            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });

    function sortTableByColumn(table, column, asc = true) {
        const dirModifier = asc ? 1 : -1;
        const tBody = table.querySelector("tbody");
        const rows = Array.from(tBody.querySelectorAll("tr"));

        const sortedRows = rows.sort((a, b) => {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });

        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }

        tBody.append(...sortedRows);

        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        headerCell.classList.toggle("th-sort-asc", asc);
        headerCell.classList.toggle("th-sort-desc", !asc);
    }

  // Column resizing functionality
  let isResizing = false;
  let lastDownX = 0;
  let thElem;

  document.querySelectorAll(".resize-handle").forEach(handle => {
      handle.addEventListener("mousedown", (e) => {
          isResizing = true;
          lastDownX = e.clientX;
          thElem = e.target.parentElement;
          thElem.classList.add("resizing");
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
      });
  });

  function handleMouseMove(e) {
      if (!isResizing) return;
      const offsetRight = thElem.offsetWidth - (e.clientX - thElem.getBoundingClientRect().left);
      thElem.style.width = `${thElem.offsetWidth - offsetRight}px`;
  }

  function handleMouseUp() {
      if (!isResizing) return;
      isResizing = false;
      thElem.classList.remove("resizing");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
  }

   // Column reordering functionality
   let draggingCol;
   let draggingIndex;
   const headers = document.querySelectorAll("#inventoryTable th");

   headers.forEach((header, index) => {
       header.draggable = true;
       header.classList.add("draggable");

       header.addEventListener("dragstart", (e) => {
           draggingCol = e.target;
           draggingIndex = index;
           e.dataTransfer.effectAllowed = "move";
           e.dataTransfer.setData("text/html", e.target.innerHTML);
           setTimeout(() => {
               e.target.classList.add("dragging");
           }, 0);
       });

       header.addEventListener("dragover", (e) => {
           e.preventDefault();
           e.dataTransfer.dropEffect = "move";
       });

       header.addEventListener("drop", (e) => {
           e.stopPropagation();
           if (draggingCol !== e.target) {
               const targetIndex = Array.from(headers).indexOf(e.target);
               reorderColumns(draggingIndex, targetIndex);
               draggingCol.classList.remove("dragging");
               draggingCol = null;
           }
       });

       header.addEventListener("dragend", () => {
           draggingCol.classList.remove("dragging");
       });
   });

   function reorderColumns(fromIndex, toIndex) {
       const rows = document.querySelectorAll("#inventoryTable tr");
       rows.forEach(row => {
           const cells = row.children;
           if (cells.length > 1) {
               if (fromIndex < toIndex) {
                   row.insertBefore(cells[fromIndex], cells[toIndex + 1]);
               } else {
                   row.insertBefore(cells[fromIndex], cells[toIndex]);
               }
           }
       });
   }

   // Filtering functionality
   let filterArea = document.getElementById('filterArea');

   tableBody.addEventListener('dragstart', (e) => {
       if (e.target.tagName === 'TD') {
           e.dataTransfer.setData('text', e.target.textContent.trim());
           e.dataTransfer.effectAllowed = "copy";
       }
   });

   filterArea.addEventListener('dragover', (e) => {
       e.preventDefault();
       e.dataTransfer.dropEffect = "copy";
   });

   filterArea.addEventListener('drop', (e) => {
       e.preventDefault();
       const filterValue = e.dataTransfer.getData('text');
       applyFilter(filterValue);
   });

   function applyFilter(value) {
       const rows = Array.from(tableBody.querySelectorAll('tr'));
       rows.forEach(row => {
           const cells = Array.from(row.querySelectorAll('td'));
           const found = cells.some(cell => cell.textContent.trim() === value);
           if (found) {
               row.style.display = '';
           } else {
               row.style.display = 'none';
           }
       });
   }
});