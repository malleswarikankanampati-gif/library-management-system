import React from "react";

const About = () => {
  return (
    <div className="bg-orange-50 py-8 px-6 md:px-12 max-w-7xl mx-auto text-center shadow-lg rounded-lg">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-sm text-orange-600">
        About Our Library Management System
      </h2>
      <hr className="border-t-4 border-orange-600 w-4/5 mx-auto mb-12" />
      <p className="text-lg md:text-xl text-gray-800 mb-16 font-medium">
        Welcome to the future of library management. Our system simplifies book
        management, cataloging, and finding books for libraries and their
        members.
      </p>

      {/* Mission Section */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-orange-900 mb-4">Our Mission</h3>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Our mission is to provide an intuitive, efficient, and scalable
          library management system that helps libraries streamline their
          operations and enhance their services to users. We aim to empower
          libraries to manage books, memberships, and transactions with ease,
          while also providing users with a seamless experience in finding and
          borrowing books.
        </p>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-orange-900 mb-4">Our Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Value 1 */}
          <div className="bg-white rounded-xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ease-in-out border-t-4 border-orange-400">
            <h4 className="text-xl font-bold text-orange-950 mb-4">
              Efficiency
            </h4>
            <p className="text-gray-700">
              We value streamlined processes that save time and make library
              management easier and faster.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white rounded-xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ease-in-out border-t-4 border-orange-400">
            <h4 className="text-xl font-bold text-orange-950 mb-4">
              Accessibility
            </h4>
            <p className="text-gray-700">
              Our system is designed to be user-friendly, making it easy for
              both librarians and patrons to navigate.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white rounded-xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ease-in-out border-t-4 border-orange-400">
            <h4 className="text-xl font-bold text-orange-950 mb-4">
              Innovation
            </h4>
            <p className="text-gray-700">
              We continuously innovate and update our system to adapt to modern
              needs and keep libraries ahead of the curve.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h3 className="text-2xl font-bold text-orange-900 mb-8">
          Meet Our Team
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Team Member 1 */}
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs transform hover:scale-105 transition-all duration-300 ease-in-out border-b-4 border-orange-400">
            <img
              src="src/assets/img/lf1.jpg"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-300"
            />
            <h4 className="text-xl font-semibold text-gray-900">John Doe</h4>
            <p className="text-gray-700">Lead Developer</p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs transform hover:scale-105 transition-all duration-300 ease-in-out border-b-4 border-orange-400">
            <img
              src="src/assets/img/lf2.jpg"
              alt="Team Member 2"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-300"
            />
            <h4 className="text-xl font-semibold text-gray-900">Jane Smith</h4>
            <p className="text-gray-700">UI/UX Designer</p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs transform hover:scale-105 transition-all duration-300 ease-in-out border-b-4 border-orange-400">
            <img
              src="src/assets/img/lf3.jpg"
              alt="Team Member 3"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-300"
            />
            <h4 className="text-xl font-semibold text-gray-900">
              Mike Johnson
            </h4>
            <p className="text-gray-700">Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
