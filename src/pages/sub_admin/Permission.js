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
  // generateManager("offer_manager", { shownAdd: true, shownAll: true }),
  // generateManager("trading_question_manager", { shownAdd: true, shownAll: true }),
  // generateManager("player_card_manager", { shownAdd: true, shownAll: true }),
  // generateManager("player_stock_manager", { shownAdd: true, shownAll: true }),
  // generateManager("notification_manager", { shownAdd: true, shownAll: true }),
  generateManager("game_type_manager", { shownAdd: false, shownAll: true }),
  generateManager("static_page_management", { shownAdd: true, shownAll: true }),
  generateManager("how_to_play_manager", { shownAdd: true, shownAll: true }),
  // generateManager("settings", { shownAdd: true, shownAll: true }),
  generateManager("FAQ", { shownAdd: true, shownAll: true }),
  generateManager("email_manager", { shownAdd: true, shownAll: true }),
];

export default Permission;
