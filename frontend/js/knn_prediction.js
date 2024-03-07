const k_nearest = document.getElementById('k-nearest');
document
  .getElementById('csvFileInput')
  .addEventListener('change', handleFileSelect, false);

const label = document.getElementById('label');
var radios = document.getElementsByName('attribute');

let csvData = null;
let file = null;

function handleFileSelect(event) {
  file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    displayCSV(contents);
    csvData = contents;
  };

  reader.readAsText(file);
}

function displayCSV(csvContent) {
  const lines = csvContent.split('\n');
  const tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = '';

  const table = document.createElement('table');

  // Add table heading
  const headingRow = document.createElement('tr');
  const headings = lines[0].split(',');
  headings.forEach(function (heading, index) {
    const th = document.createElement('th');
    th.classList.add('table-heading');
    th.appendChild(document.createTextNode(heading));
    // Exclude last heading from dropdown
    if (index < headings.length - 1) {
      let conditionDefaultDropdown = !isNaN(lines[1].split(',')[index])
        ? false
        : true;
      console.log(conditionDefaultDropdown);
      const dropdown = createDropdown(conditionDefaultDropdown);
      th.appendChild(dropdown);
    }

    headingRow.appendChild(th);
  });

  table.appendChild(headingRow);

  // Add table rows (maximum 5 rows)
  const maxRows = Math.min(lines.length - 1, 20); // Maximum 5 rows
  for (let i = 1; i <= maxRows; i++) {
    const row = document.createElement('tr');
    const cells = lines[i].split(',');

    cells.forEach(function (cell, index) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(cell));
      row.appendChild(td);
    });

    table.appendChild(row);
  }

  tableContainer.appendChild(table);
}

function createDropdown(isNumber) {
  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');
  const select = document.createElement('select');
  const option1 = document.createElement('option');
  option1.value = 'continuous';
  option1.text = 'Liên tục';
  select.appendChild(option1);
  const option2 = document.createElement('option');
  option2.value = 'discrete';
  option2.text = 'Rời rạc';
  select.appendChild(option2);

  // Kiểm tra giá trị của isNumber để đặt giá trị mặc định của dropdown
  if (isNumber) {
    select.value = 'discrete'; // Nếu isNumber là true, đặt giá trị mặc định là 'Rời rạc'
  } else {
    select.value = 'continuous'; // Ngược lại, đặt giá trị mặc định là 'Liên tục'
  }
  dropdown.appendChild(select);
  return dropdown;
}

document
  .getElementById('submit_knn_predict')
  .addEventListener('click', handleSubmit, false);

function handleSubmit() {
  if (!csvData) {
    alert('Vui lòng chọn tệp CSV.');
    return;
  }

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      var selectedValue = radios[i].value;
      console.log('Giá trị của radio button được chọn là: ' + selectedValue);
      break; // Nếu bạn chỉ muốn lấy giá trị của một radio button được chọn, bạn có thể thoát khỏi vòng lặp ngay sau khi tìm thấy radio được chọn.
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('distance_calculation', selectedValue);
  formData.append('k_nearest', k_nearest.value);

  axios
    .post('http://localhost:8000/knn-prediction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data.file);
      // Your JSON data
      var jsonData = response.data.file;

      // Clear existing table content
      clearTable();

      // Get the table header row
      var headerRow = document.getElementById('headerRow');

      // Dynamic headers
      var headers = Object.keys(jsonData);
      for (var i = 0; i < headers.length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[i]));
        headerRow.appendChild(th);
      }

      // Get the table body
      var tableBody = document
        .getElementById('dataTable')
        .getElementsByTagName('tbody')[0];

      // Loop through the data and create table rows
      var numRows = Object.values(jsonData[headers[0]]).length;
      for (var i = 0; i < numRows; i++) {
        var row = tableBody.insertRow(i);

        // Loop through headers to create cells
        for (var j = 0; j < headers.length; j++) {
          var cell = row.insertCell(j);
          cell.innerHTML = jsonData[headers[j]][i];
        }
      }
    });
}

// Function to clear table content
function clearTable() {
  var tableBody = document
    .getElementById('dataTable')
    .getElementsByTagName('tbody')[0];
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  var headerRow = document.getElementById('headerRow');
  while (headerRow.firstChild) {
    headerRow.removeChild(headerRow.firstChild);
  }
}
