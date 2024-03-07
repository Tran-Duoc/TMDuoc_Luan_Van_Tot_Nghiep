document
  .getElementById('csvFileInput')
  .addEventListener('change', handleFileSelect);
document.getElementById('submitButton').addEventListener('click', handleSubmit);

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
      let conditionDefaultDropdown =
        typeof lines[1].split(',')[index + 1] !== 'string' ? false : true;

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

function handleSubmit() {
  if (!csvData) {
    alert('Vui lòng chọn tệp CSV.');
    return;
  }

  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tr');
  const headers = rows[0].querySelectorAll('th');
  var divElement = document.querySelector('.step');

  var radios = document.getElementsByName('attribute');

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      var selectedValue = radios[i].value;
      console.log('Giá trị của radio button được chọn là: ' + selectedValue);
      break; // Nếu bạn chỉ muốn lấy giá trị của một radio button được chọn, bạn có thể thoát khỏi vòng lặp ngay sau khi tìm thấy radio được chọn.
    }
  }

  const cellValues = [];
  for (let i = 0; i < headers.length; i++) {
    if (i < headers.length - 1) {
      const select = headers[i].querySelector('select');
      const selectedOption = select.options[select.selectedIndex].value;
      cellValues.push(selectedOption);
    } else {
      cellValues.push('');
    }
  }

  var continuous_attributes = [];
  for (let i = 0; i < cellValues.length - 1; i++) {
    if (cellValues[i] === 'continuous') {
      continuous_attributes.push(i);
    }
  }
  if (continuous_attributes.length === 0) {
    continuous_attributes = 'empty';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', selectedValue);
  formData.append('conti_attribute', continuous_attributes.toString());
  console.log('Selected Value', selectedValue);
  console.log('continous', continuous_attributes);
  axios
    .post('http://localhost:8000/decision-tree-c45', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.data['error'] == 'yes') {
        alert(
          'Có lỗi xảy ra, hãy kiểm tra lại dữ liệu và đảm bảo không có dữ liệu thiếu'
        );
      } else {
        steps = response.data['steps'];

        while (divElement.firstChild) {
          divElement.removeChild(divElement.firstChild);
        }

        [...steps].forEach(function (element, index) {
          var spanElement = document.createElement('li'); // Tạo thẻ span mới
          if (element.includes('Bước')) {
            spanElement.classList.add('bold'); // Thêm lớp "bold" cho thẻ span
          }

          if (element.toLowerCase().includes('entropy')) {
            spanElement.style.display = 'list-item'; // Thêm lớp "bold" cho thẻ span
          }
          spanElement.textContent = element; // Đặt nội dung cho thẻ span

          divElement.appendChild(spanElement);
          // if (index !== steps.length - 1) {
          //     var brElement = document.createElement('br'); // Tạo thẻ br mới
          //     divElement.appendChild(brElement); // Thêm thẻ br vào thẻ div
          // } // Thêm thẻ span vào thẻ div
        });
        init();
        drawTree(response.data);
      }
    })
    .catch((error) => {
      console.log('Nội dung lỗi:', error);
      alert(
        'Có lỗi xảy ra, hãy kiểm tra lại dữ liệu và đảm bảo không có dữ liệu thiếu'
      );
    });
}

var fileInput = document.getElementById('csvFileInput');
var myDiagram;
function init() {
  if (myDiagram) {
    // Diagram đã tồn tại, bạn có thể thực hiện các thay đổi tại đây nếu cần
    // Ví dụ: myDiagram.model = ...
    return;
  }
  var $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, 'myDiagramDiv', {
    initialContentAlignment: go.Spot.Center,
  });

  // Định nghĩa các mẫu nút cho các nút quyết định và các nút lá
  myDiagram.nodeTemplateMap.add(
    'decision',
    $(
      go.Node,
      'Auto',
      $(go.Shape, 'Rectangle', { fill: 'lightblue' }),
      $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'text'))
    )
  );

  myDiagram.nodeTemplateMap.add(
    'leaf',
    $(
      go.Node,
      'Auto',
      $(go.Shape, 'Ellipse', { fill: 'lightgreen' }),
      $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'text'))
    )
  );

  // Định nghĩa mẫu liên kết để có nhãn trên đường đi
  myDiagram.linkTemplate = $(
    go.Link,
    $(go.Shape), // this is the link shape (the line)
    $(go.Shape, { toArrow: 'Standard' }), // this is an arrowhead
    $(
      go.TextBlock, // this is a Link label
      new go.Binding('text', 'label')
    )
  );

  fileInput.addEventListener('change', handleFileSelect);
}

function convertDataToTree(data) {
  // Chuyển đổi dữ liệu thành dữ liệu cây
  // Ví dụ:
  var nodeDataArray = [];
  var tree = data['message'];
  var linkDataArray = [];
  //   console.log(tree)
  for (let i = 0; i < tree.length; i++) {
    if (tree[i]['label'] !== null) {
      nodeDataArray.push({
        key: i,
        text: tree[i]['label'],
        category: 'leaf',
      });
    } else {
      nodeDataArray.push({
        key: tree[i]['split_attribute'],
        text: tree[i]['split_attribute'],
        category: 'decision',
      });
    }
  }
  for (let i = 1; i < tree.length; i++) {
    if (tree[i]['label'] !== null) {
      linkDataArray.push({
        from: tree[i]['parent'],
        to: i,
        visible: true,
        label: tree[i]['order'],
      });
    } else {
      linkDataArray.push({
        from: tree[i]['parent'],
        to: tree[i]['split_attribute'],
        visible: true,
        label: tree[i]['order'],
      });
    }
  }

  //   console.log(nodeDataArray)

  return { nodeDataArray, linkDataArray };
}

function drawTree(data) {
  myDiagram.model = go.Model.fromJson(convertDataToTree(data));
}

// Gọi hàm init() khi tải xong trang
init();