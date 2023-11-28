import Home from "pages/Home";
import SharedLayout from "utils/SharedLayout";
import { useTranslation } from "react-i18next";
import SubAdmin from "pages/sub_admin/SubAdmin";
import SubAdd from "pages/sub_admin/SubAdd";
import StaticContent from "pages/static_Contents/StaticContent";
import AddStaticContent from "pages/static_Contents/AddStaticContent";
import EditStaticContent from "pages/static_Contents/EditStaticContent";
import StaticContentView from "pages/static_Contents/StaticContentView";
import SupportManager from "pages/dailyreward_manager/DailyRewards";
import NotificationManager from "pages/notification_manager/NotificationManager";
import AddNotification from "pages/notification_manager/AddNotification";
import Profile from "pages/profile/Profile";
import ChangePassword from "pages/auth/ChangePassword";
import Sidebar from "components/sidebar/Sidebar";
import BellNotifications from "pages/notification_manager/BellNotifications";
import Faq from "pages/faqs/FAQ";
import Subscription from "pages/subscription_manager/Subscription";
import Category from "pages/gift_manager/GiftCategory";
import EmailTemplate from "pages/email_template_manager/EmailTemplate";
import AddEditEmail from "pages/email_template_manager/AddEditEmail";
import Settings from "pages/settings/Settings";
import Transaction from "pages/transection_manager/Transaction";
import Login from "pages/Login";
import User from "pages/users/User";
import UserView from "pages/users/UserView";
import InterestManager from "pages/interests_manager/InterestManager";
import CoinsManager from "pages/coins-packs-manager/CoinsManager";
import AddCoinsManager from "pages/coins-packs-manager/AddCoinsManager";
import SubscriptionAddEditView from "pages/subscription_manager/SubscriptionAddEditView";
import PostManager from "pages/post_manager/PostManager";
import DailyRewards from "pages/dailyreward_manager/DailyRewards";
import CountryManager from "pages/country_manager/CountryManager";
import GiftCategory from "pages/gift_manager/GiftCategory";
import EarningCategory from "pages/earning_manager/EarningCategory";
import AddEditGifts from "pages/gift_manager/AddEditGifts";
import CoinPurchaseListing from "pages/coin-purchase-listing/CoinPurchaseListing";
import VideoManager from "pages/video_manager/VideoManager";
import ReportAbuse from "pages/report_abuse_manager/ReportAbuse";
import GiftView from "pages/gift_manager/GiftView";
import EarningView from "pages/earning_manager/EarningView";
import Sound from "pages/sound/Sound";
import Stickers from "pages/stickers/Stickers";
import Effects from "pages/effects/Effects";
import Filters from "pages/filters/Filters";

const UseChange = ({ data }) => {
  const { t } = useTranslation();
  return t(data);
};

