import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import seoLandingPagesService from '@/services/api/seoLandingPagesService';
import caseStudiesService from '@/services/api/caseStudiesService';

function SEOLandingPage() {
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPageData();
  }, [location.pathname]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract slug from pathname
      const slug = location.pathname.replace('/', '');
      
      const pageData = await seoLandingPagesService.getBySlug(slug);
      
      if (!pageData) {
        setError('Page not found');
        return;
      }
      
      setPageData(pageData);
      
      // Load related case study
      if (pageData.caseStudyId) {
        const caseStudyData = await caseStudiesService.getById(pageData.caseStudyId);
        setCaseStudy(caseStudyData);
      }
    } catch (err) {
      setError('Failed to load page data');
      console.error('Error loading page data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!pageData) return <Error message="Page not found" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
                {pageData.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                {pageData.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  variant="primary" 
                  size="lg"
                  asChild
                >
                  <Link to="/contact">Get Started Today</Link>
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  asChild
                >
                  <Link to={`/industries/${pageData.industryDetailSlug}`}>
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {pageData.heroStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose Our {pageData.title} Services?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our specialized approach addresses the unique challenges facing your practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageData.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name={benefit.icon} className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8">
                Common Challenges We Address
              </h2>
              <div className="space-y-4">
                {pageData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ApperIcon name="AlertCircle" className="text-red-500 mt-1" size={20} />
                    <p className="text-neutral-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-8">
                Our Proven Solutions
              </h2>
              <div className="space-y-4">
                {pageData.solutions.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ApperIcon name="CheckCircle" className="text-green-500 mt-1" size={20} />
                    <p className="text-neutral-700">{solution}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      {caseStudy && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Success Story
              </h2>
              <p className="text-xl text-neutral-600">
                See how we helped {caseStudy.practiceName} achieve remarkable results
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    {caseStudy.practiceName}
                  </h3>
                  <blockquote className="text-lg md:text-xl mb-8 italic">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  <Button variant="secondary" size="lg" asChild>
                    <Link to="/case-studies">View All Case Studies</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(caseStudy.metrics).map(([key, value], index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">
                        {value}
                      </div>
                      <div className="text-white/80 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Specialties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Related Specialties
            </h2>
            <p className="text-xl text-neutral-600">
              Explore SEO services for other healthcare practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pageData.relatedSpecialties.map((specialty, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {specialty.title}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {specialty.description}
                </p>
                <Button variant="outline" asChild>
                  <Link to={`/${specialty.slug}`}>Learn More</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Grow Your Practice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of healthcare professionals who have transformed their practices with our specialized SEO services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/contact">Get Your Free Consultation</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to={`/industries/${pageData.industryDetailSlug}`}>
                View Industry Details
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SEOLandingPage;