const apiPath = {
  loginUser: "/v1/admin/login",
  getUsers: "/v1/admin/user",
  acceptRewardRequest: "v1/admin/rewardRequest/accept",
  rejectRewardRequest: "v1/admin/rewardRequest/reject",
  getReports: "/v1/admin/report",
  rewardRequest: "/v1/admin/rewardRequest",
  userProfile: "/v1/user/profile",
  updateUser: "/v1/admin/user/edit",
  getSubAdmin: "v1/admin/subAdmin",
  editSubAdmin: "v1/admin/subAdmin",
  bannerDelete:'v1/admin/banner',
  getBanner:'v1/admin/banner',
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
  bannerAdd:'/v1/admin/banner',
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
};

export default apiPath;
