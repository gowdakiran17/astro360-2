import ProAstrologerHome from '../components/dashboard/modern/ProAstrologerHome';
import MainLayout from '../components/layout/MainLayout';

const MainDashboard = () => {
    return (
        <MainLayout
            title="Personalized Insights"
            breadcrumbs={['Dashboard', 'Main']}
            showHeader={true}
            disableContentPadding={true}
        >
            <ProAstrologerHome />
        </MainLayout>
    );
};

export default MainDashboard;
