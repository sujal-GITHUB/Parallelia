import React from 'react';
import { PieChart } from 'lucide-react';

const CombinedStatsCard: React.FC = () => {
  return (
    <>
      <div
        className=""
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="relative w-full flex items-center justify-center">
          {/* Stats Card */}
          <div
            className="absolute stats-card"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
              zIndex: 10, // Ensure stats card is above info card
            }}
          >
            <div className="flex items-start justify-between px-4 mb-1">
              <PieChart className="w-12 h-12 text-purple-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="text-blue-500 font-bold font-inter">
                  <span className="font-semibold font-inter">↑</span> 14%
                </div>
                <span className="text-black text-[11px] font-semibold font-inter">
                  This week
                </span>
              </div>
            </div>

            <div className="mt-4 px-4">
              <div className="text-gray-800 text-sm font-bold font-inter mb-1">
                Issues Fixed
              </div>
              <div className="text-3xl font-bold text-black font-poppins">
                500K+
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div
            className="absolute info-card"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
              zIndex: 5, // Lower z-index for info card
            }}
          >
            <div className="text-center flex pt-5 px-4 justify-center items-center gap-3">
              <img src="logo1.png" width={30} alt="" />
              <h2 className="text-md font-extrabold font-inter">
                AI to Detect & Autofix Bad Code
              </h2>
            </div>
            <hr className="my-3 w-full border-gray-200" />
            <div className="flex justify-between w-full px-4 pb-7">
              <div className="text-center">
                <p className="text-lg font-poppins font-bold">30+</p>
                <p className="text-sm font-inter text-black">Language Support</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-poppins font-bold">10K+</p>
                <p className="text-sm font-inter text-black">Developers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-poppins font-bold">100K+</p>
                <p className="text-sm font-normal font-inter text-black">
                  Hours Saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .stats-card {
            width: 256px;
            border-radius: 24px;
            padding: 16px;
            top: -30px;
            right: -210px;
          }

          .info-card {
            left: -200px;
            border-radius: 24px;
            bottom: 16px;
            width: 384px;
          }

          @media (max-width: 768px) {
            .stats-card {
              right: -210px;
            }

            .info-card {
              left: -200px;
            }
          }

          @media (max-width: 480px) {
            .stats-card {
              right: -150px;
              width: 180px;
            }

            .info-card {
              left: -120px;
              width: 240px;
            }

            .text-lg {
              font-size: 14px !important;
            }

            .text-sm {
              font-size: 10px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default CombinedStatsCard;
