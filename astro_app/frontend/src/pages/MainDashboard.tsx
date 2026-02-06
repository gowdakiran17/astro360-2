import ResponsiveDashboard from '../components/dashboard/mobile-first/ResponsiveDashboard';
import MainLayout from '../components/layout/MainLayout';

const MainDashboard = () => {
    return (
        <MainLayout
            title="Personalized Insights"
            breadcrumbs={['Dashboard', 'Main']}
            showHeader={true}
            disableContentPadding={true}
        >
            <ResponsiveDashboard />
        </MainLayout>
    );
};

export default MainDashboard;
