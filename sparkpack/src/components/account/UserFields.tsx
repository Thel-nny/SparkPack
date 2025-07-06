import React from "react";

interface UserFieldsProps {
  formState: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UserFields({ formState, handleChange }: UserFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="firstName" className="block font-medium">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formState.firstName || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block font-medium">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formState.lastName || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="phoneNum" className="block font-medium">Phone Number</label>
        <input
          id="phoneNum"
          name="phoneNum"
          type="text"
          value={formState.phoneNum || ""}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
    </>
  );
}
