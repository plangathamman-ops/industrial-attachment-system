import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  FiBriefcase, 
  FiUsers, 
  FiCheckCircle, 
  FiSearch,
  FiUploadCloud,
  FiCreditCard,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiStar,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const words = [
    'Internship Opportunities',
    'Attachment Opportunities',
    'Internships & Attachments',
    'Career Launchpad'
  ];
  const typewriterRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    let timeout;
    let word = words[typewriterIndex];
    let j = 0;
    function typing() {
      setTypewriterText(word.slice(0, j));
      if (j < word.length) {
        j++;
        timeout = setTimeout(typing, 70);
      } else {
        setTimeout(() => {
          setTypewriterIndex((prev) => (prev + 1) % words.length);
        }, 1200);
      }
    }
    typing();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [typewriterIndex]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Testimonials data (PLACEHOLDER CONTENT - Replace with real data)
  const testimonials = [
    {
      name: "Sarah Kamau",
      role: "Computer Science Student, UoN",
      image: "https://ui-avatars.com/api/?name=Sarah+Kamau&background=6366f1&color=fff",
      content: "I found my dream internship at Safaricom through this platform! The application process was smooth and professional. Highly recommend for both internships and attachments!",
      rating: 5
    },
    {
      name: "Brian Otieno",
      role: "Electrical Engineering, KU",
      image: "https://ui-avatars.com/api/?name=Brian+Otieno&background=6366f1&color=fff",
      content: "Secured my attachment at Kenya Power. The system is easy to use and the support team is amazing!",
      rating: 5
    },
    {
      name: "Faith Mwangi",
      role: "Business Student, Strathmore",
      image: "https://ui-avatars.com/api/?name=Faith+Mwangi&background=6366f1&color=fff",
      content: "Applied to three companies in one day and got accepted for an internship at Equity Bank. Super fast and reliable.",
      rating: 5
    },
    {
      name: "Kevin Mutua",
      role: "IT Student, JKUAT",
      image: "https://ui-avatars.com/api/?name=Kevin+Mutua&background=6366f1&color=fff",
      content: "The attachment process was seamless. I loved the instant updates and easy payments.",
      rating: 5
    }
  ];

  // Stats data
  const stats = [
    { number: "5,000+", label: "Students Placed" },
    { number: "500+", label: "Partner Companies" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  // Dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#10172a] transition-colors duration-300">
      {/* Hero Section - Enhanced with Animation */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <FiTrendingUp className="text-yellow-300" />
              <span className="text-sm font-medium">Trusted by 5,000+ Students</span>
            </div>

            {/* Main Heading with Typewriter Effect */}
            <div className="typewriter">
              <h1
                className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                style={{
                  borderRight: `.15em solid ${isDark ? '#fde68a' : '#fff'}`,
                  color: isDark ? '#fde68a' : undefined,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  margin: '0 auto',
                  letterSpacing: '.05em',
                  animation: 'typing 2.5s steps(30, end), blink-caret .75s step-end infinite'
                }}
                ref={typewriterRef}
              >
                Find Your Perfect<br />
                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  {typewriterText}
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-10 text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Connect with Kenya's top companies. Browse thousands of verified <b>internship</b> and <b>industrial attachment</b> opportunities. Simple application process, secure payments, instant updates. Whether you need an internship or an attachment, we have you covered.
            </p>
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsDark((d) => !d)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-full shadow font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      {/* Notice Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 text-center text-sm font-medium shadow-lg z-50">
        🎨 Preview Mode: This is how your NEW landing page will look! • Scroll to see all sections
      </div>
      {/* Add typewriter and caret keyframes */}
      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: ${isDark ? '#fde68a' : '#fff'}; }
        }
      `}</style>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                to="/register" 
                className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/opportunities" 
                className="bg-indigo-500/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500/50 transition-all border-2 border-white/30 flex items-center justify-center space-x-2"
              >
                <FiSearch />
                <span>Browse Opportunities</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-indigo-100">
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-300" />
                <span>Free to sign up</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-300" />
                <span>Verified companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-300" />
                <span>Instant notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get placed in just 3 simple steps. Quick, easy, and transparent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-indigo-500">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <FiSearch className="text-indigo-600 text-3xl" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Browse & Choose</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore 500+ opportunities from top companies across IT, Engineering, Business, and more. Filter by location, industry, and duration.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-purple-500">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <FiUploadCloud className="text-purple-600 text-3xl" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Apply & Upload</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fill the simple application form, upload your CV and referral letter. Our system validates everything for you automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-pink-500">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <FiCreditCard className="text-pink-600 text-3xl" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">Pay & Get Placed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete payment via M-Pesa (KES 500). Your application is submitted instantly and companies start reviewing immediately!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Enhanced */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your <b>internship</b> and <b>attachment</b> search effortless and successful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiBriefcase className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">500+ Companies</h3>
              <p className="text-gray-700 leading-relaxed">
                Access opportunities from Safaricom, KCB, Equity Bank, Kenya Power, and hundreds more top employers actively hiring students.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Applications</h3>
              <p className="text-gray-700 leading-relaxed">
                Apply to multiple companies in minutes. Secure M-Pesa payments, automated document verification, and real-time status tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiAward className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">95% Success Rate</h3>
              <p className="text-gray-700 leading-relaxed">
                Our students get placed faster. Professional profiles, verified applications, and direct company connections mean better results.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Trusted Platform</h3>
              <p className="text-gray-700 leading-relaxed">
                Join 5,000+ students from UoN, JKUAT, KU, Strathmore, and other universities who found their attachments through our platform.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Fast Placements</h3>
              <p className="text-gray-700 leading-relaxed">
                Average placement time is just 2 weeks! Companies review applications daily and respond quickly to qualified candidates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">M-Pesa Ready</h3>
              <p className="text-gray-700 leading-relaxed">
                Pay application fee (KES 500) instantly via M-Pesa. No bank visits, no cash, no hassle. Simple STK push payment in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Students Say</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Real stories from students who found their dream placements
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20">
              <div className="flex mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-300 fill-yellow-300 text-xl" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90">
                "{testimonials[activeTestimonial].content}"
              </p>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonials[activeTestimonial].image} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full border-2 border-white/30"
                />
                <div>
                  <div className="font-bold text-lg">{testimonials[activeTestimonial].name}</div>
                  <div className="text-indigo-200">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? 'bg-white w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section - Enhanced */}
      <div className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-indigo-100 leading-relaxed">
            Join 5,000+ students who secured their dream placements. 
            Create your free account and start applying in minutes!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="group bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform text-2xl" />
            </Link>
            <Link 
              to="/opportunities" 
              className="bg-indigo-500/30 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-indigo-500/50 transition-all border-2 border-white/30"
            >
              View All Opportunities
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <FiCheck className="text-green-300 text-xl" />
            <span className="text-sm font-medium">Free to sign up • No credit card required • Pay only when you apply</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
