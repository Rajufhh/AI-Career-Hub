"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Mail, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/services/routeProtectionService";

export default function MentoringPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({
    isBooked: false,
    meetLink: "",
    mentorEmail: "",
    scheduledTime: "",
  });

  // Use a ref to store generated time slots for each date to ensure consistency
  const timeSlotsCache = useRef({});

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = (date) => {
    // Create a unique key for the date
    const dateKey = date.toISOString().split("T")[0];

    // If we already generated slots for this date, return them from cache
    if (timeSlotsCache.current[dateKey]) {
      return timeSlotsCache.current[dateKey];
    }

    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        // Randomly make some slots unavailable but ensure at least 3 slots are available
        const isAvailable = Math.random() > 0.6;

        // Format time with AM/PM
        const formattedHour = hour % 12 || 12;
        const period = hour < 12 ? "AM" : "PM";
        const formattedTime = `${formattedHour}:${
          minute === 0 ? "00" : minute
        } ${period}`;

        slots.push({
          time: formattedTime,
          isAvailable,
        });
      }
    }

    // Ensure at least 3 slots are available
    const availableSlots = slots.filter((slot) => slot.isAvailable);
    if (availableSlots.length < 3) {
      const unavailableSlots = slots.filter((slot) => !slot.isAvailable);
      for (
        let i = 0;
        i < Math.min(3 - availableSlots.length, unavailableSlots.length);
        i++
      ) {
        unavailableSlots[i].isAvailable = true;
      }
    }

    // Cache the generated slots for this date
    timeSlotsCache.current[dateKey] = slots;
    return slots;
  };

  // Update time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const mentors = [
    {
      id: 1,
      name: "Dr Aaryan",
      role: "Senior Data Scientist at Google",
      expertise: ["Machine Learning", "AI Ethics", "Career Transitions"],
      image: "/mentors/aaryannn.jpg",
      bio: "With over 10 years of experience in AI and machine learning, Dr. Singh helps professionals navigate the complex landscape of data science careers.",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Tarsh Swarnkar",
      role: "Career Coach & Former HR Director",
      expertise: [
        "Resume Building",
        "Interview Preparation",
        "Salary Negotiation",
      ],
      image: "/mentors/tarsh.jpeg",
      bio: "With experience as an HR director at Fortune 500 companies, Tarsh provides insider knowledge on what employers really look for.",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Kanishq Tahalyani",
      role: "Product Manager at Microsoft",
      expertise: ["Product Strategy", "UX Design", "Agile Methodologies"],
      image: "/mentors/kanishq.jpeg",
      bio: "Kanishq specializes in helping technical professionals transition into product management roles.",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Himanshu Rautela",
      role: "Full Stack Developer & Tech Lead",
      expertise: ["Web Development", "System Design", "Technical Interviews"],
      image: "/mentors/himanshu.jpeg",
      bio: "Himanshu has helped over 200 developers land jobs at top tech companies through his structured mentoring approach.",
      rating: 4.9,
    },
  ];

  const handleBookSession = () => {
    try {
      if (!selectedDate || !selectedTime) return;

      // Generate a fake Google Meet link
      const meetCode = Math.random().toString(36).substring(2, 10);
      const meetLink = `https://meet.google.com/${meetCode}`;

      // Format the selected date and time
      const formattedDate = selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Find the mentor's email (with error handling)
      const mentor = mentors.find((m) => m.id === selectedMentor?.id);
      if (!mentor) {
        throw new Error("Selected mentor not found");
      }

      const mentorEmail = `${mentor.name
        .toLowerCase()
        .replace(/\s+/g, ".")}@ai.career.hub.com`;

      // Update booking status
      setBookingStatus({
        isBooked: true,
        meetLink,
        mentorEmail,
        scheduledTime: `${formattedDate} at ${selectedTime}`,
      });

      // Close the modal
      setShowBookingModal(false);
      setSelectedMentor(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Error booking session:", error);
      alert("There was an error booking your session. Please try again.");
    }
  };

  const openBookingModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
    // Reset previously selected options
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedMentor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Get days in month for calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);

    // Don't allow going to past months
    const today = new Date();
    if (
      newMonth.getFullYear() < today.getFullYear() ||
      (newMonth.getFullYear() === today.getFullYear() &&
        newMonth.getMonth() < today.getMonth())
    ) {
      return;
    }

    setCurrentMonth(newMonth);
  };

  // Navigate to next month
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Check if a date is in the past or today
  const isPastOrToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    // Return true if the date is today or in the past
    return compareDate <= today;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <ProtectedRoute>
      <div className="bg-[#161B22] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                1:1 Mentoring Sessions
              </span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Connect with industry experts for personalized guidance on your
              career journey. Book a 30-minute session with one of our
              experienced mentors.
            </p>
          </div>

          {bookingStatus.isBooked ? (
            <div className="max-w-2xl mx-auto bg-[#0D1117] p-8 rounded-lg shadow-lg border-2 border-gradient-to-r from-[#E31D65] to-[#FF6B2B]">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] rounded-full flex items-center justify-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Session Booked Successfully!
                </h2>
                <p className="text-gray-300 mb-6">
                  Your mentoring session has been scheduled. Here are the
                  details:
                </p>

                <div className="bg-[#161B22] p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Scheduled for:
                      </span>{" "}
                      {bookingStatus.scheduledTime}
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">Duration:</span>{" "}
                      30 minutes
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Mail className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Mentor email:
                      </span>{" "}
                      {bookingStatus.mentorEmail}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-[#E31D65] mr-3" />
                    <span className="text-gray-300">
                      <span className="font-medium text-white">
                        Meeting link:
                      </span>{" "}
                      <a
                        href={bookingStatus.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF6B2B] hover:underline"
                      >
                        {bookingStatus.meetLink}
                      </a>
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  The meeting link has been sent to both you and your mentor via
                  email. Please join the meeting at the scheduled time.
                </p>

                <div className="mt-8">
                  <Link href="/dashboard">
                    <button className="px-6 py-3 bg-[#0D1117] text-white rounded-md hover:bg-gradient-to-r hover:from-[#E31D65] hover:to-[#FF6B2B] transition-colors duration-300">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0D1117] rounded-lg overflow-hidden shadow-lg flex flex-col h-full"
                >
                  <div className="h-48 bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {mentor.image ? (
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Mentor";
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-300">
                            {mentor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{mentor.role}</p>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              i < Math.floor(mentor.rating)
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-gray-300 text-sm">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Expertise:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#1c2331] text-gray-300 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">{mentor.bio}</p>

                    <div className="mt-auto">
                      <button
                        onClick={() => handleBookSession(mentor.id)}
                        disabled={!mentor.available}
                        className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                          mentor.available
                            ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white hover:opacity-90"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {mentor.available
                          ? "Book Now"
                          : "Currently Unavailable"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
              onClick={closeBookingModal}
            ></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0D1117] rounded-lg p-6 max-w-4xl w-full mx-4 z-10 relative"
            >
              <button
                onClick={closeBookingModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-transparent bg-clip-text">
                  Book a Session with {selectedMentor?.name || "Mentor"}
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="bg-[#161B22] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={prevMonth}
                      className="text-gray-400 hover:text-white"
                    >
                      &lt;
                    </button>
                    <h3 className="text-white font-medium">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="text-gray-400 hover:text-white"
                    >
                      &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-gray-400 text-sm py-1"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({
                      length: getFirstDayOfMonth(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth()
                      ),
                    }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-10"></div>
                    ))}

                    {Array.from({
                      length: getDaysInMonth(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth()
                      ),
                    }).map((_, index) => {
                      const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        index + 1
                      );
                      const isToday = isSameDay(date, new Date());
                      const isPastOrTodayDate = isPastOrToday(date);
                      const isWeekend =
                        date.getDay() === 0 || date.getDay() === 6;
                      const isSelected =
                        selectedDate && isSameDay(date, selectedDate);

                      return (
                        <button
                          key={`day-${index}`}
                          onClick={() =>
                            !isPastOrTodayDate && !isWeekend
                              ? setSelectedDate(date)
                              : null
                          }
                          disabled={isPastOrTodayDate || isWeekend}
                          className={`h-10 rounded-md flex items-center justify-center text-sm transition-colors ${
                            isSelected
                              ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white"
                              : isToday
                              ? "border border-[#E31D65] text-white"
                              : isPastOrTodayDate || isWeekend
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-300 hover:bg-[#1c2331]"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="bg-[#161B22] p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-4">
                    {selectedDate
                      ? `Available Times for ${selectedDate.toLocaleDateString()}`
                      : "Select a date to view available times"}
                  </h3>

                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={`time-${index}`}
                          onClick={() =>
                            slot.isAvailable ? setSelectedTime(slot.time) : null
                          }
                          disabled={!slot.isAvailable}
                          className={`py-2 px-4 rounded-md text-sm transition-colors ${
                            selectedTime === slot.time
                              ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white"
                              : slot.isAvailable
                              ? "bg-[#1c2331] text-gray-300 hover:bg-[#252e3f]"
                              : "bg-[#1c2331] text-gray-600 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Please select a date from the calendar
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedTime}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    selectedDate && selectedTime
                      ? "bg-gradient-to-r from-[#E31D65] to-[#FF6B2B] text-white hover:opacity-90"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
