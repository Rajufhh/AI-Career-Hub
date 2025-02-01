"use client";
import { Country, State } from "country-state-city";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/services/routeProtectionService";

export default function CompleteProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    country: "",
    state: "",
    domain: "",
    guidedCareerPath: "",
    guidedCareerDetails: "",
    race: "",
    skills: [],
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (document.body.scrollHeight > window.innerHeight) {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

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

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prevState) => ({
        ...prevState,
        skills: [...prevState.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    // Simulate redirection after completion
    // router.push("/dashboard");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D1117] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-300 mb-8">
              Fill out your details to get personalized career guidance and
              unlock your potential!
            </p>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              onKeyDown={handleKeyDown}
            >
              <div>
                <label className="block text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                  required
                >
                  <option value="" disabled hidden>
                    Select your gender
                  </option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                  required
                >
                  <option value="" disabled hidden>
                    Select your country
                  </option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.country && (
                <div>
                  <label className="block text-gray-400 mb-2">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                    required
                  >
                    <option value="" disabled hidden>
                      Select your state
                    </option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-400 mb-2">Domain</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                  required
                >
                  <option value="" disabled hidden>
                    Select your domain
                  </option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {formData.domain === "other" && (
                <div>
                  <label className="block text-gray-400 mb-2">
                    Specify Domain
                  </label>
                  <input
                    type="text"
                    name="otherDomain"
                    value={formData.otherDomain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 mb-2">Skills</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-700 rounded-lg bg-[#161B22] text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {formData.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center px-4 py-2 bg-[#161B22] text-white rounded-lg"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                Complete Profile
              </button>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
