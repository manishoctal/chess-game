import Home from "pages/Home";
import SharedLayout from "utils/SharedLayout";
import { useTranslation } from "react-i18next";
import SubAdmin from "pages/sub_admin/SubAdmin";
import SubAdd from "pages/sub_admin/SubAdd";
import BannerManager from "pages/banner_manager/Banner";
import OfferManager from "pages/offer_manager/OfferManager";
import ViewOfferManager from "pages/offer_manager/ViewOfferManager";
import StaticContent from "pages/static_Contents/StaticContent";
import AddStaticContent from "pages/static_Contents/AddStaticContent";
import EditStaticContent from "pages/static_Contents/EditStaticContent";
import StaticContentView from "pages/static_Contents/StaticContentView";
import NotificationManager from "pages/notification_manager/NotificationManager";
import Profile from "pages/profile/Profile";
import ChangePassword from "pages/auth/ChangePassword";
import Sidebar from "components/sidebar/Sidebar";
import BellNotifications from "pages/notification_manager/BellNotifications";
import Faq from "pages/faqs/FAQ";
import EmailTemplate from "pages/email_template_manager/EmailTemplate";
import AddEditEmail from "pages/email_template_manager/AddEditEmail";
import Settings from "pages/settings/Settings";
import Login from "pages/Login";
import User from "pages/users/User";
import UserView from "pages/users/UserView";
import NotificationAdd from "pages/notification_manager/NotificationAdd";
import AuthorizationRoute from "utils/AuthorizationRoute";
import TradingQuestionManager from "pages/trading_question_manager/TradingQuestionManager";
import ViewTradingQuestionManager from "pages/trading_question_manager/ViewTradingQuestionManager";
import PlayerCardManager from "pages/player_card_manager/PlayerCardManager";
import ViewPlayerCardManager from "pages/player_card_manager/ViewPlayerCard";
import PlayerStockManager from "pages/player_stock_manager/PlayerStockManager";
import ViewPlayerStockManager from "pages/player_stock_manager/ViewScoreManager";
import GameType from "pages/game_type_manager/GameType";
import SubscribedManager from "pages/subscribed_manager/SubscribedManager";
import ViewSubscriptionManager from "pages/subscribed_manager/ViewSubscriptionManager";
import AchievementBadges from "pages/achievement_and_badges/AchievementBadges";
import ViewAchievementManager from "pages/achievement_and_badges/ViewAchievementManager";
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
      name: <UseChange data="NAV_DASHBOARD" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sub-admin-manager",
      element: <SubAdmin />,
      name: <UseChange data="SUB_ADMIN_MANAGERS" />,
    },
    {
      path: "/users",
      element: (
        <AuthorizationRoute>
          {" "}
          <User />
        </AuthorizationRoute>
      ),
      name: <UseChange data="USER_MANAGER" />,
    },

    {
      path: "/users/view",
      element: <UserView />,
      name: <UseChange data="USER_MANAGER" />,
    },

    {
      path: "/sub-admin-manager/add",
      element: (
        <AuthorizationRoute>
          <SubAdd />
        </AuthorizationRoute>
      ),
      name: <UseChange data="SUB_ADMIN_MANAGERS" />,
    },
    {
      path: "/game-type-manager",
      element: (
        <AuthorizationRoute>
          {" "}
          <GameType />
        </AuthorizationRoute>
      ),
      name: <UseChange data="GAME_TYPE_MANAGER" />,
    },
    {
      path: "/subscribed-manager",
      element: (
        <AuthorizationRoute>
          {" "}
          <SubscribedManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="SUBSCRIBED_MANAGER" />,
    },
    {
      path: "/subscription-manager/view",
      element: (
        <AuthorizationRoute>
          <ViewSubscriptionManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="VIEW_OFFER_MANAGER" />,
    },

    {
      path: "/how-to-play-manager",
      element: (
        <AuthorizationRoute>
          <BannerManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="HOW_TO_PLAY_MANAGER" />,
    },

    {
      path: "/offer-manager",
      element: (
        <AuthorizationRoute>
          <OfferManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="OFFER_MANAGER" />,
    },

    {
      path: "/offer-manager/view",
      element: (
        <AuthorizationRoute>
          <ViewOfferManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="VIEW_OFFER_MANAGER" />,
    },
    {
      path: "/achievement-and-badges",
      element: (
        <AuthorizationRoute>
          <AchievementBadges />
        </AuthorizationRoute>
      ),
      name: <UseChange data="ACHIEVEMENT_AND_BADGES" />,
    },
    {
      path: "/achievement-and-badges/view",
      element: (
        <AuthorizationRoute>
          <ViewAchievementManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="ACHIEVEMENT_AND_BADGES" />,
    },

    {
      path: "/trading-question-manager",
      element: (
        <AuthorizationRoute>
          <TradingQuestionManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="TRADING_QUESTION_MANAGER" />,
    },

    {
      path: "/trading-question-manager/view",
      element: (
        <AuthorizationRoute>
          <ViewTradingQuestionManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="VIEW_TRADING_QUESTION_MANAGER" />,
    },

    {
      path: "/player-card-manager",
      element: (
        <AuthorizationRoute>
          <PlayerCardManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="PLAYER_CARD_MANAGER" />,
    },

    {
      path: "/player-card-manager/view",
      element: (
        <AuthorizationRoute>
          <ViewPlayerCardManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="VIEW_PLAYER_CARD_MANAGER" />,
    },

    {
      path: "/player-stock-manager",
      element: (
        <AuthorizationRoute>
          <PlayerStockManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="PLAYER_STOCK_MANAGER" />,
    },

    {
      path: "/player-stock-manager/view",
      element: (
        <AuthorizationRoute>
          <ViewPlayerStockManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="VIEW_PLAYER_STOCK_MANAGER" />,
    },

    {
      path: "/email-manager",
      element: (
        <AuthorizationRoute>
          <EmailTemplate />
        </AuthorizationRoute>
      ),
      name: <UseChange data="EMAIL_MANAGER" />,
    },
    {
      path: "/email-manager/edit",
      element: (
        <AuthorizationRoute>
          <AddEditEmail />
        </AuthorizationRoute>
      ),
      name: <UseChange data="EMAIL_MANAGER" />,
    },

    {
      path: "/static-content",
      element: (
        <AuthorizationRoute>
          <StaticContent />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NAV_STATIC_CONTENTS" />,
    },
    {
      path: "/static-content/add",
      element: (
        <AuthorizationRoute>
          <AddStaticContent />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NAV_STATIC_CONTENTS" />,
    },
    {
      path: "/static-content/edit",
      element: (
        <AuthorizationRoute>
          <EditStaticContent />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NAV_STATIC_CONTENTS" />,
    },
    {
      path: "/static-content/view",
      element: (
        <AuthorizationRoute>
          <StaticContentView />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NAV_STATIC_CONTENTS" />,
    },

    {
      path: "/notification_manager",
      element: (
        <AuthorizationRoute>
          {" "}
          <NotificationManager />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NOTIFICATION_MANAGER" />,
    },

    {
      path: "/notification_manager/add",
      element: (
        <AuthorizationRoute>
          {" "}
          <NotificationAdd />
        </AuthorizationRoute>
      ),
      name: <UseChange data="NOTIFICATION_MANAGER" />,
    },
    {
      path: "/faqs",
      element: (
        <AuthorizationRoute>
          <Faq />
        </AuthorizationRoute>
      ),
      name: <UseChange data="FAQS" />,
    },
    {
      path: "/setting",
      element: (
        <AuthorizationRoute>
          {" "}
          <Settings />
        </AuthorizationRoute>
      ),
      name: <UseChange data="SETTINGS" />,
    },

    {
      path: "/profile",
      element: <Profile />,
      name: <UseChange data="NAV_EARNING_MANAGER" />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
      name: <UseChange data="NAV_EARNING_MANAGER" />,
    },
    {
      path: "/notification-list",
      element: <BellNotifications />,
      name: <UseChange data="O_NOTIFICATION" />,
    },
    {
      path: "/",
      element: <Home />,
      name: <UseChange data="NAV_DASHBOARD" />,
    },
  ],
};

export default AdminRoutes;
