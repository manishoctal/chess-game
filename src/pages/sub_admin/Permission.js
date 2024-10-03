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
  generateManager("user_manager", { shownAdd: true, shownAll: true }),
  generateManager("game_type_manager", { shownAdd: true, shownAll: true }),
  generateManager("challenges_manager", { shownAdd: true, shownAll: true }),
  generateManager("community_moderator", { shownAdd: true, shownAll: true }),
  generateManager("notification_manager", { shownAdd: true, shownAll: true }),
  generateManager("email_manager", { shownAdd: true, shownAll: true }),
  generateManager("static_pages_management", { shownAdd: true, shownAll: true }),
  generateManager("settings", { shownAdd: true, shownAll: true }),
  generateManager("widthDrawal_request_manager", { shownAdd: true, shownAll: true }),
  generateManager("FAQ", { shownAdd: true, shownAll: true }),
  generateManager("feedback_manager", { shownAdd: true, shownAll: true }),
  generateManager("transaction_manager", { shownAdd: true, shownAll: true }),
];

export default Permission;
