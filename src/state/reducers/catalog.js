import ActionTypes from '../actions/action-types';

/**
 * catalogReducer
 */
export const catalogReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_RESOURCE:
      if (state.some(m => m.manifestId === action.manifestId)) return state;

      return [
        { manifestId: action.manifestId },
        ...state,
      ];
    case ActionTypes.ADD_WINDOW:
    case ActionTypes.UPDATE_WINDOW:
      if (state.some(m => m.manifestId === action.window.manifestId)) return state;

      return [
        { manifestId: action.window.manifestId },
        ...state,
      ];
    case ActionTypes.REMOVE_RESOURCE:
      return state.filter(r => r.manifestId !== action.manifestId);
    case ActionTypes.IMPORT_CONFIG:
      return action.config.catalog || [];
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.catalog || [];
    default:
      return state;
  }
};
