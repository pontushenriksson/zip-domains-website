let displayLimit = 250;
let totalData = [];
let filteredData = [];
let totalWidth = 0;
let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

// Fetch and parse data
fetch('https://raw.githubusercontent.com/zzhsec/zip/main/zip-domains.csv')
  .then(response => response.text())
  .then(data => {
    totalData = parseCsv(data);
    filteredData = totalData;
    displayData(filteredData.slice(0, displayLimit));
  });

// Handle "Load More" button click
const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.addEventListener('click', () => {
  displayLimit += 250;
  displayData(filteredData.slice(0, displayLimit));
});

// Handle search
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', e => {
  const searchTerm = e.target.value;
  filteredData = totalData.filter(item => item.Domain.includes(searchTerm));
  displayLimit = 250; // reset display limit
  document.querySelector('main').innerHTML = ''; // clear current data
  displayData(filteredData.slice(0, displayLimit));
});

function parseCsv(data) {
  const lines = data.split('\n');
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

function displayData(data) {
  const mainElement = document.querySelector('main');

  data.forEach(item => {
    const table = document.createElement('table');
    const headersRow = document.createElement('tr');
    const dataRow = document.createElement('tr');

    for (const property in item) {
      const headerCell = document.createElement('th');
      const dataCell = document.createElement('td');

      headerCell.textContent = property;
      dataCell.textContent = item[property];

      headersRow.appendChild(headerCell);
      dataRow.appendChild(dataCell);
    }

    table.appendChild(headersRow);
    table.appendChild(dataRow);

    let dummy = table.cloneNode(true);
    dummy.style.visibility = 'hidden';
    mainElement.appendChild(dummy);
    let dummyWidth = dummy.getBoundingClientRect().width;
    mainElement.removeChild(dummy);

    if (totalWidth + dummyWidth > 0.95 * vw) {
      mainElement.appendChild(document.createElement('br'));
      totalWidth = 0;
    }
    mainElement.appendChild(table);
    totalWidth += dummyWidth;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.id = 'buttonGroup';

    const websiteButton = document.createElement('button');
    websiteButton.className = 'website-button';
    websiteButton.innerHTML = '<i class="fa-solid fa-eye"></i> Go to website';
    websiteButton.onclick = function () {
      document.querySelector('#modal').style.display = 'block';
      document.querySelector('#visit-link').href = 'http://' + item['host'];
      document.querySelector('#visit-link').target = '_blank';
    };

    const reportButton = document.createElement('button');
    reportButton.className = 'report-button';
    reportButton.innerHTML = '<i class="fa-solid fa-flag"></i> Report website';
    reportButton.onclick = function () {
      window.open('https://reportfraud.ftc.gov/#/assistant', '_blank');
    };

    buttonContainer.appendChild(websiteButton);
    buttonContainer.appendChild(reportButton);

    mainElement.appendChild(buttonContainer);
  });
}

function closeModal() {
  document.querySelector('#modal').style.display = 'none';
}