const AdminRoutes = {
  // All common routes
  path: "/",
  element: <SharedLayout type={<Sidebar />} />,
  children: [
    {
      path: "/dashboard",
      element: <Home />,
      name: (
        <>
          <UseChange data="NAV_DASHBOARD" />
        </>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sub-admin-manager",
      element: <SubAdmin />,
      name: (
        <>
          <UseChange data="SUB_ADMIN_MANAGERS" />
        </>
      ),
    },
    {
      path: "/users",
      element: <User />,
      name: (
        <>
          <UseChange data="USER_MANAGER" />
        </>
      ),
    },

    {
      path: "/users/view",
      element: <UserView />,
      name: (
        <>
          <UseChange data="USER_MANAGER" />
        </>
      ),
    },
    {
      path: "/coin-purchase-listing",
      element: <CoinPurchaseListing />,
      name: (
        <>
          <UseChange data="COIN_PURCHASE_LISTING" />
        </>
      ),
    },
    {
      path: "/sub-admin-manager/add",
      element: <SubAdd />,
      name: (
        <>
          <UseChange data="SUB_ADMIN_MANAGERS" />
        </>
      ),
    },
    {
      path: "/interests_manager",
      element: <InterestManager />,
      name: (
        <>
          <UseChange data="INTERESTS_MANAGER" />
        </>
      ),
    },

    {
      path: "/coins_pack_manager",
      element: <CoinsManager />,
      name: (
        <>
          <UseChange data="COIN_PACK_MANAGER" />
        </>
      ),
    },

    {
      path: "/sound",
      element: <Sound />,
      name: (
        <>
          <UseChange data="SOUND" />
        </>
      ),
    },

    {
      path: "/stickers",
      element: <Stickers />,
      name: (
        <>
          <UseChange data="STICKERS" />
        </>
      ),
    },

    {
      path: "/effects",
      element: <Effects />,
      name: (
        <>
          <UseChange data="EFFECTS" />
        </>
      ),
    },

    {
      path: "/filters",
      element: <Filters />,
      name: (
        <>
          <UseChange data="FILTERS" />
        </>
      ),
    },

    {
      path: "/coins_pack_manager/add",
      element: <AddCoinsManager />,
      name: (
        <>
          <UseChange data="COIN_PACK_MANAGER" />
        </>
      ),
    },
    {
      path: "/coins_pack_manager/edit",
      element: <AddCoinsManager />,
      name: (
        <>
          <UseChange data="COIN_PACK_MANAGER" />
        </>
      ),
    },

    {
      path: "/subscription-manager",
      element: <Subscription />,
      name: (
        <>
          <UseChange data="SUBSCRIPTION_MANAGERS" />
        </>
      ),
    },

    {
      path: "/report_abuse_manager",
      element: <ReportAbuse />,
      name: (
        <>
          <UseChange data="REPORT_ABUSE_MANAGER" />
        </>
      ),
    },

    {
      path: "/subscription-manager/add",
      element: <SubscriptionAddEditView />,
      name: (
        <>
          <UseChange data="SUBSCRIPTION_MANAGERS" />
        </>
      ),
    },

    {
      path: "/post_manager",
      element: <PostManager />,
      name: (
        <>
          <UseChange data="POST_MANAGER" />
        </>
      ),
    },

    {
      path: "/video_manager",
      element: <VideoManager />,
      name: (
        <>
          <UseChange data="VIDEO_MANAGER" />
        </>
      ),
    },

    {
      path: "/country_manager",
      element: <CountryManager />,
      name: (
        <>
          <UseChange data="COUNTRY_MANAGER" />
        </>
      ),
    },

    {
      path: "/country_manager/add",
      element: <CountryManager />,
      name: (
        <>
          <UseChange data="COUNTRY_MANAGER" />
        </>
      ),
    },

    {
      path: "/gift-manager",
      element: <GiftCategory />,
      name: (
        <>
          <UseChange data="NAV_CATEGORY_MANAGER" />
        </>
      ),
    },

    {
      path: "/gift-manager/add",
      element: <AddEditGifts />,
      name: (
        <>
          <UseChange data="NAV_CATEGORY_MANAGER" />
        </>
      ),
    },
    {
      path: "/gift-manager/edit",
      element: <AddEditGifts />,
      name: (
        <>
          <UseChange data="NAV_CATEGORY_MANAGER" />
        </>
      ),
    },

    {
      path: "/gift-manager/view",
      element: <GiftView />,
      name: (
        <>
          <UseChange data="USER_MANAGER" />
        </>
      ),
    },
    {
      path: "/earning-manager",
      element: <EarningCategory />,
      name: (
        <>
          <UseChange data="NAV_EARNING_MANAGER" />
        </>
      ),
    },
    {
      path: "/earning-manager/view",
      element: <EarningView />,
      name: (
        <>
          <UseChange data="NAV_EARNING_MANAGER" />
        </>
      ),
    },

    {
      path: "/category",
      element: <Category />,
      name: (
        <>
          <UseChange data="NAV_CATEGORY_MANAGER" />
        </>
      ),
    },
    {
      path: "/email-manager",
      element: <EmailTemplate />,
      name: (
        <>
          <UseChange data="EMAIL_TEMPLATE_MANAGER" />
        </>
      ),
    },
    {
      path: "/email-manager/add",
      element: <AddEditEmail />,
      name: (
        <>
          <UseChange data="EMAIL_TEMPLATE_MANAGER" />
        </>
      ),
    },
    {
      path: "/email-manager/edit",
      element: <AddEditEmail />,
      name: (
        <>
          <UseChange data="EMAIL_TEMPLATE_MANAGER" />
        </>
      ),
    },

    {
      path: "/StaticContent",
      element: <StaticContent />,
      name: (
        <>
          <UseChange data="NAV_STATIC_CONTENTS" />
        </>
      ),
    },
    {
      path: "/StaticContent/add",
      element: <AddStaticContent />,
      name: (
        <>
          <UseChange data="NAV_STATIC_CONTENTS" />
        </>
      ),
    },
    {
      path: "/StaticContent/edit",
      element: <EditStaticContent />,
      name: (
        <>
          <UseChange data="NAV_STATIC_CONTENTS" />
        </>
      ),
    },
    {
      path: "/StaticContent/view",
      element: <StaticContentView />,
      name: (
        <>
          <UseChange data="NAV_STATIC_CONTENTS" />
        </>
      ),
    },
    {
      path: "/daily-reward-manager",
      element: <DailyRewards />,
      name: (
        <>
          <UseChange data="DAILY_REWARD" />
        </>
      ),
    },
    {
      path: "/notification_manager",
      element: <NotificationManager />,
      name: (
        <>
          <UseChange data="NOTIFICATION_MANAGER" />
        </>
      ),
    },

    {
      path: "/notification_manager/add",
      element: <AddNotification />,
      name: (
        <>
          <UseChange data="NOTIFICATION_MANAGER" />
        </>
      ),
    },
    {
      path: "/faqs",
      element: <Faq />,
      name: (
        <>
          <UseChange data="FAQS" />
        </>
      ),
    },
    {
      path: "/setting",
      element: <Settings />,
      name: (
        <>
          <UseChange data="NAV_SETTINGS" />
        </>
      ),
    },
    {
      path: "/profile",
      element: <Profile />,
      name: (
        <>
          <UseChange data="NAV_EARNING_MANAGER" />
        </>
      ),
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
      name: (
        <>
          <UseChange data="NAV_EARNING_MANAGER" />
        </>
      ),
    },
    {
      path: "/notification-list",
      element: <BellNotifications />,
      name: (
        <>
          <UseChange data="O_NOTIFICATION" />
        </>
      ),
    },
    {
      path: "/",
      element: <Home />,
      name: (
        <>
          <UseChange data="NAV_DASHBOARD" />
        </>
      ),
    },
  ],
};

export default AdminRoutes;
