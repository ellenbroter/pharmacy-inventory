// DECLARING AND INITIALIZING THE MEDICINES ARRAY
let medicines = [];

// SELECTING ELEMENTS
const medicineForm = document.querySelector('.medicine-form');
const nameInput = document.querySelector(".name");
const manufacturerInput = document.querySelector(".manufacturer");
const expiryDateInput = document.querySelector(".expdate");
const quantityInput = document.querySelector(".quantity");
const submitButton = document.querySelector(".submit-button");
const medicinesUl = document.querySelector('.display-medicines-list');
const medicinesTotal = document.querySelector('.display-medicines-total');

class Medicine {
  constructor(name, manufacturer, expiryDate, quantity, id) {
    this.name = name;
    this.manufacturer = manufacturer;
    this.expiryDate = expiryDate;
    this.quantity = quantity;
    this.id = id;
  }

  static addMedicine(medicine) {
    console.log(`${medicine.manufacturer} ${medicine.name} has been added to the inventory.`);
  }

  static deleteMedicine(medicines, id) {
    const index = medicines.findIndex(medicine => medicine.id === id);
    if (index !== -1) {
      medicines.splice(index, 1);
    }
  }

  toJSON() {
    return {
      name: this.name,
      manufacturer: this.manufacturer,
      expiryDate: this.expiryDate,
      quantity: this.quantity,
      id: this.id,
    };
  }
}

class Tablet extends Medicine {
  constructor(name, manufacturer, selectElement, expiryDate, quantity, id) {
    super(name, manufacturer, expiryDate, quantity, id);
    this.selectElement = selectElement;
  }
}

class Suspension extends Medicine {
  constructor(name, manufacturer, selectElement, expiryDate, quantity, id) {
    super(name, manufacturer, expiryDate, quantity, id);
    this.selectElement = selectElement;
  }
}

function validateForm(name, manufacturer, expiryDate, quantity) {
  if (!name || !manufacturer || !expiryDate || !quantity) {
    displayErrorMessage("Please fill in all fields.");
    return false;
  }
  return true;
}

// FORM SUBMISSION EVENT LISTENER
medicineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const manufacturer = manufacturerInput.value;
  const selectElement = document.querySelector('input[name="category"]:checked') ? document.querySelector('input[name="category"]:checked').value : '';
  const expiryDate = expiryDateInput.value;
  const quantity = quantityInput.value;

  if (!validateForm(name, manufacturer, expiryDate, quantity)) {
    return;
  }


  const existingMedicine = medicines.find(medicine =>
    medicine.name === name &&
    medicine.manufacturer === manufacturer &&
    medicine.selectElement === selectElement &&
    medicine.expiryDate === expiryDate
  );

  if (selectElement == 'tablet') {
    if (existingMedicine) {
      existingMedicine.quantity = parseInt(existingMedicine.quantity) + parseInt(quantity);
    } else {
      const id = Date.now();
      const newMedicine = new Tablet(name, manufacturer, selectElement, expiryDate, quantity, id);
      medicines.push(newMedicine);
      Medicine.addMedicine(newMedicine);
    }
  } else if (selectElement == 'suspension') {
    if (existingMedicine) {
      existingMedicine.quantity = parseInt(existingMedicine.quantity) + parseInt(quantity);
    } else {
      const id = Date.now();
      const newMedicine = new Suspension(name, manufacturer, selectElement, expiryDate, quantity, id);
      medicines.push(newMedicine);
      Medicine.addMedicine(newMedicine);
    }
  }

  updateDisplay();
  saveMedicinesToLocalStorage();

  // CLEAR THE FORM AFTER SUCCESSFUL SUBMISSION
  nameInput.value = '';
  manufacturerInput.value = '';
  selectElement.value = '';
  expiryDateInput.value = '';
  quantityInput.value = '';
});

// FUNCTION TO FORMAT EXPIRY DATE
function formatExpiryDate(expiryDate) {
  const formattedDate = new Date(expiryDate);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return formattedDate.toLocaleDateString(undefined, options);
}

