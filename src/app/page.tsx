"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { countryCodes } from "./_staticdata/codes";

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

type FormFields = {
  name: string;
  email: string;
  countryCode: { value: string; label: string };
  phone: string;
  address: string;
  pincode: number;
  date: string;
  time: string;
  reason: string;
  gender: { value: string; label: string };
};

/**
 * Renders a form component for generating an entry pass.
 * Uses react-hook-form for form validation and control.    
 * 
 * @returns The rendered form component.
 */
export default function Home() {
  // Destructure the necessary functions and objects from react-hook-form
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormFields>();

  /**
   * Handles the form submission.
   * Sends a POST request to generate a PDF with the form data.
   * If successful, downloads the generated PDF.
   * 
   * @param data - The form data submitted by the user.
   */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // Format the phone number with the country code
    const fullPhoneNumber = `${data.countryCode.value}${data.phone} (${data.countryCode.label})`;
    const formData = { ...data, phone: fullPhoneNumber };

    // Send a POST request to generate the PDF
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // If successful, download the generated PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'form-data.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Failed to generate PDF');
    }
  };

  return (
    <main>
      <h1 className="text-center m-4 text-2xl">
        Generate your own entry pass.
      </h1>
      <form className="m-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* Name input */}
        <input
          {...register("name", { required: true, maxLength: 20 })}
          type="text"
          placeholder="Name"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.name && <p className="text-red-500">Name is required.</p>}

        {/* Gender select */}
        <Controller
          name="gender"
          control={control}
          defaultValue={genders[0]}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              options={genders}
              className="rounded-md mb-2"
            />
          )}
        />
        {errors.gender && <p className="text-red-500">Gender is required.</p>}

        {/* Email input */}
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.email && <p className="text-red-500">Email is required.</p>}

        {/* Country code and phone number inputs */}
        <div className="flex items-center space-x-2">
          <Controller
            name="countryCode"
            control={control}
            defaultValue={countryCodes[0]}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={countryCodes}
                className="w-1/4"
              />
            )}
          />
          <input
            {...register("phone", { required: true, maxLength: 10 })}
            type="tel"
            placeholder="Phone"
            className="border border-gray-300 rounded-md p-2 mb-2 w-3/4"
          />
        </div>
        {errors.countryCode && <p className="text-red-500">Country code is required.</p>}
        {errors.phone && <p className="text-red-500">Phone is required and should be 10 digits.</p>}

        {/* Address input */}
        <input
          {...register("address", { required: true })}
          type="text"
          placeholder="Address"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.address && <p className="text-red-500">Address is required.</p>}

        {/* Pincode input */}
        <input
          {...register("pincode", { required: true, maxLength: 6, minLength: 6 })}
          type="text"
          placeholder="Pincode"
          pattern="[0-9]{6}"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.pincode && <p className="text-red-500">Pincode is required.</p>}

        {/* Date input */}
        <input
          {...register("date", { required: true })}
          type="date"
          placeholder="Date"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.date && <p className="text-red-500">Date is required.</p>}

        {/* Time input */}
        <input
          {...register("time", { required: true })}
          type="time"
          placeholder="Time"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.time && <p className="text-red-500">Time is required.</p>}

        {/* Reason textarea */}
        <textarea
          {...register("reason", { required: true })}
          placeholder="Reason for visit"
          className="border border-gray-300 rounded-md p-2 mb-2"
        />
        {errors.reason && <p className="text-red-500">Reason is required.</p>}

        {/* Submit button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Generate
        </button>
      </form>
    </main>
  );
}
