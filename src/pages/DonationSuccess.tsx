import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { CheckCircle, Download, Mail, Share2, Heart, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [donationDetails, setDonationDetails] = useState({
    amount: searchParams.get('amount') || '0',
    frequency: searchParams.get('frequency') || 'one-time',
    donationId: searchParams.get('donation_id') || '',
    receiptUrl: searchParams.get('receipt_url') || '',
    designation: searchParams.get('designation') || 'general',
  });

  useEffect(() => {
    // Trigger confetti animation on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#F2C94C', '#E07A8A', '#4B2E6D'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#F2C94C', '#E07A8A', '#4B2E6D'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadReceipt = () => {
    if (donationDetails.receiptUrl) {
      window.open(donationDetails.receiptUrl, '_blank');
    }
  };

  const handleEmailReceipt = async () => {
    // This would trigger an API call to send the receipt via email
    console.log('Sending receipt via email...');
  };

  const handleShare = () => {
    const shareText = `I just donated to She Rises to help empower women in our community! Join me in making a difference.`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: 'I donated to She Rises!',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  const getDesignationName = (designation: string) => {
    const designations: { [key: string]: string } = {
      general: 'Greatest Need',
      housing: 'Housing Program',
      employment: 'Workforce Development',
      family: 'Family Services',
      education: 'Education Programs',
      crisis: 'Crisis Response',
    };
    return designations[designation] || 'General Fund';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-soft py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <Card className="mb-8 overflow-hidden">
              <div className="bg-crown-gold p-8 text-center">
                <CheckCircle className="h-20 w-20 text-white mx-auto mb-4" />
                <h1 className="font-serif text-3xl font-bold text-royal-plum mb-2">
                  Thank You for Your Donation!
                </h1>
                <p className="text-royal-plum/80 text-lg">
                  Your generosity makes a real difference
                </p>
              </div>

              <CardContent className="p-8">
                {/* Donation Summary */}
                <div className="bg-warm-cream rounded-lg p-6 mb-6">
                  <h2 className="font-serif text-xl font-bold text-royal-plum mb-4">
                    Donation Summary
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold text-royal-plum">
                        ${donationDetails.amount}
                        {donationDetails.frequency === 'monthly' && ' monthly'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Designation:</span>
                      <span className="font-semibold text-royal-plum">
                        {getDesignationName(donationDetails.designation)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donation ID:</span>
                      <span className="font-mono text-sm text-royal-plum">
                        {donationDetails.donationId || 'Processing...'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-semibold text-royal-plum">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Impact Message */}
                <Card className="border-l-4 border-l-crown-gold mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                      Your Impact
                    </h3>
                    <p className="text-muted-foreground">
                      {donationDetails.frequency === 'monthly' ? (
                        <>Your monthly donation of ${donationDetails.amount} will provide ongoing support
                        for women in our community, helping them rebuild their lives with dignity and hope.</>
                      ) : (
                        <>Your donation of ${donationDetails.amount} will directly support our programs,
                        providing essential services to women and families in need.</>
                      )}
                    </p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <Button
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="w-full"
                    disabled={!donationDetails.receiptUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>

                  <Button
                    onClick={handleEmailReceipt}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Receipt
                  </Button>
                </div>

                {/* Share */}
                <div className="text-center p-6 bg-gradient-soft rounded-lg mb-6">
                  <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                    Spread the Word
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Help us reach more people by sharing your support
                  </p>
                  <Button
                    onClick={handleShare}
                    className="bg-lotus-rose hover:bg-lotus-rose/90 text-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Your Donation
                  </Button>
                </div>

                {/* Tax Information */}
                <div className="bg-white border border-border rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tax Information:</strong> She Rises is a 501(c)(3) nonprofit organization.
                    Your donation is tax-deductible to the fullest extent allowed by law.
                    Our EIN is XX-XXXXXXX. Please keep your receipt for tax purposes.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-royal-plum">
                    What's Next?
                  </h3>

                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      ✓ You'll receive a detailed receipt via email shortly
                    </p>
                    {donationDetails.frequency === 'monthly' && (
                      <p className="text-muted-foreground">
                        ✓ Your monthly donation will be processed on this day each month
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      ✓ You'll receive regular updates about your impact
                    </p>
                    <p className="text-muted-foreground">
                      ✓ You can manage your donation preferences anytime from your donor portal
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link to="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Button>
                  </Link>

                  <Link to="/donate" className="flex-1">
                    <Button className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                      <Heart className="mr-2 h-4 w-4" />
                      Make Another Donation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Thank You Message */}
            <Card className="bg-royal-plum text-white">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-crown-gold mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold mb-3">
                  From All of Us at She Rises
                </h2>
                <p className="text-white/90">
                  Your support means everything to the women and families we serve.
                  Together, we're creating a community where every woman has the opportunity
                  to rise, thrive, and achieve her full potential. Thank you for being
                  part of this journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonationSuccess;