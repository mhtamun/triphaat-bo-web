import { Page } from '../../types/types';
import AppMenu from './AppMenu';

const AppSidebar: Page = ({ isVendor }) => {
    return <AppMenu isVendor={isVendor} />;
};

export default AppSidebar;
