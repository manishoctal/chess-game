const generateManager = (id,manager, options = {}) => ({
  id,
  manager,
  add: options.add ?? false,
  edit: options.edit ?? false,
  view: options.view ?? false,
  shownView: options.shownView ?? true,
  shownAdd: options.shownAdd ?? true,
  shownAll: options.shownAll ?? true,
});

const Permission = [
  generateManager(1,"user_manager", { shownAdd: true, shownAll: true }),
  generateManager(2,"game_type_manager", { shownAdd: true, shownAll: true }),
  generateManager(3,"challenges_manager", { shownAdd: true, shownAll: true }),
  generateManager(4,"community_moderator", { shownAdd: true, shownAll: true }),
  generateManager(5,"notification_manager", { shownAdd: true, shownAll: true }),
  generateManager(6,"email_manager", { shownAdd: true, shownAll: true }),
  generateManager(7,"static_pages_management", { shownAdd: true, shownAll: true }),
  generateManager(8,"settings", { shownAdd: true, shownAll: true }),
  generateManager(9,"withdrawal_request_manager", { shownAdd: true, shownAll: true }),
  generateManager(10,"FAQ", { shownAdd: true, shownAll: true }),
  generateManager(11,"feedback_manager", { shownAdd: true, shownAll: true }),
  generateManager(12,"transaction_manager", { shownAdd: true, shownAll: true }),
  generateManager(13,"challenges_manager", { shownAdd: true, shownAll: true }),
];

export default Permission;
