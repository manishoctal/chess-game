const apiPath = Object.freeze({
  loginUser: "/v1/admin/login",
  getUsers: "/v1/admin/user",
  getUserDetails: "/v1/admin/user/details",
  acceptRewardRequest: "v1/admin/rewardRequest/accept",
  rejectRewardRequest: "v1/admin/rewardRequest/reject",
  getReports: "/v1/admin/report",
  rewardRequest: "/v1/admin/rewardRequest",
  userProfile: "/v1/user/profile",
  updateUser: "/v1/admin/user/edit",
  getSubAdmin: "v1/admin/subAdmin",
  editSubAdmin: "v1/admin/subAdmin",
  bannerDelete: "v1/admin/banner",
  getBanner: "v1/admin/banner",
  bannerEdit: "v1/admin/banner",
  forgetPassword: "/v1/admin/forgot-password",
  resetPassword: "/v1/admin/reset-password",
  changePassword: "/v1/admin/change-password",
  userVerify: "/v1/admin/user/verify",
  editProfile: "/v1/admin/edit-profile",
  getStaticContent: "/v1/admin/static-content",
  updateSettings: "/v1/admin/setting",
  emailTemplate: "/v1/admin/email-template",
  emailStatus: "/v1/admin/email-template/change-status",
  notificationToggle: "/v1/admin/notification-toggle",
  changeContentStatus: "/v1/admin/static-content/change-status",
  getFAQs: "/v1/admin/faq",
  reOrderFaq: "/v1/admin/faq/reOrderFAQ",
  reOrderBanner: "/v1/admin/banner/arrange-order",
  searchUsers: "/v1/admin/user/search",
  bannerAdd: "/v1/admin/banner",
  changeFAQStatus: "/v1/admin/faqs/status",
  reportAbuseListing: "v1/admin/report-abuse",
  changeStatus: "/v1/admin/change-status",
  verficationDetail: "v1/admin/user/verification-details",
  notifications: "v1/admin/notification",
  getSettings: "/v1/admin/setting",
  getUserTransaction: "/v1/admin/transaction/getUserTransaction",
  getDashboardDetails: "/v1/admin/dashboard",
  earningManagerGraph: "/v1/admin/earningManagerGraph",
  addMoneyToUserWallet: "/v1/admin/user/addMoneyToUserWallet",
  transactionList: "/v1/admin/transaction/transactionList",
  scratchCardHistory: "/v1/admin/scratchCard/history",
  addScratchCard: "/v1/admin/scratchCard",
  viewScratchCard: "/v1/admin/user/getUserInfo",
  addBulkScratchCard: "/v1/admin/scratchCard/generate/bulk-scratch-cards",
  depositAmount: "/v1/admin/depositAmount",
  supportRequest: "/v1/admin/user/list/supportRequest",
  sendFeedbackEmail: "/v1/admin/user/sendFeedbackEmail",
  listAddMoneyToUserWallet: "/v1/admin/user/listAddMoneyToUserWallet",
  allNotificationUser: "/v1/admin/user/all-users",
  approveAndRejectKyc: "/v1/admin/user/kycStatus",
  getEarningManagerGraph: "/v1/admin/earningManagerGraph",
  walletTransactionList: "/v1/admin/transaction/getTransactionList",
  getAllOffer: "/v1/admin/offer",
  getOfferUsers: "/v1/admin/offer/get-offer-users",
  downloadCsv: "/v1/admin/offer/csv-download",
  getFormatList: "/v1/admin/questions/getMatchFormatType",
  getMatchList: "/v1/admin/questions/getMatchesList",
  addQuestions: "/v1/admin/questions",
  tradingQuestionList: "/v1/admin/questions",
  announceResult: "/v1/admin/questions/announceResult",
  getPlayerList: "/v1/admin/questions/getMatchPlayersList",
  getMasterData: "/v1/admin/player-card/get-master-data",
  getPlayerCardList: "/v1/admin/player-card/list",
  setCardLimit: "/v1/admin/player-card",
  generatePreSignUrl: "/v1/admin/player-card/generate-pre-signed-url",
  getPlayerDataSearched: "/v1/admin/player-card/search-keyword",
  getGameType: "/v1/admin/gameType",
  getCheckUser: "/v1/admin/check-user",
  getImagePath: "/v1/admin/presigned-url",
  getImageBanner: "/v1/admin/banner/presigned-url",
  getSubscription: "/v1/admin/subscription",
  subscriptionEdit: "/v1/admin/subscription",
  getSubscriptionUsers: "/v1/admin/subscription/user-list",
  getAchievement: "v1/admin/achievement",
  getAllAchievement: "v1/admin/achievement",
  getImageAchievement: "/v1/admin/achievement/presigned-url",
  getAchievementUsers: "/v1/admin/achievement/user-list",
  getGraphUserDetails: "/v1/admin/user-graph",
  getGraphAdminDetails: "/v1/admin/earning-graph",
  downloadDashboardCsv: "/v1/admin/csv-download",
});

export default apiPath;
