const generateManager = (manager, options = {}) => ({
  manager,
  add: options.add ?? false,
  edit: options.edit ?? false,
  view: options.view ?? false,
  shownView: options.shownView ?? true,
  shownAdd: options.shownAdd ?? true,
  shownAll: options.shownAll ?? true,
});

const Permission = [
  generateManager("dashboard", { shownAdd: true, shownAll: true }),
  generateManager("user_manager", { shownAdd: true, shownAll: true }),
  generateManager("subAdmin_manager", { shownAdd: true, shownAll: true }),
  generateManager("offer_manager", { shownAdd: true, shownAll: true }), 
  generateManager("trading_question_manager", { shownAdd: true, shownAll: true }), 
  generateManager("notification_manager", { shownAdd: true, shownAll: true }),
  generateManager("static_page_management", { shownAdd: true, shownAll: true }),
  generateManager("banner_manager", { shownAdd: true, shownAll: true }),
  generateManager("settings", { shownAdd: true, shownAll: true }),
  generateManager("FAQ", { shownAdd: true, shownAll: true }),
  generateManager("email_manager", { shownAdd: true, shownAll: true }),

];

export default Permission;







