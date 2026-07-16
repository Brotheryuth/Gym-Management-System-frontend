export const validateField = (field, value) => {
  let errMessage = '';
  
  if (field === 'fullName') {
    if (!value.trim()) {
      errMessage = 'Full name is required';
    } else if (value.trim().length < 2) {
      errMessage = 'Name must be at least 2 characters long';
    }
  }

  if (field === 'phoneNumber') {
    const cleanPhone = value.replace(/\s+/g, '');
    const phoneRegex = /^\d{9,11}$/;
    if (!cleanPhone) {
      errMessage = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      errMessage = 'Enter a valid digit sequence (9 to 11 numbers)';
    }
  }

  if (field === 'dob') {
    if (!value) {
      errMessage = 'Date of birth is required';
    } else {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        errMessage = 'Date of birth cannot be in the future';
      }
    }
  }

  if (field === 'discount') {
    const val = Number(value);
    if (isNaN(val) || val < 0 || val > 100) {
      errMessage = 'Discount must be between 0% and 100%';
    }
  }

  return errMessage;
};

export const validateProfileForm = (form) => {
  const newErrors = {};
  if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
  if (form.fullName.trim().length > 0 && form.fullName.trim().length < 2) {
    newErrors.fullName = 'Name must be at least 2 characters long';
  }
  
  const phoneRegex = /^\d{9,11}$/;
  if (!form.phoneNumber.trim()) {
    newErrors.phoneNumber = 'Phone number is required';
  } else if (!phoneRegex.test(form.phoneNumber.replace(/\s+/g, ''))) {
    newErrors.phoneNumber = 'Phone number must be between 9 and 11 digits';
  }

  if (!form.dob) {
    newErrors.dob = 'Date of birth is required';
  } else {
    const birthDate = new Date(form.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 12) {
      newErrors.dob = 'Member must be at least 12 years old (verify Date of Birth is correct)';
    }
  }

  return newErrors;
};

export const validateBillingForm = (form) => {
  const newErrors = {};
  if (!form.planID) newErrors.planID = 'Please select a gym plan';
  
  const discountVal = Number(form.discount);
  if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
    newErrors.discount = 'Discount must be between 0 and 100';
  }

  if (!form.paymentMethod) newErrors.paymentMethod = 'Please select a gateway';

  return newErrors;
};