// RETRIEVE MEDICINES ARRAY FROM LOCAL STORAGE
function getMedicinesFromLocalStorage() {
  try {
    const savedMedicines = JSON.parse(localStorage.getItem('medicines')) || [];
    if (!Array.isArray(savedMedicines)) {
      throw new Error('Invalid data format in local storage.');
    }
    return savedMedicines;
  } catch (error) {
    console.error('Error retrieving data from local storage:', error);
    displayErrorMessage('Error retrieving data. Please refresh the page.');
    return [];
  }
}

// SAVE MEDICINES TO LOCAL STORAGE
function saveMedicinesToLocalStorage() {
  try {
    const stringifiedMedicines = JSON.stringify(medicines.map(medicine => medicine.toJSON()));
    localStorage.setItem('medicines', stringifiedMedicines);

    // HANDELING ERRORS
    const storedMedicines = JSON.parse(localStorage.getItem('medicines'));

    if (!Array.isArray(storedMedicines) || storedMedicines.length !== medicines.length) {
      throw new Error('Data mismatch or invalid data format in local storage.');
    }

    console.log('Medicines saved successfully to local storage!');
  } catch (error) {
    console.error('Error saving data to local storage:', error);
    displayErrorMessage('Error saving data. Please try again.');
  }
}

// DISPLAY ERROR MESSAGE
function displayErrorMessage(message) {
  const errorMessage = document.querySelector('.error-message');
  errorMessage.textContent = message;
  // You might want to hide the message after a few seconds or on the next user interaction
  setTimeout(() => {
    errorMessage.textContent = '';
  }, 5000); // 5000 milliseconds (adjust as needed)
}

// UPDATE DISPLAY OF MEDICINES
function updateDisplay() {
  medicinesUl.textContent = ''; 

  medicines.forEach(medicine => {
    displayMedicine(medicine);
  });
  medicinesTotal.textContent = `Total products: ${medicines.length}`;
}

// Function to display a medicine
function displayMedicine(medicine) {
  const liRow = document.createElement('li');
  const renderedId = document.createElement('span');
  const renderedName = document.createElement('span');
  const renderedManufacturer = document.createElement('span');
  const renderedSelectValue = document.createElement('span');
  const renderedExpiryDate = document.createElement('span');
  const renderedQuantity = document.createElement('span');
  const deleteButtonContainer = document.createElement('span');
  const deleteButton = document.createElement('button');

  renderedId.textContent = medicine.id.toString().slice(-4);
  renderedName.textContent = medicine.name;
  renderedManufacturer.textContent = medicine.manufacturer;
  renderedSelectValue.textContent = medicine.selectElement;
  renderedExpiryDate.textContent = formatExpiryDate(medicine.expiryDate);
  renderedQuantity.textContent = medicine.quantity;
  deleteButton.textContent = 'Delete';

  liRow.classList.add('medicines-row');
  deleteButton.classList.add('delete-button');

  liRow.dataset.id = medicine.id;

  medicinesUl.append(liRow);
  liRow.append(renderedId, renderedName, renderedManufacturer, renderedSelectValue, renderedExpiryDate, renderedQuantity, deleteButtonContainer);
  deleteButtonContainer.append(deleteButton);
}

// EVENT DELEGATION FOR DELETE BUTTON CLICK
medicinesUl.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-button')) {
    const liRow = e.target.closest('.medicines-row');
    const rowID = liRow.dataset.id;
    const medicineToDelete = medicines.find(m => m.id === parseInt(rowID));

    if (medicineToDelete) {
      Medicine.deleteMedicine(medicines, medicineToDelete.id);
      updateDisplay();
      saveMedicinesToLocalStorage();
    }
  }
});

// CHECK IF THERE ARE SAVED MEDICINES
const savedMedicines = getMedicinesFromLocalStorage();

// UPDATE THE MEDICINES ARRAY WITH THE SAVED DATA
medicines = savedMedicines.map(savedMedicine => new Medicine(
  savedMedicine.name,
  savedMedicine.manufacturer,
  savedMedicine.selectElement,
  savedMedicine.expiryDate,
  savedMedicine.quantity,
  savedMedicine.id
));

// UPDATE THE DISPLAY WITH THE SAVED MEDICINES
updateDisplay();