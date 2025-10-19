// frontend/components/DetailsForm.tsx
import React, { useState, useEffect } from 'react';

interface DetailsFormProps {
  onSubmit: (details: { name?: string; age?: number; gender?: string }) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (name || age || gender) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [name, age, gender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name || undefined,
      age: age ? parseInt(age, 10) : undefined,
      gender: gender || undefined,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl shadow-lg bg-white font-poppins">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Tell us more about you</h1>
        <p className="text-gray-400">This will help us personalize your experience.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">
            Age (Optional)
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your age"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
            Gender (Optional)
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="shadow appearance-none border rounded-2xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition duration-300"
          >
            {isDirty ? 'Continue' : 'Skip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsForm;
