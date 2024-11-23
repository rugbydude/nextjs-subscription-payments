import Layout from '../components/Layout';
import Pricing from '../components/Pricing';
import ProtectedRoute from '../components/ProtectedRoute';

const PricingPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Pricing />
      </Layout>
    </ProtectedRoute>
  );
};

export default PricingPage;
