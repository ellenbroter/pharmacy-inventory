// DECLARING AND INITIALIZING THE MEDICINES ARRAY
let medicines = [];

// SELECTING ELEMENTS
const medicineForm = document.querySelector('.medicine-form')

const nameInput = document.querySelector(".name");
const idInput = document.querySelector(".prod-id");
const manufactInput = document.querySelector(".manufacturer");
const expdateInput = document.querySelector(".expdate");
const quantityInput = document.querySelector(".quantity");
const submitButton = document.querySelector(".submit-button");

const medicinesUl = document.querySelector('.display-medicines-list')

const displayMedicineContainer = document.querySelector(".display-medicine-container");

medicineForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const id = idInput.value;
  const manufacturer = manufactInput.value;
  const expdate = expdateInput.value;
  const quantity = quantityInput.value;

  // Check if the medicine with the same ID already exists
  const existingMedicine = medicines.find(medicine => medicine.id === id);
  if (existingMedicine) {
    alert("A medicine with the same ID already exists. Please enter a unique ID.");
    return;
  }

  const newMedicine = new Medicine(name, id, manufacturer, expdate, quantity);

  Medicine.addMedicine(newMedicine);
  console.log(newMedicine);
  console.log(medicines);

  // Save medicines array to local storage
  localStorage.setItem('medicines', JSON.stringify(medicines));
});


// Retrieve medicines array from local storage
const savedMedicines = JSON.parse(localStorage.getItem('medicines'));

// Check if there are saved medicines
if (savedMedicines) {
  // Update the medicines array with the saved data
  medicines = savedMedicines;

  // Update the display with the saved medicines
  updateDisplay();
}


class Medicine {
	constructor(name, id, manufacturer, expdate, quantity){
		this.name = name;
		this.id = id;
		this.manufacturer = manufacturer;
		this.expdate = expdate;
    this.quantity = quantity;
	}
  static addMedicine(medicine) {
    medicines.push(medicine);
    displayMedicine(medicine);
  }

  static deleteMedicine(id) {
    medicines = medicines.filter(medicine => medicine.id !== id);
    updateDisplay();
    
    // Save updated medicines array to local storage
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }
}

// Add this function to update the display after deleting a medicine
function updateDisplay() {
  medicinesUl.innerHTML = ''; // Clear the existing list

  medicines.forEach(medicine => {
    displayMedicine(medicine);
  });
}

function displayMedicine(medicine) {
  const liRow = document.createElement('li');
  const renderedName = document.createElement('span');
  const renderedId = document.createElement('span');
  const renderedManufacturer = document.createElement('span');
  const renderedExpdate = document.createElement('span');
  const renderedQuantity = document.createElement('span');
  const deleteButtonContainer = document.createElement('span');
  const deleteButton = document.createElement('button');

  renderedName.textContent = medicine.name;
  renderedId.textContent = medicine.id;
  renderedManufacturer.textContent = medicine.manufacturer;
  renderedExpdate.textContent = medicine.expdate;
  renderedQuantity.textContent = medicine.quantity;
  deleteButton.textContent = 'Delete';

  liRow.classList.add('medicines-row');
  deleteButton.classList.add('delete-button');

  liRow.dataset.id = medicine.id;

  medicinesUl.append(liRow);
  liRow.append(renderedName, renderedId, renderedManufacturer, renderedExpdate, renderedQuantity, deleteButtonContainer);
  deleteButtonContainer.append(deleteButton);

  deleteButton.addEventListener('click', (e) => {
    const rowID = e.currentTarget.parentElement.parentElement.dataset.id;
    Medicine.deleteMedicine(rowID, medicines);
  });
}
