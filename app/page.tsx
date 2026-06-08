import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Features } from "@/components/homepage/Features";
import { Testimonial } from "@/components/homepage/Testimonial";
import { CTASection } from "@/components/homepage/CTASection";

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonial />
      <CTASection />
    </>
  );
};

export default Home;
