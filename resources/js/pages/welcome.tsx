// =====================================================
// AFFILIATE DASHBOARD v7 - WITH COMPACT ONBOARDING MODAL
// =====================================================
// This is the complete dashboard with the updated compact onboarding modal

import { useState, useEffect } from 'react';
import { Bell, Award, ArrowRight, CheckCircle, CheckCircle2, Gift, X, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import LevelBasedMissions from './LevelBasedMission.jsx';
// Import Inertia helpers
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const AffiliateDashboard = () => {
  // =================================================
  // STATE MANAGEMENT - Using Inertia Props
  // =================================================
  const { userData, missionData, brandsData, onboardingData, rewardsData, countryCodes } = usePage().props;

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(userData.isFirstTimeLogin || false);
  const [showOnboarding, setShowOnboarding] = useState(onboardingData.showOnboarding || false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  // =================================================
  // COMPONENT 2: STEP-BY-STEP ONBOARDING
  // =================================================
  const StepByStepOnboarding = () => {
    // Define rewards for each step
    const stepRewards = {
      1: 50, // First login
      2: 100, // Complete profile
      3: 75, // Share first affiliate link
      4: 200 // Generate first sale
    };

    // Basic onboarding state
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [onboardingCompleted, setOnboardingCompleted] = useState([]);
    const [showPointsAnimation, setShowPointsAnimation] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);

    // Profile step state
    const [profileForm, setProfileForm] = useState({
      fullName: userData.name || '',
      email: userData.email || 'alex.johnson@example.com',
      phone: userData.phone || '+60123456789',
      paymentMethod: userData.paymentMethod || 'paypal',
      paymentDetails: userData.paymentDetails || '',
      profileCompleted: false
    });
    const [formErrors, setFormErrors] = useState({});

    // Share link step state
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    // First sale step state
    const [saleStatus, setSaleStatus] = useState('pending');
    const [transactionChecked, setTransactionChecked] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
      // Only trigger confetti once when first step opens
      if (onboardingStep === 1 && !confettiTriggered) {
        triggerConfetti();
        setConfettiTriggered(true);
      }
    }, []);

    // Add this function to trigger confetti
    const triggerConfetti = () => {
      confetti({
        particleCount: 200,         // Increase particle count
        spread: 120,                // Wider spread
        origin: { y: 0.5, x: 0.5 }, // Start from center of screen
        colors: ['#5046e5', '#8b5cf6', '#c084fc', '#f472b6'], // Match your purple/indigo theme
        startVelocity: 30,          // Faster particles
        disableForReducedMotion: true // Accessibility
      });
    };

    // Function to complete current step and move to next
    const completeCurrentStep = () => {
      // Don't award points for step 1 until user clicks "Mula Sekarang"
      if (onboardingStep !== 1) {
        // Show points animation
        setPointsEarned(stepRewards[onboardingStep]);
        setShowPointsAnimation(true);

        // Add current step to completed steps
        setOnboardingCompleted([...onboardingCompleted, onboardingStep]);

        // Hide points animation after a delay
        setTimeout(() => {
          setShowPointsAnimation(false);
        }, 1500);
      }

      // Move to next step (or finish onboarding if on last step)
      if (onboardingStep < 4) {
        setOnboardingStep(onboardingStep + 1);
      } else {
        finishOnboarding();
      }
    };

    // Function to handle first step (welcome)
    const startOnboarding = () => {
      // Award points for first login
      setPointsEarned(stepRewards[1]);
      setShowPointsAnimation(true);

      // Add first step to completed steps
      setOnboardingCompleted([...onboardingCompleted, 1]);

      // Hide points animation after a delay
      setTimeout(() => {
        setShowPointsAnimation(false);
        // Move to step 2
        setOnboardingStep(2);
      }, 1500);
    };

    // Function to finish onboarding
    const finishOnboarding = () => {
      Inertia.post('/onboarding/complete', {}, {
        onSuccess: () => {
          setShowOnboarding(false);
          setIsFirstTimeLogin(false);
        }
      });
    };

    // Function to navigate to specific page and complete current step
    const navigateToPage = (page) => {
      completeCurrentStep();
      // Use Inertia to navigate to different pages
      Inertia.visit(`/${page}`);
    };

    // Calculate total points earned from completed steps
    const totalPointsEarned = onboardingCompleted.reduce((total, step) => total + stepRewards[step], 0);

    // Enhanced Welcome Step with more compact design
    const WelcomeStep = () => {
      const [loadingAnimation, setLoadingAnimation] = useState(true);

      // Show loading animation initially
      useEffect(() => {
        const timer = setTimeout(() => {
          setLoadingAnimation(false);
        }, 1000);
        return () => clearTimeout(timer);
      }, []);

      // Get onboarding missions from props
      const missions = onboardingData.missions || [
        { id: 1, title: "Log masuk pertama kali", reward: "50 mata", icon: "🏆", completed: true },
        { id: 2, title: "Lengkapkan profil anda", reward: "100 mata", icon: "👤" },
        { id: 3, title: "Kongsi pautan affiliate pertama", reward: "75 mata", icon: "🔗" },
        { id: 4, title: "Hasilkan jualan pertama", reward: "200 mata", icon: "💰" }
      ];

      return (
        <div className="text-center">
          {loadingAnimation ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 relative mb-4">
                <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 text-sm">Menyediakan akaun anda...</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center justify-center h-14 w-14 bg-indigo-100 rounded-full mb-3">
                <Award size={28} className="text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Selamat Datang!</h2>
              <p className="text-sm text-gray-600 mb-3">Tahniah menyertai Program Affiliate kami!</p>

              <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Dapatkan mata dengan melengkapkan misi onboarding:</p>

                <div className="space-y-2">
                  {missions.map(mission => (
                    <div key={mission.id} className="flex items-center bg-white rounded-lg p-1.5">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                        {mission.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-gray-800">{mission.title}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-medium text-indigo-600">{mission.reward}</span>
                        {mission.completed && (
                          <div className="text-green-500">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={startOnboarding}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm"
              >
                Mula Sekarang!
              </button>
            </>
          )}
        </div>
      );
    };

    // Enhanced Profile Step with Form
    const ProfileStep = () => {
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileForm({
          ...profileForm,
          [name]: value
        });
      };

      const validateForm = () => {
        const errors = {};
        if (!profileForm.fullName.trim()) errors.fullName = 'Nama diperlukan';
        if (!profileForm.email.trim()) errors.email = 'Emel diperlukan';
        if (!profileForm.email.includes('@')) errors.email = 'Emel tidak sah';
        if (!profileForm.phone.trim()) errors.phone = 'Nombor telefon diperlukan';
        if (profileForm.paymentMethod === 'paypal' && !profileForm.paymentDetails.trim())
          errors.paymentDetails = 'ID PayPal diperlukan';
        if (profileForm.paymentMethod === 'bank' && !profileForm.paymentDetails.trim())
          errors.paymentDetails = 'Maklumat bank diperlukan';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };

      const completeProfile = () => {
        if (validateForm()) {
          // Use Inertia to submit the profile form
          Inertia.post('/onboarding/profile', {
            name: profileForm.fullName,
            email: profileForm.email,
            phone: profileForm.phone,
            payment_method: profileForm.paymentMethod,
            payment_details: profileForm.paymentDetails
          }, {
            onSuccess: () => {
              setProfileForm({
                ...profileForm,
                profileCompleted: true
              });
              completeCurrentStep();
            }
          });
        }
      };

      return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-indigo-100 rounded-full mb-2">
              <div className="text-xl">👤</div>
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-1">Lengkapkan Profil Anda</h2>
            <p className="text-xs text-gray-600 mb-3">Profil yang lengkap membantu anda memperoleh kepercayaan pelanggan</p>

            <div className="space-y-2.5 mb-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
              <input
                type="text"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emel</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombor Telefon</label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kaedah Pembayaran</label>
              <select
                name="paymentMethod"
                value={profileForm.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {profileForm.paymentMethod === 'paypal' ? 'ID PayPal' :
                 profileForm.paymentMethod === 'bank' ? 'Maklumat Bank' : 'ID E-Wallet'}
              </label>
              <input
                type="text"
                name="paymentDetails"
                value={profileForm.paymentDetails}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.paymentDetails ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder={profileForm.paymentMethod === 'paypal' ? 'contoh: email@example.com' :
                            profileForm.paymentMethod === 'bank' ? 'Nama Bank & Nombor Akaun' : 'ID E-Wallet Anda'}
              />
              {formErrors.paymentDetails && <p className="text-red-500 text-xs mt-1">{formErrors.paymentDetails}</p>}
            </div>
            </div>

          <div className="flex space-x-2">
              <button
                onClick={completeProfile}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm"
              >
                Simpan & Teruskan
              </button>
              <button
                onClick={completeCurrentStep}
                className="py-2 px-3 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
              >
                Lewati
              </button>
          </div>
          </div>
      );
    };

    // Enhanced Share Link Step with Brand Selection
    const ShareLinkStep = () => {
      // Base URL for affiliate links
      const baseAffiliateUrl = "https://affiliate.example.com/ref/";

      // Function to generate an affiliate link based on selected brand
      const generateAffiliateLink = (brand) => {
        const userCode = userData.affiliateCode || "ALEXJ25"; // Use actual user's code from props
        return `${baseAffiliateUrl}${userCode}/${brand.name.toLowerCase().replace(/\s+/g, '-')}`;
      };

      // Copy link to clipboard
      const copyToClipboard = (link) => {
        navigator.clipboard.writeText(link).then(() => {
          setLinkCopied(true);

          // Call API to mark share mission as completed
          Inertia.post('/affiliate-link/share-mission', {}, {
            onSuccess: () => {
              // Show success animation
              setTimeout(() => {
                setLinkCopied(false);
                // After showing animation, complete step
                completeCurrentStep();
              }, 1500);
            }
          });
        });
      };

      // Select a brand and prepare to share
      const selectBrand = (brand) => {
        setSelectedBrand(brand);
        setShowShareOptions(true);
      };

      // Share on different platforms (these would be connected to actual share APIs)
      const shareOn = (platform) => {
        // In a real implementation, this would open share dialogs
        // For now, mark as shared and proceed

        // Call API to mark share mission as completed
        Inertia.post('/affiliate-link/share-mission', {}, {
          onSuccess: () => {
            setLinkCopied(true);
            setTimeout(() => {
              setLinkCopied(false);
              completeCurrentStep();
            }, 1500);
          }
        });
      };

      return (
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 bg-indigo-100 rounded-full mb-4">
            <div className="text-2xl">🔗</div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Kongsi Pautan Affiliate</h2>
          <p className="text-sm text-gray-600 mb-4">Pilih jenama dan dapatkan pautan affiliate anda</p>

          {!selectedBrand ? (
            // Brand selection view
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Pilih jenama untuk dijana pautan affiliate:</p>

              <div className="grid grid-cols-2 gap-2">
              {brandsData.map(brand => (
                  <div
                  key={brand.id}
                  onClick={() => selectBrand(brand)}
                  className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                  <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-1">
                      <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                      </div>
                      <p className="text-xs font-medium">{brand.name}</p>
                      <p className="text-xs text-indigo-600">{brand.commission}</p>
                  </div>
                  </div>
              ))}
              </div>
            </div>
          ) : showShareOptions ? (
            // Share options view
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                  <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{selectedBrand.name}</p>
                  <p className="text-xs text-gray-500">Komisen: {selectedBrand.commission}</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg text-left">
                <p className="text-xs font-medium text-gray-700 mb-2">Kongsi melalui:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => shareOn('whatsapp')}
                    className="bg-green-500 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareOn('facebook')}
                    className="bg-blue-600 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => shareOn('twitter')}
                    className="bg-blue-400 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    Twitter
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500">atau salin pautan di bawah</p>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={generateAffiliateLink(selectedBrand)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none text-sm"
                />
                <button
                  onClick={() => copyToClipboard(generateAffiliateLink(selectedBrand))}
                  className="absolute right-1 top-1 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium"
                >
                  {linkCopied ? "Disalin!" : "Salin"}
                </button>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedBrand(null);
                    setShowShareOptions(false);
                  }}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm"
                >
                  Tukar Jenama
                </button>
                <button
                  onClick={completeCurrentStep}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                >
                  Teruskan
                </button>
              </div>
            </div>
          ) : (
            // Generate link view
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                  <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{selectedBrand.name}</p>
                  <p className="text-xs text-gray-500">Komisen: {selectedBrand.commission}</p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={generateAffiliateLink(selectedBrand)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none text-sm"
                />
                <button
                  onClick={() => copyToClipboard(generateAffiliateLink(selectedBrand))}
                  className="absolute right-1 top-1 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium"
                >
                  {linkCopied ? "Disalin!" : "Salin"}
                </button>
              </div>

              <button
                onClick={() => setShowShareOptions(true)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Kongsi Pautan
              </button>
            </div>
          )}

          {!selectedBrand && (
            <button
              onClick={completeCurrentStep}
              className="mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              Lewati
            </button>
          )}

          {/* Success animation */}
          {linkCopied && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <p className="text-lg font-medium text-green-700">Pautan Disalin!</p>
                <p className="text-sm text-gray-600">Anda boleh berkongsi pautan ini sekarang</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    // Enhanced First Sale Step with Transaction Tracking
    const FirstSaleStep = () => {
      // Check for first transaction using API
      const checkForTransactions = () => {
        setTransactionChecked(true);

        // Simulate a transaction check (would be an API call in reality)
        setSaleStatus('processing');

        // Use Inertia to check for first transaction
        Inertia.post('/transaction/check-first', {}, {
          onSuccess: (response) => {
            if (response.has_transaction) {
              setSaleStatus('completed');
              setShowConfetti(true);

              // Trigger confetti animation
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
              });
            } else {
              setSaleStatus('pending');
            }
          }
        });
      };

      return (
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 bg-indigo-100 rounded-full mb-4">
            <div className="text-2xl">💰</div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hasilkan Jualan Pertama</h2>
          <p className="text-sm text-gray-600 mb-4">Semak dashboard untuk memantau jualan dan prestasi anda</p>

          {saleStatus === 'pending' && !transactionChecked && (
            <div className="bg-indigo-50 rounded-lg p-2.5 mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Petua untuk mendapatkan jualan:</p>
            <ul className="space-y-1.5 text-xs text-left">
              <li className="flex items-start">
                <CheckCircle2 size={14} className="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <span>Kongsi dengan orang yang berminat dengan produk</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 size={14} className="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <span>Berikan ulasan jujur tentang produk</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 size={14} className="text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <span>Kongsi di platform yang sesuai</span>
              </li>
            </ul>
          </div>
          )}

          {saleStatus === 'pending' && transactionChecked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-700">Belum ada transaksi direkodkan.</p>
              <p className="text-xs text-yellow-600 mt-1">Ulangi semak selepas anda telah berkongsi pautan affiliate</p>
            </div>
          )}

          {saleStatus === 'processing' && (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-600">Menyemak transaksi...</p>
            </div>
          )}

          {saleStatus === 'completed' && (
            <div className="bg-white rounded-lg p-2 mt-2 text-left">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium">{response?.transaction?.brandName || "TechGadget"}</p>
              <p className="text-xxs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Selesai</p>
            </div>
            <p className="text-xs">{response?.transaction?.productName || "Wireless Earbuds"}</p>
            <div className="flex justify-between mt-1">
              <p className="text-xxs text-gray-500">Jumlah:</p>
              <p className="text-xs font-medium">{response?.transaction?.amount || "RM250.00"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xxs text-gray-500">Komisen:</p>
              <p className="text-xs font-medium text-green-600">{response?.transaction?.commission || "RM25.00"}</p>
            </div>
            <p className="text-xxs text-gray-500 mt-1">Transaksi pada {response?.transaction?.date || "10 Mei 2025"}</p>
          </div>
          )}

          <div className="flex space-x-3">
            {saleStatus === 'pending' && (
              <>
                <button
                  onClick={checkForTransactions}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm"
                >
                  Semak Transaksi
                </button>
                <button
                  onClick={() => navigateToPage('dashboard')}
                  className="flex-1 py-3 bg-indigo-100 text-indigo-600 rounded-lg font-medium text-sm"
                >
                  Lihat Dashboard
                </button>
              </>
            )}

            {saleStatus === 'completed' && (
              <button
                onClick={completeCurrentStep}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm"
              >
                Lihat Dashboard
              </button>
            )}

            {saleStatus === 'processing' && (
              <button
                disabled
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-medium text-sm cursor-not-allowed"
              >
                Sedang diproses...
              </button>
            )}
          </div>

          {saleStatus !== 'completed' && (
            <button
              onClick={completeCurrentStep}
              className="w-full mt-3 py-2 text-gray-500 text-sm"
            >
              Lewati langkah ini
            </button>
          )}
        </div>
      );
    };

    // Points Animation Component
    const PointsAnimation = () => (
      <div className="fixed bottom-1/4 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="bg-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-bold animate-bounce shadow-lg">
          +{pointsEarned} mata!
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
          {/* Header with close button and points */}
          <div className="flex justify-between items-center p-3 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center">
              <Award size={16} className="text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Onboarding</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-indigo-600 font-bold mr-4">{totalPointsEarned} mata</span>
              <button
                onClick={finishOnboarding}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Step indicator - make it sticky */}
          <div className="px-4 pt-3 sticky top-[49px] bg-white z-10">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex items-center justify-center rounded-full h-6 w-6 text-xs font-medium
                    ${onboardingStep === step ? 'bg-indigo-600 text-white' :
                      onboardingCompleted.includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {onboardingCompleted.includes(step) ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* Step content - with less padding for more content space */}
          <div className="p-4">
            {onboardingStep === 1 && <WelcomeStep />}
            {onboardingStep === 2 && <ProfileStep />}
            {onboardingStep === 3 && <ShareLinkStep />}
            {onboardingStep === 4 && <FirstSaleStep />}
          </div>

          {/* Points Animation */}
          {showPointsAnimation && <PointsAnimation />}
        </div>
      </div>
    );
  };

  // =================================================
  // COMPONENT 4: DASHBOARD PAGE
  // =================================================
  const DashboardPage = () => {
    const handleShareBrand = (brand) => {
      // Use Inertia to generate an affiliate link for the brand
      Inertia.post('/affiliate-link/generate', {
        brand_id: brand.id
      }, {
        onSuccess: (response) => {
          if (response.success) {
            // Use the browser's clipboard API to copy the link
            navigator.clipboard.writeText(response.affiliate_link)
              .then(() => {
                alert(`Link for ${brand.name} copied to clipboard!`);
              })
              .catch(() => {
                alert(`Your affiliate link: ${response.affiliate_link}`);
              });
          }
        }
      });
    };

    const handleRedeemReward = (reward) => {
      if (userData.points >= reward.points) {
        // Use Inertia to redeem the reward
        Inertia.post('/rewards/redeem', {
          reward_id: reward.id
        }, {
          onSuccess: () => {
            alert(`Successfully redeemed: ${reward.name}`);
          }
        });
      } else {
        alert(`Not enough points to redeem ${reward.name}`);
      }
    };

    return(
      <div className="p-4 space-y-6">
          <div className="bg-purple-600 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center">
                  <div className="flex items-start space-x-3">
                  <div className="h-14 w-14 bg-purple-600 bg-opacity-30 rounded-lg p-2 flex items-center justify-center">
                      <div className="transform rotate-45 h-8 w-8 bg-purple-300 rounded-sm"></div>
                  </div>
                  <div>
                      <div className="flex items-center">
                      <p className="text-sm font-medium">Points Anda</p>
                      </div>
                      <h2 className="text-xl font-medium">{userData.points || 750} pts</h2>
                  </div>
                  </div>
                  <div className="h-10 w-10 bg-purple-600 bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  </div>
              </div>
              <button
                  onClick={() => Inertia.visit('/rewards')}
                  className="mt-4 w-full py-2.5 bg-white text-purple-600 rounded-lg font-medium text-sm flex items-center justify-center"
              >
                  Tebus Points
              </button>
              </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Jenama Teratas</h3>
              <button
              onClick={() => Inertia.visit('/brands')}
              className="text-sm text-indigo-600 flex items-center"
              >
              Lihat semua <ArrowRight size={16} className="ml-1" />
              </button>
          </div>

          <div className="space-y-3">
              {brandsData.slice(0, 3).map(brand => (
              <div key={brand.id} className="flex">
                  {/* Brand information in a rectangle layout */}
                  <div className="flex-1 border border-gray-200 rounded-lg p-2 mr-2">
                  <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-2">
                      <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                      <p className="text-xs font-medium">{brand.name}</p>
                      <p className="text-xs text-indigo-600">{brand.commission}</p>
                      </div>
                  </div>
                  </div>

                  {/* Share button */}
                  <button
                  onClick={() => handleShareBrand(brand)}
                  className="w-12 flex flex-col items-center justify-center bg-indigo-100 text-indigo-700 rounded-lg text-xs"
                  >
                  <Share2 size={16} className="mb-1" />
                  <span className="text-xs">Kongsi</span>
                  </button>
              </div>
              ))}
          </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Misi Aktif</h3>
                  <button
                      onClick={() => Inertia.visit('/missions')}
                      className="text-sm text-indigo-600 flex items-center"
                  >
                      Lihat semua <ArrowRight size={16} className="ml-1" />
                  </button>
              </div>

              <div className="space-y-4">
                  {Array.isArray(missionData) && missionData.slice(0, 1).map(mission => (
                      <LevelBasedMissions key={mission.id} mission={mission} />
                  ))}
              </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Ganjaran</h3>
                  <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                      <Gift size={14} className="mr-1" />
                      <span className="text-sm font-medium">{userData.points || 750} Points</span>
                  </div>
              </div>

              <div className="space-y-3">
                  {rewardsData.map(reward => (
                      <div key={reward.id} className="flex">
                          {/* Reward information in a rectangle layout */}
                          <div className="flex-1 border border-gray-200 rounded-lg p-3 mr-2">
                              <div className="flex items-center">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                      <img src={reward.image} alt={reward.title} className="w-6 h-6 object-contain" />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm font-medium">{reward.title}</p>
                                      <div className="flex items-center mt-1">
                                          <Gift size={12} className="text-yellow-500 mr-1" />
                                          <span className="text-xs text-yellow-600">{reward.points} Points</span>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Redeem button */}
                          <button
                              onClick={() => handleRedeemReward(reward)}
                              className={`w-20 flex flex-col items-center justify-center rounded-lg text-xs font-medium ${
                                  userData.points >= reward.points
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                              disabled={userData.points < reward.points}
                          >
                              <span className="text-xs">Tebus Ganjaran</span>
                          </button>
                      </div>
                  ))}
              </div>

              <button
                  onClick={() => Inertia.visit('/rewards')}
                  className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium"
              >
                  Lihat Semua Ganjaran
              </button>
          </div>
      </div>
    );
  };

  // =================================================
  // COMPONENT 9: HEADER COMPONENTS
  // =================================================
  const Header = () => {
    // State to track scroll direction and header visibility
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Handle scroll events
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Determine if scrolling up or down by comparing current scroll position with last position
        if (currentScrollY > lastScrollY && currentScrollY > 40) {
          // Scrolling down & past threshold - hide header
          setIsHeaderVisible(false);
        } else {
          // Scrolling up or at top - show header
          setIsHeaderVisible(true);
        }

        // Update last scroll position
        setLastScrollY(currentScrollY);
      };

      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Clean up event listener
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);

    // Get current time to create appropriate greeting
    const currentHour = new Date().getHours();
    let greeting = "Hello";

    if (currentHour < 12) {
      greeting = "Selamat Pagi";
    } else if (currentHour < 18) {
      greeting = "Selamat Petang";
    } else {
      greeting = "Selamat Malam";
    }

    return (
      <div
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10 transition-transform duration-300 ${
          isHeaderVisible ? 'transform-none' : 'transform -translate-y-full'
        }`}
      >
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-lg font-medium">{greeting}, {userData.name}!</span>
          </div>
        </div>
      </div>
    );
  };

  // =================================================
  // MAIN APP ASSEMBLY
  // =================================================

  // If logged in, show appropriate page based on currentPage state
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="pt-16 pb-20">
        {currentPage === 'dashboard' && <DashboardPage />}
      </div>

      {/* Replace the OnboardingModal with StepByStepOnboarding */}
      {showOnboarding && <StepByStepOnboarding />}
    </div>
  );
};

export default AffiliateDashboard;
