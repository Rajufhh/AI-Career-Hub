"use client";
import { Country, State } from "country-state-city";
// import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  //   const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    // username: session?.user?.name || "",
    country: "",
    state: "",
    domain: "",
    guidedCareerPath: "",
    guidedCareerDetails: "",
    gender: "",
    race: "",
    skills: [],
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const domains = ["web", "app", "blockchain", "other"];
  const genders = ["male", "female", "other"];
  const races = [
    "American Indian or Alaska Native",
    "Asian",
    "Black or African American",
    "Hispanic or Latino",
    "Native Hawaiian or Other Pacific Islander",
    "White",
    "Two or More Races",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //   const response = await fetch("/api/user/complete-profile", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(formData),
      //   });
      console.log(JSON.stringify(formData));

      //   const data = await response.json();

      //   if (data.success) {
      //     router.push("/dashboard"); // Redirect to dashboard after completion
      //   }
    } catch (error) {
      console.error("Error completing profile:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div>
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full p-2 border font-semibold text-[#E04E3A] rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Country</label>
          <select
            name="country"
            id="country"
            required
            className="w-full p-2 border rounded font-semibold text-[#E04E3A]"
            value={formData.country}
            onChange={handleInputChange}
          >
            <option value=""></option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {formData.country && (
          <div>
            <label className="block mb-2">State</label>
            <select
              name="state"
              id="state"
              required
              className="w-full p-2 border rounded font-semibold text-[#E04E3A]"
              value={formData.state}
              onChange={handleInputChange}
            >
              <option value=""></option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-2">Domain</label>
          <select
            name="domain"
            id="domain"
            required
            className="w-full p-2 border rounded font-semibold text-[#E04E3A]"
            value={formData.domain}
            onChange={handleInputChange}
          >
            <option value=""></option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {formData.domain === "other" && (
          <div>
            <label className="block mb-2">Specify Domain</label>
            <input
              type="text"
              name="otherDomain"
              id="otherDomain"
              required
              className="w-full p-2 border rounded font-semibold text-[#E04E3A]"
              value={formData.otherDomain}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div>
          <label className="block mb-2">Gender</label>
          <div className="mt-2 space-y-2">
            {genders.map((gender) => (
              <div key={gender} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  id={`gender-${gender}`}
                  checked={formData.gender === gender}
                  onChange={handleInputChange}
                  className="focus:bg-red-500 h-4 w-4 text-[#E04E3A] border-gray-300"
                />
                <label
                  htmlFor={`gender-${gender}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2">Race</label>
          <select
            name="race"
            id="race"
            required
            className="w-full p-2 border rounded font-semibold text-[#E04E3A]"
            value={formData.race}
            onChange={handleInputChange}
          >
            <option value=""></option>
            {races.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>

        {/* Add other form fields similarly */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
}
