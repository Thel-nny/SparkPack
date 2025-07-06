import React from "react";

interface ClientDetailsFieldsProps {
  formState: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ClientDetailsFields({ formState, handleChange }: ClientDetailsFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="dob" className="block font-medium">Date of Birth</label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={formState.dob || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="pob" className="block font-medium">Place of Birth</label>
        <input
          id="pob"
          name="pob"
          type="text"
          value={formState.pob || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block font-medium">Gender</label>
        <input
          id="gender"
          name="gender"
          type="text"
          value={formState.gender || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="streetAddress" className="block font-medium">Street Address</label>
        <input
          id="streetAddress"
          name="streetAddress"
          type="text"
          value={formState.streetAddress || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="country" className="block font-medium">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          value={formState.country || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="city" className="block font-medium">City</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formState.city || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="province" className="block font-medium">Province</label>
        <input
          id="province"
          name="province"
          type="text"
          value={formState.province || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="postalCode" className="block font-medium">Postal Code</label>
        <input
          id="postalCode"
          name="postalCode"
          type="text"
          value={formState.postalCode || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div className="flex items-center">
        <input
          id="declarationAccuracy"
          name="declarationAccuracy"
          type="checkbox"
          checked={formState.declarationAccuracy || false}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="declarationAccuracy" className="font-medium">Declaration Accuracy</label>
      </div>
    </>
  );
}
