// frontend/components/DetailsForm.tsx
import React, { useState, useEffect } from 'react';

interface DetailsFormProps {
  onSubmit: (details: { name?: string; age?: number; gender?: string }) => void;
}

interface Errors {
  age: string;
  gender: string;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // --- NEW: State for validation ---
  const [errors, setErrors] = useState<Errors>({ age: '', gender: '' });
  const [touched, setTouched] = useState({ age: false, gender: false });
  const [isFormValid, setIsFormValid] = useState(false);
  // ---------------------------------

  useEffect(() => {
    // Load Poppins font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // --- NEW: Validation logic ---
  const validateField = (field: 'age' | 'gender', value: string): string => {
    if (field === 'age') {
      if (!value) return 'Age is required.';
      const ageNum = parseInt(value, 10);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return 'Please enter a valid age (1-120).';
      }
    }
    if (field === 'gender') {
      if (!value) return 'Gender is required.';
    }
    return '';
  };

  // --- NEW: Validate form on every change ---
  useEffect(() => {
    const ageError = validateField('age', age);
    const genderError = validateField('gender', gender);
    
    setErrors({
      age: ageError,
      gender: genderError,
    });

    // Form is valid if both fields are not empty and have no errors
    setIsFormValid(age !== '' && gender !== '' && !ageError && !genderError);

  }, [age, gender]);
  // -----------------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all as touched to show errors on submit attempt
    setTouched({ age: true, gender: true });

    // Re-check validity on submit
    const ageError = validateField('age', age);
    const genderError = validateField('gender', gender);

    if (ageError || genderError) {
      setErrors({ age: ageError, gender: genderError });
      setIsFormValid(false);
      return; // Stop submission
    }

    setIsFormValid(true);
    onSubmit({
      name: name.trim() || undefined,
      age: age ? parseInt(age, 10) : undefined, // Will be valid due to check
      gender: gender || undefined, // Will be valid due to check
    });
  };

  const handleBlur = (field: 'age' | 'gender') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Re-validate on blur
    if (field === 'age') {
      setErrors(prev => ({ ...prev, age: validateField('age', age) }));
    }
    if (field === 'gender') {
      setErrors(prev => ({ ...prev, gender: validateField('gender', gender) }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl shadow-lg bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="text-center mb-8">
        <h1 className="text-xl  text-gray-800">Tell us more about you</h1>
        <p className="text-gray-400">This will help us personalize your experience.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* --- Name (Optional) --- */}
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm  mb-2">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        {/* --- Age (Required) --- */}
        <div>
          <label htmlFor="age" className="block text-gray-700 text-sm mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onBlur={() => handleBlur('age')}
            className={`shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.age && errors.age ? 'border-red-500' : 'focus:border-blue-500'
            }`}
            placeholder="Enter your age"
            required
            aria-invalid={!!(touched.age && errors.age)}
            aria-describedby="age-error"
          />
          {touched.age && errors.age && (
            <p id="age-error" className="text-red-500 text-xs mt-1">{errors.age}</p>
          )}
        </div>

        {/* --- Gender (Required) --- */}
        <div>
          <label htmlFor="gender" className="block text-gray-700 text-sm mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            onBlur={() => handleBlur('gender')}
            className={`shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.gender && errors.gender ? 'border-red-500' : 'focus:border-blue-500'
            } ${gender === "" ? 'text-gray-400' : ''}`} // Style placeholder
            required
            aria-invalid={!!(touched.gender && errors.gender)}
            aria-describedby="gender-error"
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {touched.gender && errors.gender && (
            <p id="gender-error" className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>
        
        {/* --- Submit Button --- */}
        <div>
          <button
            type="submit"
            disabled={!isFormValid} // Disable based on validation state
            className=" font-semibold w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsForm;