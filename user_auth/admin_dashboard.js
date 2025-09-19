document.getElementById('addCarForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('make', document.getElementById('make').value);
  formData.append('model', document.getElementById('model').value);
  formData.append('year', document.getElementById('year').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('color', document.getElementById('color').value);
  formData.append('brand', document.getElementById('brand').value);
  formData.append('image', document.getElementById('image').files[0]);
  
// Get token from URL if present (for social login/signup)
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (token) {
  localStorage.setItem("authToken", token);
  // Optionally, clean up the URL so token isn't visible anymore:
  window.history.replaceState({}, document.title, "user_dashboard.html");
}
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    alert('You are not logged in. Please log in to add a car.');
    return;
  }

  try {
    const response = await fetch('https://car-rental-api-ks0u.onrender.com/api/cars/add-car', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert('Car added successfully!');
      addCarToDashboard(result.car);
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error adding car:', error);
    alert('An error occurred. Please try again.');
  }
});

// Function to dynamically add a car to the dashboard
function addCarToDashboard(car) {
  const carList = document.getElementById('carList');

  const carCard = document.createElement('div');
  carCard.className = 'bg-white shadow-md rounded overflow-hidden';

  carCard.innerHTML = `
    <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-48 object-cover">
    <div class="p-4">
      <h3 class="text-lg font-bold">${car.make} ${car.model}</h3>
      <p class="text-gray-700">${car.description}</p>
      <p class="text-gray-700"><span class="font-bold">Year:</span> ${car.year}</p>
      <p class="text-gray-700"><span class="font-bold">Price:</span> $${car.price}</p>
      <p class="text-gray-700"><span class="font-bold">Color:</span> ${car.color}</p>
      <p class="text-gray-700"><span class="font-bold">Brand:</span> ${car.brand}</p>
      <p class="text-gray-700"><span class="font-bold">Status:</span> ${car.status}</p>
      <p class="text-gray-700"><span class="font-bold">Rented By:</span> ${car.rentedBy ? car.rentedBy.name : 'Not Rented'}</p>
      <button class="bg-red-600 text-white font-bold rounded px-4 py-2 mt-4 hover:bg-red-700 delete-btn" data-id="${car._id}">Delete</button>
    </div>
  `;

  carList.appendChild(carCard);

  // Add delete button functionality
  carCard.querySelector('.delete-btn').addEventListener('click', async () => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await fetch(`https://car-rental-api-ks0u.onrender.com/api/cars/delete-car/${car._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert('Car deleted successfully!');
        carList.removeChild(carCard);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('An error occurred. Please try again.');
    }
  });
}