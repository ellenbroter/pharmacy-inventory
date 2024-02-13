// DECLARING AND INITIALIZING THE MEDICINES ARRAY
let medicines = [];

// SELECTING ELEMENTS
const medicineForm = document.querySelector('.medicine-form'); // Form element
const nameInput = document.querySelector(".name"); // Name input field
const manufactInput = document.querySelector(".manufacturer"); // Manufacturer input field
const selectElementInput = document.querySelector(".form"); // Select element input field
const expdateInput = document.querySelector(".expdate"); // Expiry date input field
const quantityInput = document.querySelector(".quantity"); // Quantity input field
const submitButton = document.querySelector(".submit-button"); // Submit button
const medicinesUl = document.querySelector('.display-medicines-list'); // Medicines list

// Medicine class
class Medicine {
  constructor(name, manufacturer, selectElement, expdate, quantity, id) {
    this.name = name;
    this.manufacturer = manufacturer;
    this.selectElement = selectElement;
    this.expdate = expdate;
    this.quantity = quantity;
    this.id = id;
  }

  static addMedicine(medicine) {
    console.log(`${medicine.manufacturer} ${medicine.name} has been added to the inventory.`);
  }

  deleteMedicine(medicines) {
    const index = medicines.findIndex(medicine => medicine.id === this.id);
    if (index !== -1) {
      medicines.splice(index, 1);
      console.log(`Medicine with ID ${this.id} has been deleted.`);
    }
  }
}

// Form validation function
function validateForm(name, manufacturer, expdate, quantity) {
  if (!name || !manufacturer || !expdate || !quantity) {
    alert("Please fill in all fields.");
    return false;
  }
  return true;
}

// Form submission event listener
medicineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const manufacturer = manufactInput.value;
  const selectElement = selectElementInput.value;
  const expdate = expdateInput.value;
  const quantity = quantityInput.value;

  if (!validateForm(name, manufacturer, expdate, quantity)) {
    return;
  }

  const existingMedicine = medicines.find(medicine =>
    medicine.name === name &&
    medicine.manufacturer === manufacturer &&
    medicine.selectElement === selectElement &&
    medicine.expdate === expdate
  );

  if (existingMedicine) {
    // If medicine already exists, update the quantity
    existingMedicine.quantity = parseInt(existingMedicine.quantity) + parseInt(quantity);
    console.log(`Quantity of existing medicine updated: ${existingMedicine.quantity}`);
  } else {
    // If medicine doesn't exist, add a new one
    const id = Date.now();
    const newMedicine = new Medicine(name, manufacturer, selectElement, expdate, quantity, id);
    medicines.push(newMedicine);
    Medicine.addMedicine(newMedicine);
  }

  updateDisplay();
  saveMedicinesToLocalStorage();

  // Clear the form after successful submission
  nameInput.value = '';
  manufactInput.value = '';
  selectElementInput.value = '';
  expdateInput.value = '';
  quantityInput.value = '';
});

// Function to format expiry date
function formatExpDate(expdate) {
  return new Date(expdate).toLocaleDateString('en-US');
}

// Retrieve medicines array from local storage
const savedMedicines = JSON.parse(localStorage.getItem('medicines'));

// Check if there are saved medicines
if (savedMedicines) {
  // Update the medicines array with the saved data
  medicines = savedMedicines.map(savedMedicine => new Medicine(
    savedMedicine.name,
    savedMedicine.manufacturer,
    savedMedicine.selectElement,
    savedMedicine.expdate,
    savedMedicine.quantity,
    savedMedicine.id
  ));

  // Update the display with the saved medicines
  updateDisplay();
}

// Function to save medicines to local storage
function saveMedicinesToLocalStorage() {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

// Function to update the display of medicines
function updateDisplay() {
  medicinesUl.innerHTML = ''; // Clear the existing list

  medicines.forEach(medicine => {
    displayMedicine(medicine);
  });
}

// Function to display a medicine in the list
function displayMedicine(medicine) {
  const liRow = document.createElement('li');
  const renderedId = document.createElement('span');
  const renderedName = document.createElement('span');
  const renderedManufacturer = document.createElement('span');
  const renderedSelectValue = document.createElement('span');
  const renderedExpdate = document.createElement('span');
  const renderedQuantity = document.createElement('span');
  const deleteButtonContainer = document.createElement('span');
  const deleteButton = document.createElement('button');

  renderedId.textContent = medicine.id.toString().slice(-4);
  renderedName.textContent = medicine.name;
  renderedManufacturer.textContent = medicine.manufacturer;
  renderedSelectValue.textContent = medicine.selectElement;
  renderedExpdate.textContent = formatExpDate(medicine.expdate);
  renderedQuantity.textContent = medicine.quantity;
  deleteButton.textContent = 'Delete';

  liRow.classList.add('medicines-row');
  deleteButton.classList.add('delete-button');

  liRow.dataset.id = medicine.id;

  medicinesUl.append(liRow);
  liRow.append(renderedId, renderedName, renderedManufacturer, renderedSelectValue, renderedExpdate, renderedQuantity, deleteButtonContainer);
  deleteButtonContainer.append(deleteButton);

  deleteButton.addEventListener('click', () => {
    console.log('Delete button clicked'); // Check if this log is displayed
    const rowID = liRow.dataset.id;
    const medicineToDelete = medicines.find(m => m.id === parseInt(rowID));
    
    if (medicineToDelete) {
      medicineToDelete.deleteMedicine(medicines);
      updateDisplay();
      saveMedicinesToLocalStorage();
    }
  });
}