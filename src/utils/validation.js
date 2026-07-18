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
      errMessage = 'Phone number must be between 9 and 11 digits';
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
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 12) {
          errMessage = 'Member must be at least 12 years old (verify Date of Birth is correct)';
        }
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
  ['fullName', 'phoneNumber', 'dob'].forEach(field => {
    const err = validateField(field, form[field]);
    if (err) newErrors[field] = err;
  });
  return newErrors;
};

export const validateBillingForm = (form) => {
  const newErrors = {};
  if (!form.planID) newErrors.planID = 'Please select a gym plan';
  
  const discountErr = validateField('discount', form.discount);
  if (discountErr) newErrors.discount = discountErr;

  if (!form.paymentMethod) newErrors.paymentMethod = 'Please select a gateway';

  return newErrors;
};
