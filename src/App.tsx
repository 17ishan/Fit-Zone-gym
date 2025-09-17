import './App.css';
// import { SmoothCursor } from "@/components/ui/smooth-cursor";
// import { Meteors } from "@/components/magicui/meteors";
// import Cubes from "@/Cubes";


// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu";

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServiceSection from "@/components/ServiceSection";
import ContactSection from "@/components/ContactSection";
import MembershipSection from "@/components/MembershipSection";
import GallerySection from "@/components/GallerySection";
import Navbar from "@/components/Navbar";
import BMIcalculator from "@/components/BMIcalculator";


function App() {
  return (
    <div className="relative z-0 min-h-screen font-serif  ">      

      {/* Header / Navbar */}
      {/* <header className="w-full px-0 py-5 mt-4  border-2">
        <div className="w-330 flex justify-between items-center ml-20 rounded-xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 px-16 py-5">
          <h1 className="text-4xl font-extrabold text-blue-500 tracking-wide">
            <span className="text-white">Fit</span>Zone
          </h1>
          <nav>
            <NavigationMenu >
              <NavigationMenuList className="flex gap-10 ">
                {["Home", "About Us", "Services", "Contact", "Membership", "Gallery"].map((item, idx) => (
                  <NavigationMenuItem key={idx}>
                    <span className="text-lg text-white hover:text-blue-400 cursor-pointer transition-all duration-300">
                      {item}
                    </span>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
      </header> */}

      <Navbar/>

      {/* Hero Section */}
      <div id='home'>
      <HeroSection />
      </div>


      {/* Service Section */}
      <div id='service'>
      <ServiceSection />
      </div>

      <div>
      <BMIcalculator/> 
      </div>

      {/* About Section */}
      <div id='about'>
      <AboutSection  />
      </div>

      {/* Membership Section */}
      <div id='membership'>
      <MembershipSection />
      </div>

      {/* Gallery Section */}
      <div id='gallery' >
        <GallerySection />
      </div>
      
      {/* Contact Section */}
      <div id='contact'>
      <ContactSection />
      </div>
    </div>
  );
}

export default App;
