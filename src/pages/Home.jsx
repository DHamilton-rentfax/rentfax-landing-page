// src/pages/Home.jsx
import { FeatureBox } from '../components/FeatureBox';

export const Home = () => {
  return (
    <div className="space-y-24 max-w-7xl mx-auto p-6">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-10">
        <h1 className="text-4xl md:text-6xl font-bold">
          Rent Smarter. Rent Safer. RentFax.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your Renter’s Risk — Measured Instantly.
        </p>
        <a href="#newsletter" className="inline-block px-6 py-3 mt-6 bg-black text-white rounded hover:bg-gray-800">
          Join the Waitlist
        </a>
      </section>

      {/* FEATURE SECTION */}
      <section className="grid md:grid-cols-4 gap-8 text-center">
        <FeatureBox 
          icon="🛡️" 
          title="Real-Time Risk Scores" 
          description="Instantly evaluate customer reliability before renting." 
        />
        <FeatureBox 
          icon="⚡" 
          title="Lightning-Fast Reports" 
          description="Get detailed reports in under 60 seconds." 
        />
        <FeatureBox 
          icon="🔒" 
          title="Built-In Fraud Detection" 
          description="Proactively detect and block high-risk renters." 
        />
        <FeatureBox 
          icon="🌍" 
          title="Global Scalability" 
          description="Designed for rental businesses of all sizes." 
        />
      </section>

      {/* ABOUT SECTION */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">About RentFax</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          RentFax is your trusted partner in rental risk assessment. We protect rental businesses from fraud, defaults, and costly damages — before the keys hand off.
        </p>
      </section>

      {/* NEWSLETTER SECTION */}
      <section id="newsletter" className="flex justify-center">
        <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl">
          {/* Drop your Brevo Embed Form Here */}
          <div dangerouslySetInnerHTML={{ __html: `
            <!-- Begin Brevo Embed Code -->
            <div class="sib-form" style="text-align: center;">
              <div id="sib-container" class="sib-container">
                <form id="sib-form" method="POST" action="https://sibforms.com/serve/YOURFORMURL">
                  <input type="text" placeholder="Your email" class="input" />
                  <button type="submit" class="px-6 py-3 bg-black text-white rounded mt-4 hover:bg-gray-800">Subscribe</button>
                </form>
              </div>
            </div>
            <!-- End Brevo Embed Code -->
          ` }} />
        </div>
      </section>
    </div>
  );
};
